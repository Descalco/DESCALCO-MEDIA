# Descalco Media - Audit e Plano de Revamp

## Contexto

Este documento resume uma auditoria ao código e à experiência atual do website de portfólio da Descalco Media, com foco em:

- posicionamento de marca
- arquitetura de conteúdo
- experiência visual e motion
- performance e acessibilidade
- manutenção técnica
- potencial de revamp

O objetivo não é desvalorizar a base atual. Pelo contrário: há matéria-prima forte aqui. O problema é que o site, no estado atual, ainda não traduz todo o nível de craft que o trabalho mostra.

## Resumo Executivo

O site tem uma base autoral interessante, um tom visual coerente em várias zonas e, acima de tudo, um portfólio com trabalho suficientemente forte para sustentar uma presença muito mais ambiciosa. As case studies de projetos como `GUISADO` e `SOF WEEK` mostram profundidade real, e o backoffice é um ativo raro para um portfólio pessoal.

Ao mesmo tempo, a experiência atual está dividida entre várias camadas visuais e técnicas que não formam um sistema único. Existe uma base original em HTML/SASS/JS mais antiga, e por cima dela foram sendo adicionadas camadas “enhanced” com muito CSS e JS custom, o que trouxe energia visual mas também aumentou fragilidade, inconsistência e dívida técnica.

Hoje, o site comunica mais “portfólio pessoal com boas experiências” do que “motion designer premium com linguagem própria”. O conteúdo já permite a segunda leitura. A interface ainda não.

## Avaliação Geral

| Área | Avaliação |
| --- | --- |
| Qualidade do trabalho apresentado | 8.5/10 |
| Clareza de posicionamento | 6/10 |
| Impacto visual do site | 6.5/10 |
| Experiência de portfolio/case studies | 7/10 |
| Performance técnica | 5/10 |
| Manutenibilidade | 5/10 |
| Preparação para crescer | 6/10 |

### Leitura final

Se eu avaliar o website como ferramenta de posicionamento para um profissional de motion design e multimédia, a nota global atual é **6.3/10**.

Não é uma nota baixa porque o problema não é falta de talento, nem falta de conteúdo. O problema é desalinhamento entre:

- a qualidade do trabalho
- a ambição visual pretendida
- a forma como a experiência está atualmente construída

## O Que Está Bom

### 1. Há identidade e não apenas “template energy”

O site não parece genérico. A base escura, o peso do vermelho, o opener, o gosto por partículas, brilho, motion e depth mostram intenção autoral.

### 2. O conteúdo tem valor real

As case studies em `projects/guisado.html` e `projects/sof-week.html` mostram processo, contexto, técnica e contribuição. Isso é muito mais valioso do que um grid bonito sem narrativa.

### 3. Há um backoffice próprio

O backoffice em `backoffice/server.js` é um diferenciador real:

- autenticação com sessão
- rate limiting
- uploads
- ordenação manual
- visibilidade de projetos
- geração de `assets/js/portfolio-data.js`

Para um portfólio pessoal, isto é acima da média e cria uma boa base para evoluir sem depender de edição manual em tudo.

### 4. Já existe vontade de motion-rich UX

O código mostra tentativa clara de criar experiência imersiva:

- opener em vídeo
- navegação com sensação de cena
- partículas
- formas flutuantes
- elementos hover/touch
- timeline e orbit na página “My Story”

Ou seja: o revamp não precisa inventar a ambição. Precisa dar-lhe estrutura.

## Fragilidades Principais

### 1. O posicionamento ainda está difuso

Tu queres que o site comunique “motion design first”, com espaço para UX/web e outras áreas. Hoje isso ainda não está claramente hierarquizado.

Problemas concretos:

- a homepage não abre com showreel forte; a secção `Works` está em placeholder “in the making” em `index.html`
- não existe uma secção `Play`
- não existe uma estrutura clara por áreas de atuação
- o portfolio lista tudo, mas não cria uma leitura editorial nem filtros de especialização
- o hero é forte em tom, mas ainda não vende imediatamente o teu melhor trabalho

Resultado: quem entra percebe que há talento, mas não sai imediatamente com uma leitura nítida de “este é um motion designer com assinatura e range”.

### 2. A experiência está fragmentada em três linguagens diferentes

Neste momento existem pelo menos três “produtos” dentro do mesmo site:

- homepage antiga com navegação em secções e jQuery/Hammer
- páginas “enhanced” como `mystory.html` e `other-projects.html`
- case studies estáticas em `projects/*.html`

Isto gera problemas de consistência:

- visual
- motion
- IA
- semântica
- código

Em vez de um sistema, tens várias ilhas.

