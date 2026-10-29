# Licença do texto bíblico (ACF)

## Situação
O Livre exibe a Bíblia na versão **Almeida Corrigida Fiel (ACF)**. Os arquivos em `public/data-acf/` vieram de um projeto comunitário de dados abertos (thiagobodruk/biblia). **Esse projeto não substitui a autorização do titular dos direitos da tradução.** Antes de divulgar o app em larga escala, é preciso (a) obter permissão do titular ou (b) trocar por uma versão de domínio público.

> Não confirmei quem detém hoje os direitos da ACF nem as condições de uso. Verifique antes de enviar o pedido (em geral, a editora/sociedade bíblica responsável pela edição que o projeto usa).

## Opção A: pedir permissão (modelo de carta)

**Assunto:** Pedido de autorização para uso da Almeida Corrigida Fiel em aplicativo gratuito

Prezados,

Sou [SEU NOME], responsável pelo aplicativo **Livre**, um devocional gratuito, sem anúncios e sem coleta de dados, voltado a jovens cristãos brasileiros. O app reúne leitura bíblica, oração, diário e acompanhamento de hábitos, e todos os dados do usuário ficam apenas no aparelho dele.

Gostaríamos de exibir o texto bíblico na versão **Almeida Corrigida Fiel (ACF)** dentro do aplicativo, com a devida atribuição ao titular dos direitos, sem alterar o texto e sem fins lucrativos. Poderiam informar:

1. Se há autorização para esse uso, e em quais condições (atribuição, limite de versículos, prazo);
2. Se existe licença, taxa ou formato específico para aplicativos;
3. Qual o texto de atribuição exigido.

O aplicativo está disponível em: [ENDEREÇO DO SITE].

Agradeço desde já a atenção.

[NOME] · [E-MAIL] · [TELEFONE]

## Opção B: trocar por uma versão de domínio público
1. Escolher uma tradução em português cuja licença permita uso livre (conferir a licença da própria fonte dos arquivos).
2. Gerar os arquivos no mesmo formato: um `.json` por livro em `public/data-acf/<id>.json`, em que cada arquivo é uma lista de capítulos e cada capítulo é uma lista de versículos (ver `public/data-acf/FONTE.txt`).
3. Rodar `npm run verificar:versiculos`. Ele compara as citações do app com o texto novo e lista o que precisa ajustar. Com `-- --fix`, troca as citações automaticamente pelo texto exato.
4. Trocar o rótulo “ACF” nas telas pela sigla da nova versão.

## Enquanto isso
A página **Ajustes → Sobre e privacidade** informa a versão usada e a fonte dos arquivos. Não divulgue o app amplamente antes de resolver este ponto.
