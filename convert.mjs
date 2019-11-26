import converter from "./converter";

(async () => {
    await converter({
        path: "test-file.pdf",
        key: "D",
        output: "test-out.pdf"
    });
})();