### 3. A layer “enhanced” está a ser usada como remendo, não como sistema

Os ficheiros `assets/css/main-enhanced.css` e `assets/css/portfolio-unified.css` são muito grandes e fazem demasiadas coisas ao mesmo tempo.

Indicadores:

- `assets/css/main-enhanced.css`: 1923 linhas
- `assets/css/portfolio-unified.css`: 2114 linhas
- `assets/js/portfolio-enhanced.js`: 464 linhas
- `assets/js/mystory-enhanced.js`: 435 linhas

Isto não seria um problema se houvesse estrutura de componentes forte. Aqui, porém, muitos efeitos estão acoplados diretamente ao DOM e a posições hardcoded, o que dificulta:

- manutenção
- refactor
- responsividade previsível
- performance

### 4. Há fragilidade real em JS crítico

O ficheiro `assets/js/functions.js` tem pontos frágeis na lógica principal da homepage:

- o opener depende de `#videoLoading`, mas o elemento está comentado em `index.html`
- existem referências a `loadingIndicator.innerHTML` e `loadingIndicator.style.display` sem garantia de o elemento existir
- no final do ficheiro há uma referência a `logoVideo.addEventListener(...)` fora do scope onde `logoVideo` foi definido
- também há referência a `playOverlay`, que não aparece definido
- o showreel está bloqueado por `const showreelInTheMaking = true`

Isto indica uma homepage que já acumula estados temporários e código parcialmente órfão.

### 5. A performance pública está em risco

O problema maior aqui não é só CSS/JS. São também media assets muito pesados.

Exemplos reais encontrados:

- `assets/img/OUTROS/PF_02_MakingOf_FilipeRocha_PedroCosta_PedroSousa.mp4`: **164.16 MB**
- `assets/video/OPENER.mov`: **40.08 MB**
- `assets/img/SOF/INTRO-SEM.mp4`: **13.71 MB**
- `assets/img/OUTROS/Limifield RMA.mp4`: **12.87 MB**
- `assets/img/OUTROS/Noushoe.mp4`: **10.31 MB**

Além disso, em `other-projects.html` os cards podem ser renderizados como `video` com autoplay, loop e muted para vários projetos ao mesmo tempo. Para um portfólio motion isto é tentador, mas sem lazy loading, sem poster strategy e sem priorização de media, o custo sobe depressa.

### 6. O mobile ainda é tratado mais como restrição do que como experiência

Na homepage existe uma `device-notification` a pedir portrait mode ou ecrã maior. Isso é compreensível num protótipo experimental, mas é fraco para um portfólio profissional em 2026.

Se a experiência for scroll-heavy e coreografada, ela tem de:

- funcionar bem em desktop
- degradar bem em mobile
- nunca parecer “desculpa, este site não é para ti”

### 7. O portfólio não é ainda uma ferramenta de descoberta

`other-projects.html` faz render do grid, mas não oferece:

- filtros por área
- ordenação visível
- distinção clara entre featured e secundário
- descoberta por tags/capabilities
- layer editorial

Para um perfil multidisciplinar, isto é especialmente importante. Sem isso, o range trabalha contra ti em vez de trabalhar a teu favor.

### 8. Falta uma secção “Play” e falta mostrar experimentalismo vivo

Pelo teu posicionamento, a secção `Play` pode ser uma arma forte:

- experiências visuais
- explorações mais soltas
- estudos tipográficos
- motion snippets
- interactive sketches
- peças de creative coding

Hoje esse lado não existe na arquitetura do site. Isso reduz diferenciação.

### 9. A acessibilidade e o SEO estão abaixo do potencial do conteúdo

Não encontrei sinais de:

- Open Graph tags
- Twitter cards
- canonical URLs
- structured data

Além disso:

- várias páginas usam `lang="en"` apesar de haver conteúdo misto em português e inglês
- o site depende muito de hover, autoplay e animação
- os cards do portfólio dependem de uma lógica de toque/click específica para revelar overlay

Nada disto impede o site de funcionar. Mas impede o site de ser robusto.

## Observações Técnicas Relevantes

### Arquitetura

- A homepage depende de jQuery 2.2.4 e Hammer.js em `index.html`.
- O resto do site já usa mais JS vanilla moderno.
- Há coexistência de stack antiga e stack nova sem uma camada de composição clara.

### Duplicação e inconsistência

Em `other-projects.html` já existe:

- `.floating-shapes`
- `#particleCanvas`

Mas `assets/js/portfolio-enhanced.js` volta a criar:

- outro `canvas` com id `particleCanvas`
- outra layer `.floating-shapes`

