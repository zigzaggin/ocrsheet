import converter from "./lib/converter";

(async () => {
    await converter({
        path: "test-file.pdf",
        key: "D",
        output: "test-out.pdf"
    });
})();
