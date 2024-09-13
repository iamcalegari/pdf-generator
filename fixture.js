const path = require("path");
const fs = require("fs");
const location = {
  lat: 37.4224764,
  lng: -122.0842499,
  address: {
    number: "1600",
    street: "Amphitheatre Parkway",
    city: "Mountain View",
    state: "CA",
    country: "US",
    zip: "94043",
  },
  formattedAddress: "1600 Amphitheatre Parkway, Mountain View, CA 94043, USA",
  types: ["street_address"],
};

const rooms = [
  {
    name: "Living Room",
    description: "A beautiful living room",
    photos: [
      {
        name: "Sofa",
        number: 1,
        originalName:
          "sala-de-estar-sofa-sofa-milano-retratil-2-50m--p-1660668887405.png",
        caption: "Its a sofa",
        fileUrl:
          "https://79424.cdn.lojaquevende.com.br/static/79424/sku/sala-de-estar-sofa-sofa-milano-retratil-2-50m--p-1660668887405.png",
      },
      {
        name: "Televisor",
        number: 2,
        originalName: "suporte_tv_mercadolivre_tipos-640x360.jpeg",
        caption: "Its a tv",
        fileUrl:
          "https://www.cidademarketing.com.br/marketing/wp-content/uploads/2023/08/suporte_tv_mercadolivre_tipos-640x360.jpeg",
      },
    ],
  },
  {
    name: "Bedroom",
    description: "A beautiful bedroom",
    photos: [
      {
        name: "Bed",
        number: 3,
        originalName:
          "cama_de_casal_julia_madeira_macica_bedroom_3453_1_98b15fbbf21c11e5710add2ce73eec88.jpg",
        caption: "Its a bed",
        fileUrl:
          "https://images.tcdn.com.br/img/img_prod/1215519/cama_de_casal_julia_madeira_macica_bedroom_3453_1_98b15fbbf21c11e5710add2ce73eec88.jpg",
      },
      {
        name: "Desk",
        number: 4,
        originalName: "mesa_mercadolivre_tipos-640x360.jpeg",
        caption: "Its a desk",
        fileUrl:
          "https://m.media-amazon.com/images/I/6147r1s1PNL._AC_SL1000_.jpg",
      },
    ],
  },
];

const property = {
  name: "John Doe's House",
  type: "house",
  description: "A beautiful house",
  location,
  rooms,
};

