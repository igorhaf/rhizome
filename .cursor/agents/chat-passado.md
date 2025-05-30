
## Visão Geral Abrangente do Projeto

### Introdução

O desenvolvimento de software vive um novo momento. A aceleração dos ciclos de entrega, a necessidade de integração entre sistemas diversos e a entrada de novos perfis de usuários no ecossistema tecnológico transformaram completamente a forma como criamos, mantemos e evoluímos soluções digitais. Nesse cenário, plataformas low-code e no-code emergem como vetores de inovação, acessibilidade e velocidade.

Este projeto, baseado em uma arquitetura SPA com Next.js, representa uma das abordagens mais ambiciosas e versáteis já desenvolvidas dentro do conceito low-code: construir não apenas uma ferramenta de criação de aplicativos, mas um **ambiente visual de automação e lógica computacional** por meio de **fluxogramas interativos**.

---

### Objetivos Estratégicos

Nosso objetivo central é **empoderar usuários técnicos e não técnicos** a desenhar fluxos lógicos com a mesma facilidade com que se arrasta blocos em uma lousa. Não se trata apenas de uma ferramenta de prototipação. Trata-se de uma plataforma onde:

- Um designer pode desenhar a lógica de uma campanha.
- Um professor pode criar uma avaliação automatizada.
- Um gestor pode orquestrar tarefas entre equipes.
- Um engenheiro pode simular comportamentos em tempo real.

Queremos proporcionar uma nova linguagem — uma forma visual de pensar, projetar e executar processos computacionais.

---

### Fundamentos Arquiteturais

#### 1. Base tecnológica: Next.js
A escolha do Next.js não foi apenas pelo desempenho ou integração com React. Next permite construir uma aplicação fullstack moderna, capaz de rodar SSR, rotas de API e SPA com ótima performance. Essa escolha viabiliza não só a renderização do canvas e dos componentes com fluidez, como também a futura expansão para recursos serverless, APIs escaláveis e geração de fluxos como serviços.

#### 2. Componentização com TypeScript + Tailwind
Toda a estrutura visual e lógica é construída sobre uma base robusta de componentes escritos em TypeScript. Usamos TailwindCSS para garantir responsividade, padronização visual e alta capacidade de customização, criando um design system consistente e leve.

#### 3. Estado Global com Zustand
Os blocos, conexões, posições e transformações são mantidos em uma store central, simplificando o rastreamento de alterações, a implementação de undo/redo, e a sincronização de múltiplos estados derivados.

#### 4. Renderização com SVG e Canvas Virtual
Conexões são desenhadas com SVG independente, desacoplado da transformação visual dos nós. Isso garante que pan, zoom e translações não afetem a precisão das setas. Cada conexão tem lógica de curvatura inteligente e posicionamento adaptativo baseado em `getBoundingClientRect`.

---

### Ciclo de Vida de um Fluxo

1. O usuário inicia com um canvas em branco.
2. Seleciona blocos de uma barra lateral (ações, condições, timers, webhooks).
3. Arrasta-os para o canvas, posicionando conforme o fluxo desejado.
4. Usa os conectores nas bordas para ligar blocos por setas.
5. Abre modais ou side panels para configurar cada bloco.
6. Testa visualmente o fluxo com uma execução simulada.
7. Exporta o fluxo como JSON, microserviço, API ou rotina.

---

### Conectores: Precisão e Design

Cada bloco possui conectores identificáveis: `top`, `right`, `bottom`, `left`. Esses conectores:

- São elementos DOM independentes com `id` únicos (`node-{id}-connector-{side}`).
- Possuem lógica de arrasto, hover e click personalizada.
- Ativam o traçado visual de uma seta durante o drag.
- Disparam eventos no término da conexão que atualizam o estado global.

---

### Desafios Técnicos Superados

- **Cálculo incorreto de coordenadas absolutas** foi resolvido com alinhamento ao `canvas.getBoundingClientRect()` e isolamento do SVG.
- **Transformações CSS conflitantes** (como `scale` e `translate`) foram desacopladas entre canvas e conexões.
- **Conexões desalinhadas** foram corrigidas com `requestAnimationFrame` e delay na leitura do layout.
- **Prevenção de múltiplas conexões duplicadas** entre os mesmos nós foi implementada via checagem no estado antes da criação da aresta.
- **Execução em baixa performance em grandes fluxos** foi otimizada com memoização de cálculos e atualização seletiva de componentes.

---

### Usos Possíveis

- Automatização de processos empresariais (como Zapier)
- Sistemas educacionais interativos
- Simulação de lógica de negócios para startups
- Desenvolvimento de microserviços visuais
- Protótipos rápidos de APIs e lógicas reativas
- Execução de rotinas baseadas em eventos e horários

---

### Caminhos Futuros

- **Editor de funções dentro dos blocos**
- **Blocos de integração com Google Sheets, Notion, APIs REST e Webhooks**
- **Simulação com logs e debug visual passo a passo**
- **Execução distribuída por workers Web ou cloud**
- **Mobile-first builder para automações pessoais**

