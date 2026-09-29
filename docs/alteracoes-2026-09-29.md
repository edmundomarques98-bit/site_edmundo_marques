# Alterações do portfólio — 29/09/2026

## Referências
- [Notion: alterações pendentes](https://app.notion.com/p/3e9b8757e7078112bc47f8be9d7bcc35?pvs=204), consultado em 29/09/2026, edição de 28/09/2026.
- [Google Calendar: Atualizar site pessoal — ajustes de portfólio](https://www.google.com/calendar/event?eid=bHRhZmpiODg2ZDMxMmI3bmViZXM0YWFvOGMgZWRtdW5kb21hcnF1ZXM5OEBt), 29/09/2026, 08:00–08:30, America/Fortaleza. Agendamento não comprova execução.
- Complementos enviados pelo cliente na conversa: fonte EM-Corte-Display-Bold.ttf e URLs dos dois projetos. O requisito da fonte não constava no conteúdo consultado do Notion ou evento.

## Escopo implementado
| Área | Alteração |
| --- | --- |
| Cabeçalho | Mascote com ambas as mãos abertas; mensagens HTML “Identidade Visual” e “Seu Site / Seu Link”, com entrada e flutuação suaves, links para os serviços e modo sem movimento. |
| Do conceito à presença | Demonstração fictícia da cafeteria Pausa: conceito, identidade, aplicações e presença digital. Sem usar logo, paleta, códigos ou zoom da identidade de Edmundo como case. |
| Site profissional | Projeto Deivid Souza Personal com prévia real e link. Grafia confirmada pelo projeto informado. |
| Landing page | Projeto Studio Alex Pacheco com prévia real e link. |
| Contadores | Remoção de números decorativos em cabeçalho, seções, serviços e processo. |
| Tipografia | EM Corte Display Bold, peso 700, nos títulos e destaques. WOFF2 com TTF de fallback e font-display: swap. Texto corrido preserva fonte de leitura. |

## Projetos e acesso
- [Deivid Souza Personal](https://edmundomarques98-bit.github.io/deivid-souza-personal-v2/)
- [Studio Alex Pacheco](https://edmundomarques98-bit.github.io/STUDIOALEXPACHECO/)
- Botões: “Visitar site do Deivid” e “Conhecer o projeto do Studio”.
- Os dois links ficam disponíveis mesmo sem JavaScript. A aba inicial mostra o site profissional; as abas permitem alternar os projetos e a demonstração de link na bio.

## Ordem da implementação
1. Inspeção do site e confirmação dos assets fornecidos.
2. Conversão e aplicação da fonte autoral.
3. Retirada dos contadores e substituição do case pessoal.
4. Ajuste visual do mascote e mensagens nas mãos.
5. Captura dos projetos publicados e integração dos links.
6. Revisão responsiva, carregamento, navegação das abas e fluxo do briefing.
7. Entrega das alterações no GitHub para revisão e publicação.

## Critérios de aceite
- Mensagens corretas, legíveis e acessíveis no mascote.
- Nenhum contador decorativo 01/02/03/04 restante.
- Exemplo fictício claramente identificado; marca institucional Edmundo preservada.
- Cada prévia corresponde ao projeto e abre seu endereço correto.
- Fonte carregada com acentos e números.
- Sem rolagem horizontal no celular; botões e formulário funcionais.
- Movimento reduzido respeitado; projetos acessíveis sem JavaScript.

## Assets
- `assets/robo-servicos.png`: edição do mascote original, com transparência e ambas as mãos abertas.
- `assets/fonts/EM-Corte-Display-Bold.ttf`: fonte original enviada pelo cliente.
- `assets/fonts/EM-Corte-Display-Bold.woff2`: versão web da mesma fonte.
- `assets/projeto-deivid.jpg` e `assets/projeto-studio.jpg`: capturas reais das URLs fornecidas.
- A marca fictícia Pausa e suas aplicações são elementos HTML/CSS, sem arquivos externos pendentes.

## Validação realizada
- Layout verificado em 320, 390, 768 e 1440 px, sem transbordamento horizontal.
- Carregamento da fonte autoral e assets sem erros de página ou recursos ausentes.
- Abas de projetos com clique e teclado; links corretos.
- Menu móvel, abertura e fechamento do briefing e geração da URL do WhatsApp, sem envio de mensagem.
- Links dos dois projetos disponíveis sem JavaScript.
- URLs de origem responderam HTTP 200. Capturas feitas após o carregamento e a abertura do conteúdo.

## Mascote: direção de edição
Edição com a ferramenta nativa de imagem a partir de `assets/robo.webp`. Direção: preservar o robô grafite, rosto de planeta azul sorridente e símbolo EM; pose frontal de corpo inteiro, ambos os braços abertos, palmas para cima, fundo transparente, sem texto nem placas. Mensagens aplicadas em HTML sobre cada mão. Resultado: `assets/robo-servicos.png`.
