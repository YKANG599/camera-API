import {Request, Response} from 'express';
import {readdirSync} from "node:fs";

const screenshot = require('screenshot-desktop');
const { exec } = require('child_process');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath('C:\\Users\\Asus\\Downloads\\ffmpeg-7.0.2-essentials_build\\ffmpeg-7.0.2-essentials_build\\bin\\ffmpeg.exe');


export class RecordingController {
    static recordingProcess: any = null;

    static async startRecording(req: Request, res: Response) {
        try {
            const desktopFilePath = __dirname + `/../desktopRecordings/recording_${Date.now()}.mp4`;
            const webcamFilePath = __dirname + `/../webcamRecordings/webcam_${Date.now()}.mp4`;

            // Check if a recording is already in progress
            if (!RecordingController.recordingProcess) {
                // Construct the FFmpeg command for dual recording
                const command = `ffmpeg -f dshow -i video="screen-capture-recorder" -framerate 30 -vcodec libx264 -preset ultrafast -crf 23 -pix_fmt yuv420p -vf "drawtext=text='Desktop':fontcolor=red@0.5:fontsize=100:x=(w-text_w)/2:y=(h-text_h)/2" -map 0:v ${desktopFilePath} -f dshow -i video="USB2.0 HD UVC WebCam" -framerate 30 -vcodec libx264 -preset ultrafast -crf 23 -pix_fmt yuv420p -vf "drawtext=text='Webcam':fontcolor=blue@0.5:fontsize=100:x=(w-text_w)/2:y=(h-text_h)/2" -map 1:v ${webcamFilePath}`;

                // Start recording using exec
                RecordingController.recordingProcess = exec(command, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error during recording: ${error.message}`);
                        RecordingController.recordingProcess = null;
                        if (!res.headersSent) {
                            res.status(500).send({ message: 'Error during recording.', error: error.message });
                        }
                        return;
                    }
                    console.log(`Recording process stdout: ${stdout}`);
                    console.error(`Recording process stderr: ${stderr}`);
                });

                res.send({
                    message: 'Recording started successfully.',
                    desktopFilePath,
                    webcamFilePath
                });

                // Handle recording process exit
                RecordingController.recordingProcess.on('exit', (code, signal) => {
                    console.log(`Recording stopped with code ${code} and signal ${signal}.`);
                    RecordingController.recordingProcess = null;
                });
            } else {
                res.status(400).send({ message: 'Recording is already running.' });
            }
        } catch (err) {
            console.log('Error: starting recording:', err);
            res.status(500).send({ message: 'Error: starting recording.' });
        }
    }

    // Stop recording
    static stopRecording(req, res) {
        try {
            if (RecordingController.recordingProcess) {
                // Send 'q' to FFmpeg's stdin to stop recording gracefully
                RecordingController.recordingProcess.stdin.write('q');
                RecordingController.recordingProcess.on('close', () => {
                    console.log('Recording stopped successfully.');
                    res.send({ message: 'Recording stopped successfully.' });
                });
            } else {
                res.status(400).send({ message: 'No recording in progress.' });
            }
        } catch (err) {
            console.log('Error: stopping recording:', err);
            res.status(500).send({ message: 'Error: stopping recording.' });
        }
    }

    static async getAllRecordings(req, res) {
        try {
            const desktopDir = __dirname + `/../desktopRecordings`;
            const webcamDir = __dirname + `/../webcamRecordings`;

            // Read all files in the desktop and webcam directories
            const desktopFiles = readdirSync(desktopDir);
            const webcamFiles = readdirSync(webcamDir);

            console.log('Desktop files:', desktopFiles);
            console.log('Webcam files:', webcamFiles);

            // Generate HTML for desktop recordings
            const desktopVideosHTML = desktopFiles.map(file => `
                <div style=" margin: 10px;">
                    <video src="/desktopRecordings/${file}" controls style="width: 100%; max-width: 400px; margin: 10px 0;">
                        Your browser does not support the video tag.
                    </video>
                </div>
            `).join('');

            // Generate HTML for webcam recordings
            const webcamVideosHTML = webcamFiles.map(file => `
                <div style=" margin: 10px;">
                    <video src="/webcamRecordings/${file}" controls style="width: 100%; max-width: 400px; margin: 10px 0;">
                        Your browser does not support the video tag.
                    </video>
                </div>
            `).join('');

            // Combine the videos into two columns
            res.send(`
            <html>
            <head><title>Recordings Viewer</title></head>
            <body>
                <h1>Recordings</h1>
                <div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: space-around;">
                    <div style="flex: 1; min-width: 300px;">
                        <h2>Desktop Recordings</h2>
                        ${desktopVideosHTML}
                    </div>
                    <div style="flex: 1; min-width: 300px;">
                        <h2>Webcam Recordings</h2>
                        ${webcamVideosHTML}
                    </div>
                </div>
            </body>
            </html>
        `);
        } catch (err) {
            console.log('Error: getting all recordings:', err);
            res.status(500).send({ message: 'Error: getting all recordings.' });
        }
    }
}
