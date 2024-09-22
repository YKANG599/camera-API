import {Request, Response} from 'express';
import {appendFileSync, readFileSync} from "node:fs";

export class FileSystemController {
    static async findAvatar(req: Request, res: Response) {
        console.log('findAvatar');
        res.send({message: 'findAvatar'});
    }

    static async getFile(req: Request, res: Response) {
        console.log('getFile');
        try {
            const {name, age} = req.query;
            console.log(`name: ${name}, age: ${age}`);
            const filePath = __dirname + '/../userInfo/employee.txt';
            const data=readFileSync(filePath, 'utf8');
            return res.send({
                name: name,
                age: age,
                fileContent: data
            });

        } catch (err) {
            console.log(err);
            res.send({message: 'getFile error', myPath: __dirname});
        }

    }

    static async writeFile(req: Request, res: Response) {
        console.log('writeFile');
        try {
            // Correct path joining and avoid using string concatenation directly
            const filePath = __dirname + '/../userInfo/employee123.txt';

            // Append 'hihi\n' to the file
            appendFileSync(filePath, 'hihi\n', 'utf8');

            // Read the file content after writing to send it in the response
            const data = readFileSync(filePath, 'utf8');

            // Send the response with the updated file content
            return res.send({
                message: 'writeFile successful',
                fileContent: data
            });

        } catch (err) {
            console.log(err);
            res.status(500).send({ message: 'writeFile error', myPath: __dirname });
        }
    }
}