const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const libre = require("libreoffice-convert");

const app = express();
const port = 3000;

// Upload config
const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));

// Convert DOCX → PDF
app.post("/docx-to-pdf", upload.single("file"), async (req, res) => {
    const file = req.file;
    const ext = ".pdf";

    const inputPath = file.path;
    const outputPath = `outputs/${file.filename}.pdf`;

    const docxBuf = fs.readFileSync(inputPath);

    libre.convert(docxBuf, ext, undefined, (err, done) => {
        if (err) {
            return res.status(500).send("Conversion error");
        }

        fs.writeFileSync(outputPath, done);
        res.download(outputPath);
    });
});

// Convert PDF → DOCX
app.post("/pdf-to-docx", upload.single("file"), async (req, res) => {
    const file = req.file;
    const ext = ".docx";

    const inputPath = file.path;
    const outputPath = `outputs/${file.filename}.docx`;

    const pdfBuf = fs.readFileSync(inputPath);

    libre.convert(pdfBuf, ext, undefined, (err, done) => {
        if (err) {
            return res.status(500).send("Conversion error");
        }

        fs.writeFileSync(outputPath, done);
        res.download(outputPath);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
