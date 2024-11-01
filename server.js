const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");

const app = express();
app.use(express.static(path.join(__dirname, "public")));

const readTemplate = (filePath) => fs.readFileSync(filePath, "utf8");

const setupHelpers = () =>
  handlebars.registerHelper("if_eq", function (a, b) {
    return a === b;
  });

// Cria o HTML com base nos templates
const createHtml = () => {
  const style = readTemplate(
    path.join(__dirname, "public", "css", "styles.css")
  );

  const mainTemplate = readTemplate(
    path.join(__dirname, "views", "layouts", "main.hbs")
  );

  const bodyTemplate = readTemplate(path.join(__dirname, "views", "page.hbs"));

  const headerTemplate = readTemplate(
    path.join(__dirname, "views", "header.hbs")
  );

  const footerTemplate = readTemplate(
    path.join(__dirname, "views", "footer.hbs")
  );

  const template = handlebars.compile(mainTemplate);
  const body = handlebars.compile(bodyTemplate);
  const header = handlebars.compile(headerTemplate);
  const footer = handlebars.compile(footerTemplate);

  setupHelpers();

  const bodyHtml = body();
  const headerHtml = header({
    styles: style,
  });
  const footerHtml = footer({
    styles: style,
  });

  const html = template({
    body: bodyHtml,
    title: "PDF",
    styles: style,
  });

  return { html, headerHtml, footerHtml };
};

// Rota para gerar o PDF
app.get("/", async (req, res) => {
  const { html, headerHtml, footerHtml } = createHtml();

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: headerHtml,
    footerTemplate: footerHtml,
    tagged: true,
    waitForFonts: true,
    preferCSSPageSize: true,
  });

  await browser.close();

  res.type("application/pdf");
  res.send(pdfBuffer);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});
