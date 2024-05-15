import express from 'express';
import secure from 'express-force-https';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import {fileURLToPath} from 'url';
import path from 'path';
import fs from 'fs';


const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(secure);
app.use(helmet.contentSecurityPolicy({
    directives: {
        "script-src": ["'self'",
        ],
        "img-src": ["'self'", "default-src 'self'"],
        "frame-src": ["'self'"],
        "base-uri": "http://localhost:3000/"
    }
}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
    res.sendFile('index.html');
});

app.get('/get-questions', (req, res, next) => {
    const questionsFilePath = path.join(__dirname, './public/questions.json');
    fs.readFile(questionsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            res.status(500).json({error: 'Error reading JSON file'});
            return;
        }

        // Parse the JSON data
        const jsonData = JSON.parse(data);

        // Send JSON data as response
        res.json(jsonData);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);