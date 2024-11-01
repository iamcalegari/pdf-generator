const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs-extra");
const handlebars = require("handlebars");
const data = require("./fixtures/document-example.json");

const app = express();

const readTemplate = (filePath) => {
  return fs.readFileSync(filePath, "utf8");
};

// Rota para gerar o PDF
app.get("/", async (req, res) => {
  const style = readTemplate(
    path.join(__dirname, "old-public", "css", "styles.css")
  );

  const mainTemplate = readTemplate(
    path.join(__dirname, "old-views-v2", "layouts", "main.hbs")
  );

  const bodyTemplate = readTemplate(
    path.join(__dirname, "old-views-v2", "pdf-template.hbs")
  );

  // Carrega o template
  const template = handlebars.compile(mainTemplate);
  const body = handlebars.compile(bodyTemplate);

  // Primeira Passagem: Renderiza o HTML sem números de página
  const initialHtml = body(data);

  // Inicia o Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Define o conteúdo da página
  await page.setContent(initialHtml, { waitUntil: "networkidle0" });

  // Aguarda a renderização completa
  await page.evaluateHandle("document.fonts.ready");

  // Calcula os números de página para cada tópico e subtópico
  const pageNumbers = await page.evaluate(() => {
    const elements = document.querySelectorAll("[id]");
    const pageNumbers = {};

    elements.forEach((el) => {
      const id = el.id;
      // Calcula o número da página baseado na posição do elemento
      const rect = el.getBoundingClientRect();
      const pageNumber =
        Math.floor((window.scrollY + rect.top) / window.innerHeight) + 1;
      pageNumbers[id] = pageNumber;
    });

    return pageNumbers;
  });

  // Atualiza os dados com os números de página calculados
  function updateTopics(topics) {
    topics.forEach((topic) => {
      topic.pageNumber = pageNumbers[topic.id];
      if (topic.subtopics) {
        topic.subtopics.forEach((subtopic) => {
          subtopic.pageNumber = pageNumbers[subtopic.id];
        });
      }
    });
  }

  updateTopics(data.topics);

  // Segunda Passagem: Renderiza o HTML com os números de página atualizados
  const finalHtml = body(data);

  const html = template({ styles: style, body: finalHtml });

  // Define o conteúdo da página novamente
  await page.setContent(html, { waitUntil: "load" });

  // Aguarda a renderização completa
  await page.evaluateHandle("document.fonts.ready");

  // Atualiza o sumário com os números de página corretos
  await page.evaluate(() => {
    const tocEntries = document.querySelectorAll(".toc-page-number");
    tocEntries.forEach((span) => {
      const id = span.getAttribute("data-id");
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        const pageNumber =
          Math.floor((window.scrollY + rect.top) / window.innerHeight) + 1;
        span.textContent = pageNumber;
      }
    });
  });

  // Gera o PDF final
  const pdfBuffer = await page.pdf({
    // path: "documento_final.pdf",
    format: "A4",
    printBackground: true,
    displayHeaderFooter: true,
    margin: {
      top: "0",
      bottom: "0",
      left: "0",
      right: "0",
    },
  });

  await browser.close();

  console.log("PDF gerado com sucesso!");

  res.type("application/pdf");
  res.send(pdfBuffer);
  // })();
});

const PORT = process.env.PORT || 3008;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});
