const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
const document = require("./fixtures/document.json");

const app = express();

const readTemplate = (filePath) => {
  return fs.readFileSync(filePath, "utf8");
};

const getTopics = (document) => {
  const inspection = {
    name: "VISTORIA DA EDIFICAÇÃO",
    description: document.propertyDetails.description,
  };

  const rooms = document.roomsDetails.reduce((acc, curr) => {
    acc.push({
      name: curr.name,
      description: curr.description,
      photos: curr.photos,
    });

    return acc;
  }, []);

  inspection["rooms"] = rooms;

  const topics = document.topicsDetails.reduce((acc, curr) => {
    const template = handlebars.compile(curr.template);

    const topicHtml = template({
      ...curr.data,
    });

    acc.push({
      name: curr.name,
      text: topicHtml,
    });

    return acc;
  }, []);

  topics.splice(2, 0, inspection);

  return { topics };
};

// Rota para gerar o PDF
app.get("/", async (req, res) => {
  const style = readTemplate(
    path.join(__dirname, "public", "css", "styles.css")
  );

  const mainTemplate = readTemplate(
    path.join(__dirname, "views-v2", "layouts", "main.hbs")
  );

  const bodyTemplate = readTemplate(
    path.join(__dirname, "views-v2", "pdf-template.hbs")
  );

  const template = handlebars.compile(mainTemplate);
  const body = handlebars.compile(bodyTemplate);

  handlebars.registerHelper("if_eq", function (a, b) {
    return a === b;
  });

  const bodyHtml = body(getTopics(document));

  const html = template({
    body: bodyHtml,
    title: "PDF",
    styles: style,
  });

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

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

  res.type("application/pdf");
  res.send(pdfBuffer);

  // console.log(html);
  // res.contentType("html");
  // res.send(html);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});
