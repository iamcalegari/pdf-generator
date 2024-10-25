const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
const document = require("./fixtures/document.json");

const app = express();
app.use(express.static(path.join(__dirname, "public")));

const readTemplate = (filePath) => {
  return fs.readFileSync(filePath, "utf8");
};

// const getTopics = (document) => {
//   const inspection = {
//     name: "VISTORIA DA EDIFICAÇÃO",
//     description: document.propertyDetails.description,
//   };

//   const rooms = document.roomsDetails.reduce((acc, curr) => {
//     acc.push({
//       name: curr.name,
//       description: curr.description,
//       photos: curr.photos,
//     });

//     return acc;
//   }, []);

//   inspection["rooms"] = rooms;

//   const topics = document.topicsDetails.reduce((acc, curr) => {
//     const template = handlebars.compile(curr.template);

//     const topicHtml = template({
//       ...curr.data,
//     });

//     acc.push({
//       name: curr.name,
//       text: topicHtml,
//     });

//     return acc;
//   }, []);

//   topics.splice(2, 0, inspection);

//   return { topics };
// };

// Rota para gerar o PDF

app.get("/", async (req, res) => {
  const timbre =
    "data:image/png;base64, " +
    fs.readFileSync(
      path.join(__dirname, "public", "css", "timbre.png"),
      "base64"
    );

  const style = readTemplate(
    path.join(__dirname, "public", "css", "styles.css")
  );

  const mainTemplate = readTemplate(
    path.join(__dirname, "views-v2", "layouts", "main.hbs")
  );

  // const bodyTemplate = readTemplate(
  //   path.join(__dirname, "views-v2", "pdf-template.hbs")
  // );

  const bodyTemplate = readTemplate(
    path.join(__dirname, "views-v2", "topic-template.hbs")
  );

  const template = handlebars.compile(mainTemplate);
  const body = handlebars.compile(bodyTemplate);

  handlebars.registerHelper("if_eq", function (a, b) {
    return a === b;
  });

  const bodyHtml = body();

  const html = template({
    body: bodyHtml,
    title: "PDF",
    styles: style,
    timbre: timbre,
  });

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  // Adicionar numeração de páginas
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    displayHeaderFooter: true,
    // headerTemplate: `<div><h1>HEADER</h1></div>`,
    footerTemplate: `<div style="font-size:12pt; text-align: end; width: 88%; position: absolute; bottom: 60px;">
                            <span class="pageNumber"></span></span>
                         </div>`,
    tagged: true,
    waitForFonts: true,
    preferCSSPageSize: true,
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