Isto é um sinal claro de duplicação de comportamento e risco de efeitos em conflito.

### Funções não integradas

No `assets/js/portfolio-enhanced.js`, métodos como:

- `setupTrustSection()`
- `setupShowreelEffects()`

existem, mas não são chamados no `init()`. Isto sugere crescimento orgânico sem limpeza posterior.

### Fonte de verdade fragmentada

Atualmente tens:

- `backoffice/data/projects.json`
- `generate-portfolio-data.js`
- `assets/js/portfolio-data.js`
- `projects/*.html`

Isto quer dizer que parte do portfólio é dinâmica e parte continua hardcoded. Para crescer bem, a próxima versão precisa de decidir claramente:

- o que é CMS-driven
- o que é curated/static
- o que é híbrido

### Divergência de regras de ordenação

O backoffice/API e o gerador estático não seguem exatamente a mesma lógica:

- `generate-portfolio-data.js` prioriza `displayOrder`, depois featured, depois year
- a API pública em `backoffice/server.js` ordena featured first e depois year

Isso é pequeno agora, mas é o tipo de detalhe que mais tarde cria inconsistência difícil de rastrear.

## Oportunidades Reais

### 1. O trabalho já suporta uma homepage muito mais cinematográfica

O teu site não precisa de inventar credibilidade. Precisa de editar e encenar melhor o que já existe.

### 2. Motion pode deixar de ser “efeito” e passar a ser “sistema”

Em vez de partículas, glows e hover por todo o lado, o revamp deve trabalhar motion em três níveis:

- motion de narrativa
- motion de interface
- motion de identidade

### 3. Podes transformar o range em vantagem

Em vez de parecer dispersão, o portfólio pode apresentar o teu perfil como:

- **Motion Design** como core
- **3D / Visual Storytelling** como expansão
- **UX / Web / Interactive** como capacidade complementar
- **Play / Experimental** como laboratório autoral

### 4. Tens base para um portfólio “premium but personal”

Não precisas de cair num visual corporate frio nem num site experimental caótico. A oportunidade está precisamente no meio:

- forte autoria
- boa direção editorial
- motion refinado
- melhor arquitetura

## O Que Eu Preservaria

- a identidade escura e atmosférica
- a vontade de ter opener e sensação de “cena”
- o foco em motion como assinatura
- a profundidade das case studies
- o backoffice e a ideia de gestão própria do conteúdo
- o tom mais pessoal em partes como `My Story`

## O Que Eu Mudaria Radicalmente

- a homepage como slider antigo em secções
- a ausência de showreel forte logo no início
- a ausência de filtros e estrutura editorial no portfolio
- a fragmentação entre homepage, portfolio, mystory e case studies
- o excesso de efeitos adicionados por acumulação
- a dependência de CSS/JS monolíticos

## Direção Recomendada Para o Revamp

## Princípio Central

**Motion first, but not motion everywhere.**

Ou seja:

- o site deve respirar motion design
- mas a interface não pode parecer um conjunto de efeitos soltos
- cada movimento tem de reforçar hierarquia, narrativa ou personalidade

## Nova Arquitetura de Informação

Eu recomendaria uma estrutura destas:

1. `Home`
2. `Work`
3. `Play`
4. `About`
5. `Contact`

Podes manter isto como one-page com anchors bem desenhados ou como site multi-page. Para o teu caso, eu vejo mais valor em **homepage editorial + páginas profundas**.

## Estrutura sugerida da Homepage

### 1. Hero cinematográfico

- reel ou sequência curta muito controlada
- statement claro
- call to action para `Selected Work`
- um motion moment forte, mas curto

### 2. Selected Work

- 3 a 5 projetos hero
- motion design claramente em primeiro plano
- layout editorial com sobreposição e depth
- preview por vídeo/poster/scrub

### 3. Capability Split

Uma secção que organiza o range sem o diluir:

- Motion Design
- 3D / Animation
- UX / Web
- Visual Experiments

### 4. Play

- mini laboratório
- peças mais pequenas
- sketches
- motion loops
- web experiments

### 5. About

- perfil
- processo
- sensibilidade criativa
- contexto profissional

### 6. Trust / Clients / Outcomes

- marcas
- contextos reais
- prémios
- colaborações

### 7. Contact

- contacto direto
- formulário melhor
- CTA claro

## Estrutura sugerida da página Work

Aqui é onde o site passa a funcionar realmente como ferramenta.

Deve permitir:

- filtrar por área
- destacar Motion por default
- alternar entre featured e all work
- distinguir case study de external piece
- ver rapidamente year, type, tags e role

Filtros úteis:

