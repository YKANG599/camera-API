import {Request, Response} from 'express';
import {readdirSync} from "node:fs";
const NodeWebcam = require('node-webcam');

export class CameraController {
    // Store the interval ID to manage start and stop
    static photoInterval: NodeJS.Timeout | null = null;

    // Start taking pictures every 5 seconds
    static takePhoto(req: Request, res: Response) {
        try {
            // Define the options for the webcam
            const webcamOptions = {
                width: 1280,
                height: 720,
                quality: 100,
                output: "jpeg",
                device: false,
                callbackReturn: "location",
                verbose: false
            };
            const Webcam = NodeWebcam.create(webcamOptions);

            // Function to capture photo
            const capturePhoto = () => {
                const filePath = __dirname + `/../cameras/camera_${Date.now()}.png`;
                Webcam.capture(filePath, (err, data) => {
                    if (err) {
                        console.error('Error taking photo:', err);
                    } else {
                        console.log('Photo taken successfully:', data);
                    }
                });
            };

            // Start capturing photos every 5 seconds
            if (!CameraController.photoInterval) {
                CameraController.photoInterval = setInterval(capturePhoto, 5000);
                res.send({ message: 'Photo capture started. Taking a photo every 5 seconds.' });
            } else {
                res.send({ message: 'Photo capture is already running.' });
            }
        } catch (err) {
            console.log('Error: starting photo capture:', err);
            res.send({ message: 'Error: starting photo capture.' });
        }
    }

    // Stop taking pictures
    static stopTakePhoto(req: Request, res: Response) {
        try {
            if (CameraController.photoInterval) {
                clearInterval(CameraController.photoInterval);
                CameraController.photoInterval = null;
                res.send({ message: 'Photo capture stopped.' });
                console.log('Photo capture stopped.');
            } else {
                res.send({ message: 'No photo capture in progress to stop.' });
            }
        } catch (err) {
            console.log('Error: stopping photo capture:', err);
            res.send({ message: 'Error: stopping photo capture.' });
        }
    }

    static async getAllPhotos(req: Request, res: Response) {
        try {
            const filePath = __dirname + '/../cameras';
            const files = readdirSync(filePath);
            console.log('files:', files);
            const imagesHTML = `
            <div style="display: flex; flex-wrap: wrap; justify-content: space-between; margin: -10px;">
                ${files.map(file => `
                    <div style="width: 30%; margin: 10px; box-sizing: border-box;">
                        <img src="/cameras/${file}" style="width: 100%;">
                    </div>
                `).join('')}
            </div>
        `;


            res.send(`
            <html>
            <head><title>Camera Viewer</title></head>
            <body>
                <h1>Photos</h1>
                <div>
                    ${imagesHTML}
                </div>
            </body>
            </html>
        `);
        } catch (err) {
            console.log(err);
            res.send({ message: 'getAllScreenShots error', myPath: __dirname });
        }
    }
}