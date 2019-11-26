import express from "express"
import path, {dirname} from "path";
import formidable from "formidable";
import fs from "fs";
import {fileURLToPath} from 'url';
import bodyParser from "body-parser"

import converter from "./lib/converter.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 3000;

app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/pages/index.html')));

app.post('/',
    (req, res) => {


        new formidable.IncomingForm().parse(req, async (err, fields, files) => {
            let file = files.file;
            await converter({
                path: file.path,
                key: fields.key,
                output: file.path,
                done() {
                    res.download(file.path, file.name.replace(".pdf", "") + "-NNS.pdf", {}, () => {
                        fs.unlinkSync(file.path);
                    });
                }
            });
        }).on('fileBegin', (name, file) => {
            file.path = __dirname + '/uploads/' + Date.now() + '-' + file.name
        });
    }
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));