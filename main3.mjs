import a from 'pdf.js-extract';

import b from 'pdf-lib'
import fs from "fs"

import translations from "./translations.mjs";

let sourceKey = translations.provide('D');

const {PDFDocument, grayscale, rgb, StandardFonts} = b;

const {PDFExtract} = a;
const pdfExtract = new PDFExtract();
const options = {};

(async () => {
    const pdfDoc = await PDFDocument.load(fs.readFileSync("test-file.pdf"));
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    pdfExtract.extract(
        'test-file.pdf',
        options
    )
        .then(async data => {
            const pages = pdfDoc.getPages();


            data.pages.forEach((pageContent, i) => {
                const currentPage = pages[i];
                const height = currentPage.getHeight();
                pageContent.content.forEach(value => {

                    let found = sourceKey[value.str];

                    if (!found) {
                        if (value.str.indexOf("/") > -1) {
                            let [left, right] = value.str.split("/");
                            if (sourceKey[left.trim()] && sourceKey[right.trim()]) {
                                found = {n: sourceKey[left].n + "/" + sourceKey[right].n}
                            }
                        }
                    }

                    if (found) {
                        currentPage.drawRectangle({
                            x: value.x,
                            y: (height - value.y) - .1,
                            width: value.width,
                            height: value.height,
                            borderWidth: 0,
                            color: rgb(1, 1, 1)
                        });
                        currentPage.drawText(
                            found.n,
                            {
                                x: value.x + 1,
                                y: (height - value.y),
                                font: helveticaFont,
                                size: 13
                            }
                        )
                    }
                })
            });

            const pdfBytes = await pdfDoc.save();
            fs.writeFileSync("test-out.pdf", pdfBytes);
        });
})();