import Tesseract from "tesseract.js";
import Jimp from "jimp";
import fs from "fs"

import translations from "./translations";


let sourceKey = translations['D'];


const file = 't1.jpg';

const worker = Tesseract.createWorker({
    logger: m => console.log(m)
});

(async () => {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    await worker.setParameters({
        "preserve_interword_spaces": "1",
        "tessjs_create_hocr": "1",
        "tessjs_create_tsv": "0",
        "tessjs_create_unlv": "0"
    });

    let ocr = await worker.recognize(file);

    Jimp.read(file)
        .then(image => {

            let result = image.clone();

            result.write('out.png');

            ocr.data.lines.forEach(line => {
                line.words.forEach(word => {
                    let box = word;

                    let text = box.text.replace(/\[/g, "").trim();

                    let found = null;
                    Object.keys(sourceKey).forEach(key => {
                        if (key === text)
                            found = sourceKey[key];
                        else
                            translations.modifiers.forEach(modifier => {
                                if ((key + modifier) === text) {
                                    let sourceKeyElement = sourceKey[key];
                                    found = {n: sourceKeyElement.n, modifier: modifier};
                                }
                            })
                    });

                    if (!found) {
                        Object.keys(sourceKey).forEach(key1 => {
                            Object.keys(sourceKey).forEach(key2 => {
                                if ((key1 + key2) === text) {
                                    found = {n: sourceKey[key1].n + "/" + sourceKey[key2].n};
                                }
                            });
                        });
                    }

                    if (found) {
                        new Jimp(
                            (box.bbox.x1 - box.bbox.x0) + 30,
                            (box.bbox.y1 - box.bbox.y0) + 10,
                            Jimp.cssColorToHex("#ffffff"),
                            (err, value) => {
                                result.composite(value, box.bbox.x0 - 5, box.bbox.y0 - 5);

                                Jimp.loadFont(Jimp.FONT_SANS_32_BLACK)
                                    .then(font => {
                                        result.print(
                                            font,
                                            box.bbox.x0,
                                            box.bbox.y0,
                                            found.n,
                                            50,
                                            (err, image, {x, y}) => {
                                                if (found.modifier) {
                                                    image.print(
                                                        font,
                                                        x,
                                                        y - Jimp.measureTextHeight(font, found.n, 100) - 10,
                                                        found.modifier
                                                    );
                                                }
                                            }
                                        );
                                        result.write('out.png');
                                    });
                            });
                    }
                })
            });
        });

    fs.writeFileSync("hocr.html", ocr.data.hocr + "<script src=\"https://unpkg.com/hocrjs\"></script>");

    await worker.terminate();
})();