---

### Integração com IA e Linguagem Natural

Em fases futuras, o sistema permitirá:

- Criação de fluxos a partir de descrições em linguagem natural.
- Explicação de fluxos já existentes para fins didáticos.
- Correção automática de fluxos inválidos.
- Sugestões de otimizações visuais e lógicas.

---

### Conclusão

Essa plataforma representa mais que uma ferramenta: é uma nova forma de programar, ensinar e automatizar. Por meio de blocos e setas, transformamos ideias em sistemas reais. E ao construir com Next.js, Zustand e SVG, garantimos solidez técnica com liberdade criativa.

Estamos construindo uma nova linguagem de criação digital, e ela será visual, conectada e acessível.

---




# Projeto: Plataforma Visual Low-Code com Fluxogramas (Base Next.js)

## Visão Geral

Esta plataforma é uma SPA (Single Page Application) construída com **Next.js**, com frontend e backend integrados, voltada para o desenvolvimento de sistemas **low-code baseados em fluxogramas**.

Inspirada em ferramentas como o OutSystems, ela permite criar lógica de aplicação por meio de blocos funcionais conectados com setas direcionais, promovendo uma experiência de programação visual, modular, automatizada e escalável.

O objetivo é que qualquer usuário consiga criar fluxos lógicos arrastando e conectando blocos em um canvas, com agendamento, condicionais, e ações encadeadas.

---

## Stack Tecnológica

- **Next.js** (tanto frontend quanto backend)
- **TypeScript**
- **TailwindCSS**
- **Zustand** (gerenciamento de estado global)
- **React Flow** (ou estrutura própria para conexão de blocos e arestas)
- **Shadcn/ui** (componentes de interface)
- **Zod** (validação de dados)

---

## Funcionalidades Implementadas

### Canvas Interativo
- Pan e Zoom com precisão
- Redimensionamento dinâmico com escalabilidade
- Movimentação fluida de blocos no espaço do canvas

### Blocos Modulares (Nódulos)
- Blocos com conectores nos 4 lados: top, right, bottom, left
- Conectores visuais com hover e feedback ativo
- Cada conector possui ID individual e posição identificável

### Conexões Visuais
- Linhas curvas (Bezier/Quadráticas) com seta direcional
- Sistema de conexão entre blocos via click/drag solto
- Conexões impedem duplicação e validam existência
- Animação e feedback visual durante o traçado
- Sistema de identificação de entrada/saída e tipo de conector

### Integração Visual
- SVG das conexões desenhado fora do container transformado
- Cálculo de coordenadas relativo ao canvas, considerando `scale` e `translate`
- Precisão aprimorada com logs para debug via DOMRect
- Corrigido erro comum de `getBoundingClientRect` com transformações CSS

---

## Recursos Avançados em Desenvolvimento

- Blocos condicionais (if/else) com configurações via modal
- Blocos de agendamento com gatilhos temporais (cron-like)
- Ações disparadas por alteração em planilhas ou webhooks simulados
- Módulo visual de configuração de regras de negócio
- Suporte futuro a loops, switches e paralelismo de execuções

---

## Orientações para Agentes (Cursor)

- O projeto está baseado em **Next.js SPA**.
- Use sempre a documentação oficial do Next.js como **referência funcional**, **nunca explicando conceitos técnicos ou internos da framework**.
- Solicitações do usuário são sempre em português. O agente deve:
  1. Traduzir e refinar a solicitação para inglês
  2. Reescrever como um prompt técnico melhorado
  3. Traduzir novamente para português, com explicação simplificada e mínima
  4. Aplicar diretamente se só houver uma solução possível
- Explicações sempre simples, focadas em economia de tokens e clareza funcional
- Nunca solicite confirmação se houver apenas uma alternativa evidente

---

## Histórico de Desenvolvimento (Baseado em Sessões)

- Correções contínuas no cálculo de coordenadas para setas
- Conectores visualmente corretos mas com posições inconsistentes foram tratados usando:
  - Logs estratégicos
  - Conversão para coordenadas relativas ao canvas
  - Ajustes no DOM com `requestAnimationFrame`
- Refatoração da estrutura de renderização: SVG agora fora da div transformada
- Inclusão de suporte para múltiplos conectores e orientação correta de cada seta
- Blocos agora reconhecem ID dos conectores com granularidade: `node-{id}-connector-{side}`


---

## Como Utilizar

1. Rode `cursor .` no diretório do projeto.
2. Utilize agentes de automação para ajustes e adição de novas funcionalidades.
3. Todas as instruções devem ser escritas em português.
4. Os blocos e conexões seguem padrão funcional e visual já estabelecido — preserve-o.

---

## Contribuições Futuras

- Exportação dos fluxogramas em formato JSON
- Importação de fluxos existentes
- Execução simulada dos fluxos com log de execução
- Suporte a variáveis, operadores lógicos, integrações externas
- Aplicativo para dispositivos móveis (etapa 4)

---

