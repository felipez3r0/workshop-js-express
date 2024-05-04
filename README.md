# Workshop - Node / Express - Intro

Para visualizar o projeto navegue pelas branchs que representam cada etapa do desenvolvimento

# Requisitos do projeto
- Node (v18 ou posterior)

## Etapas

1. [Configuração do projeto](#1-configuração-do-projeto)
2. [Organizando a estrutura do projeto](#2-organizando-a-estrutura-do-projeto)

## Passo a Passo

### 1. Configuração do projeto

Vamos iniciar um projeto Node.js com Express. Para isso, crie um diretório para o projeto e execute o comando `npm init -y` para criar o arquivo `package.json`.

Em seguida, instale o Express com o comando `npm install express`.

Adicionamos o nodemon para facilitar o desenvolvimento. Para isso, execute o comando `npm install nodemon --save-dev`.

Ajustamos o package.json para executar o nodemon com o comando `npm start`.

```json
"scripts": {
    "start": "nodemon src/server.js"
  },
```

Caso aconteça algum erro na execução é possível configurar com npx para executar o nodemon.

```json
"scripts": {
    "start": "npx nodemon src/server.js"
  },
```

Criamos a pasta src e o arquivo server.js, nesse arquivo adicionamos apenas um console.log para testar a execução

```javascript
console.log('Hello World')
```

Para testar a execução, execute o comando `npm start` e verifique se a mensagem é exibida no terminal.

### 2. Organizando a estrutura do projeto

Primeiro ajustamos nosso package.json para usar o type module

```json
"type": "module",
```

Vamos organizar a estrutura do projeto

- Criamos a pasta src/routes e o arquivo index.js
- Criamos a pasta src/controllers
- Criamos a pasta src/models

No arquivo server.js, importamos o express e criamos uma instância do express

```javascript
import express from 'express'

const app = express()
```

Adicionamos a porta para o servidor

```javascript
const PORT = 3000
```

Adicionamos a rota principal

```javascript
app.get('/', (req, res) => {
  res.send('Hello World')
})
```

Adicionamos a execução do servidor

```javascript
app.listen(PORT, () => {
  console.log(`Server executando em http://localhost:${PORT}`)
})
```

Para testar a execução, execute o comando `npm start` e verifique se a mensagem é exibida no terminal.

Para testar a rota, acesse http://localhost:3000/ no navegador e verifique se a mensagem é exibida.

Instalamos as dependências do Prisma

```bash
npm install @prisma/client
```

```bash
npm install prisma --save-dev
```

Executamos o comando para criar o arquivo prisma/schema.prisma

```bash
npx prisma init
```

Vamos configurar o arquivo prisma/schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

Executamos o comando para criar o banco de dados

```bash
npx prisma db push
```