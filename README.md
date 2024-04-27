# Nexabuild

Nexabuild é uma plataforma de automação low-code inspirada na filosofia Node-RED, enfocando a capacidade do usuário de conectar diferentes sistemas e APIs de maneira visual e simplificada. A plataforma permite uma personalização extensa por meio de sua interface baseada em nós, tornando a automação acessível a desenvolvedores e não-desenvolvedores.

## Estrutura do Projeto

O projeto está organizado da seguinte maneira:

- `backend/`: Contém o serviço backend escrito em Express.js e Node.js.
- `frontend/`: Armazena a interface do usuário construída com React.
- `ui/`: Diretório para ativos de UI como ícones e elementos visuais.

Arquivos adicionais de configuração e desenvolvimento incluem:

- `.gitignore` e `.gitattributes` para configurações do Git.
- `Dockerfile` e `docker-compose.yml` para conteinerização com Docker.
- `postman-if-form.json` e `postman-tabs.json` para collections do Postman.

## Filosofia do Projeto

Assim como o Node-RED, a Nexabuild busca proporcionar uma ferramenta onde o fluxo de trabalho e a lógica de automação sejam intuitivamente mapeados em uma interface gráfica. Com isso, a ferramenta visa democratizar a programação, permitindo que ideias sejam rapidamente transformadas em aplicações funcionais.

## Como Executar

```bash
→ ~ lsb_release -a
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 22.04.2 LTS
Release:        22.04
Codename:       jammy
→ ~ 
```

### Backend

No diretório `backend`, instale as dependências e inicie o servidor:

```bash
npm install
npm run start
```

### Frontend

No diretório `frontend`, use o Yarn para instalar as dependências e iniciar o aplicativo:

```bash
yarn install
yarn start
```

### Docker

Para construir e iniciar o projeto com Docker, utilize:

```bash
docker-compose up --build
```

### Contribuição

Contribuições para melhorar Nexabuild são bem-vindas. Sinta-se à vontade para clonar, forkar e propor pull requests ou abrir issues para discutir melhorias.

### Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para mais detalhes.
