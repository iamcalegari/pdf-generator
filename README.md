# Repositório de testes para o layout da geração de laudos

O intuito desse repositório é testar o layout utilizado para a geração dos laudos do app **LaudoFacil**.

<details>

  <summary>
    <h2 style="display:inline-block; border-bottom:none">
      Get started
    </h2>
  </summary>

1. Instale as dependencias:

```bash
# npm
npm i

# yarn
yarn

#pnpm
pnpm i
```

2. Rode localmente o servidor express. Por padrão o servidor irá rodar na porta `3000`, caso queira alterar basta passar a variável ambiente `PORT=<OUTRA-PORTA>` antes do comando:

```bash
# npm
npm run start

# yarn
yarn start

#pnpm
pnpm run start
```

3. Pronto, o basta abrir o navegador em http://localhost:3000 para visualizar o documento em pdf.

---

</details>

# Usage

### Para atualizar o pdf e visualizar as novas alterações basta salvar em qualquer arquivo como `styles.css`, `page.hbs`, `server.js` e etc, e atualizar a pagina do browser que a alteração já irá aparecer

<details open>
  <summary>
    <h2 style="display:inline-block; border-bottom:none">
      Views
    </h2>
  </summary>

No diretório `📂 views/` você irá encontrar os `.hbs` que são os arquivos de template [Handlebars](https://handlebarsjs.com/), interprete como se fossem um `.html` comum.

**No arquivo `views/page.hbs` está o conteúdo das páginas do laudo a ser replicado.** Cada **tópico** está dentro de uma **div** de classe "page-wrapper". Para visualizar apenas algum tópico em específico basta comentar todos os outros tópicos da seguinte forma:

```hbs
{{! <div class="page-wrapper">
  <div class="topic">
    ...
  </div>
</div> }}

<div class="page-wrapper">
  <div class="topic">
    ...
  </div>
</div>
```

---

</details>

<details open>
  <summary>
    <h2 style="display:inline-block; border-bottom:none">
      Public
    </h2>
  </summary>

No diretório `📂 public/css/` você irá encontrar o `styles.css` que estiliza todos os arquivos `.hbs`.

---

</details>