- Motion Design
- 3D / Animation
- Branding
- UX / Web
- Interactive / Installations
- Play / Experimental

## Estrutura sugerida da secção Play

Esta secção deve existir. Não como sobra. Como statement.

Formatos possíveis:

- grid editorial com peças curtas
- entradas pequenas com imagem, vídeo ou canvas
- notas de contexto curtas
- coisas que não precisam de “case study formal”

Isto pode ser o sítio mais memorável do site se for tratado com critério.

## Direção Visual Recomendada

### Tom

- dark editorial
- mais maduro
- menos “efeito por efeito”
- mais contraste entre silêncio e impacto

### Tipografia

- tipografia com mais carácter
- boa escala entre headlines, metadata e captions
- evitar cair num look demasiado “template SaaS”

### Motion

- scroll coreografado em momentos específicos
- layers que se cruzam e passam umas sobre as outras
- transições de depth e masking
- pequenos loops embutidos no layout
- motion funcional nos hovers e filtros

### Regra importante

O scroll-driven drama deve existir, mas em blocos pensados. Não em toda a página ao mesmo tempo.

## Recomendação Técnica

## Decisão principal

Eu **não recomendo** fazer este revamp como simples continuação da estrutura atual.

Recomendo um **rebuild do front-end**, preservando e migrando o conteúdo.

### Porque

- a base atual já acumulou demasiada lógica paralela
- a homepage antiga vai lutar contra o tipo de experiência que queres agora
- o teu objetivo é subir o nível, não apenas “polir”

## Stack sugerida

Para este projeto, a direção mais equilibrada seria:

- **Astro** para estrutura estática e performance
- **GSAP + ScrollTrigger** para motion de scroll
- **Lenis** ou equivalente para scroll smoothing, se fizer sentido
- componenteização real para secções e cards
- media strategy com posters, lazy loading e formatos otimizados

Porque esta stack faz sentido:

- mantém performance forte
- deixa fazer motion rico
- funciona bem para case studies e páginas editoriais
- não obriga a transformar tudo numa app pesada

Se quiseres máxima liberdade para interações mais “app-like”, React/Vite também funciona. Mas para um portfólio editorial com muito media, **Astro parece-me a escolha mais inteligente**.

## Plano de Revamp Faseado

### Fase 1. Estratégia e curadoria

- definir o posicionamento central em 1 frase
- escolher 3 a 5 projetos hero
- decidir que trabalhos entram em `Work` e quais entram em `Play`
- rever textos para consistência de tom e idioma

### Fase 2. Nova IA e content model

- desenhar sitemap
- desenhar schema de projeto
- separar `featured`, `case-study`, `play`, `external`
- definir taxonomia por área e formato

### Fase 3. Sistema visual e motion language

- definir tipografia
- definir cor, contraste e spacing
- definir motion principles
- desenhar homepage e work page

### Fase 4. Rebuild front-end

- implementar nova homepage
- implementar work index com filtros
- implementar play page
- implementar about/contact
- migrar case studies para novo sistema

### Fase 5. Dados e CMS

- adaptar o backoffice ao novo schema
- decidir se as case studies continuam estáticas ou passam para conteúdo estruturado
- remover duplicações entre JSON, HTML hardcoded e gerador

### Fase 6. Performance e acabamento

- otimizar vídeos e imagens
- remover assets públicos desnecessários
- implementar lazy loading e posters
- adicionar metadata social e SEO técnico
- testar mobile, touch, reduced motion e loading real

## Quick Wins Se Não Quiseres Rebuild Imediato

Se quiseres melhorar bastante antes de refazer tudo, estes seriam os ganhos mais rápidos:

1. colocar um showreel forte e real na homepage
2. transformar `other-projects.html` numa página com filtros por área
3. criar a secção `Play`
4. reduzir peso dos vídeos públicos
5. corrigir fragilidades em `assets/js/functions.js`
6. remover duplicações entre `other-projects.html` e `portfolio-enhanced.js`
7. limpar e dividir CSS/JS “enhanced”

## Recomendação Final

O site atual já tem bons sinais de autoria e ambição, mas a próxima versão não deve ser tratada como “mais uma ronda de polish”.

Deve ser tratada como:

- reposicionamento
- reorganização editorial
- rebuild técnico controlado

O teu trabalho merece uma interface com mais intenção, mais hierarquia e mais confiança. A melhor decisão aqui não é remendar o que existe até parecer novo. É usar o que já está bom como base de conteúdo e construir uma nova experiência por cima disso, com motion direction realmente pensada.

## Conclusão em Uma Frase

**O conteúdo já está perto de um portfólio premium; a interface e a arquitetura ainda não estão.**
