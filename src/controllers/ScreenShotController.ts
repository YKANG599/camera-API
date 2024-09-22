import {Request, Response} from 'express';
const screenshot = require('screenshot-desktop');
import {readdirSync} from "node:fs";

export class ScreenShotController {
    // Store the interval ID to manage start and stop
    static screenshotInterval: NodeJS.Timeout | null = null;

    // Start taking screenshots every 5 seconds
    static async takeScreenShot(req: Request, res: Response) {
        try {
            // Function to capture screenshot
            const captureScreenShot = async () => {
                try {
                    const filePath = __dirname + `/../screenShots/screenshot_${Date.now()}.png`;
                    await screenshot({filename: filePath});
                    console.log('Screenshot taken successfully:', filePath);
                } catch (err) {
                    console.error('Error: taking screenshot:', err);
                }
            };

            // Start capturing screenshots every 5 seconds
            if (!ScreenShotController.screenshotInterval) {
                ScreenShotController.screenshotInterval = setInterval(captureScreenShot, 5000);
                res.send({message: 'Screenshot capture started. Taking a screenshot every 5 seconds.'});
            } else {
                res.send({message: 'Screenshot capture is already running.'});
            }
        } catch (err) {
            console.log('Error: starting screenshot capture:', err);
            res.send({message: 'Error: starting screenshot capture.'});
        }
    }

    // Stop taking screenshots
    static stopTakeScreenShot(req: Request, res: Response) {
        try {
            if (ScreenShotController.screenshotInterval) {
                clearInterval(ScreenShotController.screenshotInterval);
                ScreenShotController.screenshotInterval = null;
                res.send({message: 'Screenshot capture stopped.'});
                console.log('Screenshot capture stopped.');
            } else {
                res.send({message: 'No screenshot capture in progress to stop.'});
            }
        } catch (err) {
            console.log('Error: stopping screenshot capture:', err);
            res.send({message: 'Error: stopping screenshot capture.'});
        }
    }

    static async getAllScreenShots(req: Request, res: Response) {
        try {
            const filePath = __dirname + '/../screenShots';
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
            <head><title>Screenshot Viewer</title></head>
            <body>
                <h1>Screenshots</h1>
                <div>
                    ${imagesHTML}
                </div>
            </body>
            </html>
        `);
        } catch (err) {
            console.log(err);
            res.send({message: 'getAllScreenShots error', myPath: __dirname});
        }
    }

}
