# Edmundo Marques — Identidade visual e sites

Site estático, responsivo, em português. Usa a logo moderna e o símbolo originais, o azul #0000FF e o mascote original da identidade visual.

## Rodar localmente

```sh
python3 -m http.server 8000
```

Abra http://localhost:8000. Não há dependências nem etapa de build.

## Contato

Em `config.js`, preencher `whatsapp` com o número de atendimento no formato `55` + DDD + número. O número não foi informado no briefing inicial. Enquanto vazio, o formulário prepara uma mensagem copiável, sem enviar ou armazenar dados. Com o número válido, aparece o botão que abre o WhatsApp com a mensagem preenchida.

## Publicar no GitHub Pages

Em Settings > Pages, escolher Deploy from a branch, branch `main`, pasta `/ (root)`. Todos os caminhos são relativos, compatíveis com a URL do repositório.

## Arquivos

- `index.html`: conteúdo e estrutura.
- `styles.css`: identidade visual, responsividade e movimento.
- `app.js`: menu, prévias de site, briefing, cópia e modais.
- `config.js`: contato.
- `assets/`: logo, símbolo e robô. PNGs da marca preservados; mascote otimizado para WebP.

As animações respeitam a preferência de movimento reduzido. O conteúdo principal permanece visível sem JavaScript. Não há analytics, cookies de publicidade, banco de dados ou envio automático de formulários.