const topics = [
  {
    name: "INTRODUÇÃO",
    text: `<p>A inspeção de fachada caracteriza-se como uma vistoria para avaliar as manifestações
patológicas de uma edificação, onde será rotulado o desempenho, vida útil, segurança, estado
de conservação, manutenção, exposição ambiental, utilização e operação, visando orientar os
usuários quanto à necessidade de melhorias dos elementos construtivos. (NEVES, 2009).
O conceito de preservação, uso, manutenção e desempenho do espaço físico de maior
relevância na vida do homem, tanto pelo aspecto patrimonial quanto pelas questões
relacionadas à segurança e ao conforto se adquirem pela observação permanente das
edificações. (IBAPE - Instituto Brasileiro de Avaliação e Perícias de Engenharia do estado de
São Paulo – “Norma de Inspeção Predial Nacional”, 2012).
As anomalias ou falhas constatadas no edifício fazem escopo da inspeção predial que o
classifica de acordo com o grau de risco apresentado, fornecendo ao usuário uma análise
isolada ou combinada das condições técnicas, de uso e de manutenção da edificação. Esta
análise possibilita um planejamento de todos os gastos, a racionalização dos serviços a serem
realizados e uma ordem cronológica em que estes serviços deverão ser executados. (NEVES,
2009).
As não conformidades causadas pelas anomalias e falhas impactam na perda precoce de
desempenho real ou futuro dos elementos construtivos e na redução do tempo de vida útil
projetada. Podem comprometer também a segurança, funcionalidade, operabilidade, saúde
de usuários, conforto térmico, acústico e lumínico, acessibilidade, durabilidade, vida útil,
dentre outros parâmetros de desempenho definidos na ABNT NBR 15575. (IBAPE - Instituto
Brasileiro de Avaliação e Perícias de Engenharia do estado de São Paulo – “Norma de Inspeção
Predial Nacional”, 2012).
Os reiterados acidentes prediais ocorridos recentemente no Brasil, motivados por anomalias
e falhas, quer de projetos, quer construtivas ou de manutenção, indicam a necessidade de
maior conscientização dos usuários das edificações com os cuidados técnicos indispensáveis
à boa segurança e uso de nossas edificações. (GOMIDE, 2006).</p>`,
  },
  {
    name: "CONSIDERAÇÕES INICIAIS",
    text: `<p>O presente laudo Técnico de Mapeamento de Fachada foi solicitado pelo Condomínio Edifício
Ville de Lyon, situada na Rua Riolandia, 467, Santa Mônica, localizado na cidade de Feira de
Santana- BA, inscrito no CPNJ de número 13.428.332/0001-13. Elaborado pela empresa L
BASTOS ENGENHARIA LTDA, pessoa jurídica de direito privado, CNPJ 41.809.972/0001-09,
com endereço na Rua Juracy Magalhães, 853, Ponto Central, situado na cidade de Feira de
Santana – BA, neste ato representada pela Engenheira Civil Lara Geovanna Bastos
Nascimento, inscrita no CPF nº 062.275.615-09, com o intuito de verificar as condições da
fachada da edificação, justificando a ocorrência das manifestações patológicas apresentadas
na vistoria realizada in loco nos meses de fevereiro e março de 2024, em obediência às
diretrizes atribuídas pelas Normas Técnicas Brasileiras aprovadas e regulamentadas pela
Associação Brasileira de Normas Técnicas – ABNT, sendo imprescindíveis as suas
recomendações, convenções e requisitos em todas as manifestações escritas, tais como:
Pareceres e Laudos Técnicos de Engenharia.
A concepção e apresentação deste Laudo Pericial de Engenharia são de total responsabilidade
da profissional qualificada, Lara Geovanna Bastos Nascimento, legalmente habilitada pelo
Conselho Regional de Engenharia e Agronomia da Bahia – CREA de n° 0520105168, de acordo
com a Lei Federal nº 5194/66 e, entre outras, as Resoluções nº 205, 218 e 325 do CONFEA e
Lei n° 1.121/19.</p>`,
  },
  {
    name: "ESCOPO",
    text: `<p>O presente trabalho tem por finalidade a realização de uma inspeção técnica da fachada da
edificação como um “Check-up”, com o propósito de averiguação e procedimentos técnicos
investigativos da Engenharia Diagnóstica, de elementos construtivos, com o objetivo de
identificar e relatar as anomalias construtivas e falhas de manutenção que interferem e
prejudicam a funcionalidade, suas instalações, seu desempenho, vida útil, análise de risco
oferecido aos usuários, patologias e danos físicos existentes no Condomínio Edifício Ville de
Lyon, em Feira de Santana - BA, apontando as possíveis causas que deram origem às
manifestações, grau de risco e mecanismos de ação.
Neste contexto, é importante frisar que, a anomalia representa a irregularidade relativa à
construção e suas instalações, enquanto a falha diz respeito à manutenção, operação e uso
da edificação.</p>`,
  },
  {
    name: "METODOLOGIA E PROCEDIMENTOS",
    text: `<p>De acordo com a Norma Brasileira Regulamentadora 13752:1996 (norma que fixa os critérios
e procedimentos relativos às perícias de engenharia na construção civil), vistoria é a
constatação de um fato através de observação de circunstâncias e descrição detalhada e
minuciosa de todos os elementos que o constituem. Dessa maneira, a partir da realização de
vistorias, o trabalho de análise, constatação e mapeamento dos aspectos a serem levantados,
tornam-se mais isentos de subjetividade.
O trabalho de levantamento das manifestações patológicas consistiu em vistorias in loco,
atendendo às Normas Brasileiras e Internacionais como complementação. Além das vistorias
realizadas, foram colhidas informações sobre a presença de manifestações patológicas com o
corpo administrativo do condomínio.
Os procedimentos adotados para o diagnóstico das patologias observadas foram:
1. Levantamento detalhado do estado da fachada em todas as faces da edificação,
incluindo reservatório superior, visualizando as áreas comprometidas, localizando e
mapeando as manifestações patológicas observadas mediante a inspeção visual
realizada por profissionais habilitados para o serviço;
2. Utilização de ferramentas adequadas para a execução do teste de percussão em toda
a fachada da edificação para identificação de som cavo (descolamento de
pastilha/reboco);
3. Verificação das configurações geométricas das anomalias, como comprimento e área;
4. Análise do histórico da edificação, na busca de informações relevantes para o
diagnóstico;
5. Elaboração do laudo técnico com base nas informações e fotografias obtidas no local,
contemplando todos os dados técnicos necessários sobre a edificação, quanto ao
modelo estrutural e sistema de revestimento.</p>`,
  },
];

exports.document = {
  name: "Laudo Pericial de Engenharia",
  description: "This is a description",
  property,
  topics,
};
