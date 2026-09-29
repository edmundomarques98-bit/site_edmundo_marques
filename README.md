# Edmundo Marques — Identidade visual e sites

Site estático, responsivo, em português. Usa a logo moderna e o símbolo originais, o azul #0000FF e o mascote original da identidade visual.

## Rodar localmente

```sh
python3 -m http.server 8000
```

Abra http://localhost:8000. Não há dependências nem etapa de build.

## Contato

O WhatsApp de atendimento está configurado em `config.js`: +55 (88) 99624-5526. O formulário prepara a mensagem e oferece um botão para abrir o WhatsApp. O visitante confirma o envio no próprio WhatsApp; o site não envia nem armazena os dados.

## Publicar no GitHub Pages

Em Settings > Pages, escolher Deploy from a branch, branch `main`, pasta `/ (root)`. Todos os caminhos são relativos, compatíveis com a URL do repositório.

## Arquivos

- `index.html`: conteúdo e estrutura.
- `styles.css`: identidade visual, responsividade e movimento.
- `app.js`: menu, prévias de site, briefing, cópia e modais.
- `config.js`: contato.
- `assets/`: logo, símbolo e robô. PNGs da marca preservados; mascote otimizado para WebP.

As animações respeitam a preferência de movimento reduzido. O conteúdo principal permanece visível sem JavaScript. Não há analytics, cookies de publicidade, banco de dados ou envio automático de formulários.

## Atualização do portfólio — setembro de 2026

A especificação, fontes de referência, links dos clientes, assets e critérios de aceite estão em [docs/alteracoes-2026-09-29.md](docs/alteracoes-2026-09-29.md).

A fonte autoral EM Corte Display Bold está em `assets/fonts/`, com WOFF2 para web e TTF original. As prévias de Deivid Souza e Studio Alex Pacheco são capturas reais; ao atualizar os projetos, renovar as imagens correspondentes. O mascote com ambas as mãos abertas está em `assets/robo-servicos.png`; a imagem original foi preservada.
