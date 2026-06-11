const express = require("express");
const multer = require("multer");
const fs = require("fs");
const libre = require("libreoffice-convert");

const app = express();
const upload = multer({ dest: "uploads/" });

// Home page (HTML inside same file)
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>PDF ⇄ DOCX Converter</title>
      <style>
        body {
          font-family: Arial;
          text-align: center;
          padding: 40px;
          background: #f4f4f4;
        }
        h1 { color: #333; }
        form {
          background: white;
          padding: 20px;
          margin: 20px auto;
          width: 300px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        button {
          padding: 10px 20px;
          background: #007BFF;
          color: white;
          border: none;
          cursor: pointer;
        }
      </style>
    </head>
    <body>

      <h1>📄 PDF ⇄ DOCX Converter</h1>

      <form action="/docx-to-pdf" method="post" enctype="multipart/form-data">
        <h3>DOCX → PDF</h3>
        <input type="file" name="file" accept=".docx" required><br><br>
        <button type="submit">Convert</button>
      </form>

      <form action="/pdf-to-docx" method="post" enctype="multipart/form-data">
        <h3>PDF → DOCX</h3>
        <input type="file" name="file" accept=".pdf" required><br><br>
        <button type="submit">Convert</button>
      </form>

    </body>
    </html>
  `);
});

// DOCX → PDF
app.post("/docx-to-pdf", upload.single("file"), (req, res) => {
  const file = req.file;
  const docxBuf = fs.readFileSync(file.path);

  libre.convert(docxBuf, ".pdf", undefined, (err, done) => {
    if (err) return res.send("Conversion Error");

    const output = file.filename + ".pdf";
    fs.writeFileSync(output, done);
    res.download(output);
  });
});

// PDF → DOCX
app.post("/pdf-to-docx", upload.single("file"), (req, res) => {
  const file = req.file;
  const pdfBuf = fs.readFileSync(file.path);

  libre.convert(pdfBuf, ".docx", undefined, (err, done) => {
    if (err) return res.send("Conversion Error");

    const output = file.filename + ".docx";
    fs.writeFileSync(output, done);
    res.download(output);
  });
});

app.listen(3000, () => console.log("🚀 Running on http://localhost:3000"));
