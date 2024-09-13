const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
const { document } = require("./fixture");

const app = express();

// Configurando o Handlebars

const readTemplate = (filePath) => {
  return fs.readFileSync(filePath, "utf8");
};

// Rota para gerar o PDF
app.get("/", async (req, res) => {
  const style = readTemplate(
    path.join(__dirname, "public", "css", "styles.css")
  );
  const mainTemplate = readTemplate(
    path.join(__dirname, "views", "layouts", "main.hbs")
  );

  const bodyTemplate = readTemplate(
    path.join(__dirname, "views", "pdf-template.hbs")
  );

  const template = handlebars.compile(mainTemplate);
  const body = handlebars.compile(bodyTemplate);

  handlebars.registerHelper("if_eq", function (a, b) {
    // console.log(a, b);
    return a === b;
  });

  const bodyHtml = body(document);

  const html = template({
    body: bodyHtml,
    title: "PDF",
    styles: style,
    ...document,
  });

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // console.log(html);

  await page.setContent(html, { waitUntil: "domcontentloaded" });

  // Adicionar numeração de páginas
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `<div></div>`,
    footerTemplate: `<div style="font-size:10px; text-align: center; width: 100%;">
                            <span class="pageNumber"></span> / <span class="totalPages"></span>
                         </div>`,
    margin: {
      top: "20mm",
      bottom: "20mm",
    },
  });

  await browser.close();

  // res.type("application/pdf");
  res.contentType("html");
  res.send(html);
  // res.send(pdfBuffer);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});
