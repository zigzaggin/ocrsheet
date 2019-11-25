import Tesseract from "tesseract.js";
import Jimp from "jimp";
import fs from "fs"

const worker = Tesseract.createWorker({
    logger: m => console.log(m)
});

(async () => {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    await worker.setParameters({
        "preserve_interword_spaces": "0",
        "tessjs_create_hocr": "1",
        "tessjs_create_tsv": "0",
        "tessjs_create_unlv": "0"
    });

    let file = await worker.recognize('t1.jpg');

    Jimp.read('t1.jpg')
        .then(image => {

            let result = image.clone();
            file.data.lines.forEach(line => {
                line.words.forEach(word => {
                    if (word.text === "D") {
                        new Jimp((word.bbox.x1 - word.bbox.x0) + 10, (word.bbox.y1 - word.bbox.y0) + 10, Jimp.cssColorToHex("#0000ff"), (err, value) => {
                            result.composite(value, word.bbox.x0 - 5, word.bbox.y0 - 5);
                            result.write('out.jpg');
                        });
                    }
                })
            });
        });

    fs.writeFileSync("hocr.html", file.data.hocr + "<script src=\"https://unpkg.com/hocrjs\"></script>");

    await worker.terminate();
})();