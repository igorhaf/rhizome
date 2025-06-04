# 🧬 Contexto do Projeto: Rhizome (Baobá/Nexabuild)

## Visão Geral
Rhizome é uma plataforma low-code baseada em diagramas para criação visual de fluxos e automações, inspirada em ferramentas como OutSystems, Node-RED e Webflow.

A ideia central é permitir que o usuário monte **"nós" e "conexões"** para gerar aplicações, APIs ou automações complexas sem escrever código.

## Tecnologias
- **Framework**: React + Next.js 14 (App Router)
- **Estilização**: TailwindCSS
- **Estado Global**: Zustand
- **Arrastar e soltar**: `dnd-kit`
- **Backend**: Server Actions + APIs REST + futura camada Python
- **Componentização**: Blocos reutilizáveis com responsabilidades únicas

## Estrutura de Pastas
- `app/`: rotas com App Router (SSR + Server Components)
- `components/`: componentes visuais genéricos
- `nodes/`: componentes específicos que representam "nós" da automação
- `hooks/`: lógica compartilhada com React hooks
- `lib/`: funções auxiliares, helpers de fluxo, schemas
- `store/`: Zustand stores

## Regras de Design
- **Baixo acoplamento entre blocos**
- **Reatividade otimizada com memoização e lazy loading**
- **Preferência por Server Components quando possível**
- **Cada nó deve ser renderizável independentemente**
- **Arrastar-e-soltar deve funcionar de forma suave**
- **UI com acessibilidade e responsividade**

## Objetivos Futuros
- Exportação de fluxos como código (Python ou Node)
- Integração com bots (WhatsApp, Telegram)
- Extensão da IA para gerar nós com base em comandos naturais (Fase 3)

## Palavras-chave para prompts
- “Nós”, “blocos”, “automação”, “diagrama”, “plataforma low-code”, “estrutura visual”