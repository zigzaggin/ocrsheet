import a from 'pdf-lib'
import fs from "fs"

const {PDFDocument, degrees, rgb, StandardFonts} = a;

(async () => {
    const pdfDoc = await PDFDocument.load(fs.readFileSync("test-file.pdf"));

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    console.log(firstPage);
    console.log(firstPage.node);

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync("test-out.pdf", pdfBytes);
})();