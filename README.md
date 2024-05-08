# Workshop - Node / Express - Intro

Para visualizar o projeto navegue pelas branchs que representam cada etapa do desenvolvimento

# Requisitos do projeto
- Node (v18 ou posterior)

## Etapas

1. [Configuração do projeto](#1-configuração-do-projeto)
2. [Organizando a estrutura do projeto](#2-organizando-a-estrutura-do-projeto)
3. [Criando models, routes e controllers](#3-criando-models-routes-e-controllers)
4. [Validando os dados da requisição](#4-validando-os-dados-da-requisição)
5. [Criando uma rota para listar um usuário](#5-criando-uma-rota-para-listar-um-usuário)
6. [Criando as rotas de atualização e exclusão de usuário](#6-criando-as-rotas-de-atualização-e-exclusão-de-usuário)
7. [Adicionando um novo atributo para o usuário](#7-adicionando-um-novo-atributo-para-o-usuário)

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

### 3. Criando models, routes e controllers

Vamos criar o arquivo src/models/user.model.js

```javascript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default prisma.user
```

Vamos criar o arquivo src/controllers/user.controller.js

```javascript
import User from '../models/user.model.js'

export default class UserController{
  static async index(req, res) {
    const users = await User.findMany()
    res.json(users)
  }
}
```

Vamos criar o arquivo src/routes/user.route.js

```javascript
import { Router } from 'express'
import UserController from '../controllers/user.controller.js'

const router = Router()

router.get('/', UserController.index)

export default router
```

Vamos importar a rota no arquivo src/routes/index.js

```javascript
import { Router } from 'express'
import userRoute from './user.route.js'

const router = Router()

router.use('/users', userRoute)

export default router
```

Vamos importar as rotas no arquivo server.js

```javascript
import routes from './routes/index.js'
app.use('/api', routes)
```

Para testar a execução, execute o comando `npm start` e verifique se a mensagem é exibida no terminal.
Para testar a rota, acesse http://localhost:3000/api/users no navegador e verifique se a mensagem é exibida.

Vamos criar uma rota para criar um usuário

Vamos adicionar o método create no arquivo src/controllers/user.controller.js

```javascript
export default class UserController{
  static async index(req, res) {
    const users = await User.findMany()
    res.json(users)
  }
  static async create(req, res) {
    const user = await User.create({
      data: req.body
    })
    res.json(user)
  }  
}
```

Vamos adicionar a rota no arquivo src/routes/user.route.js

```javascript
router.post('/', UserController.create)
```

Vamos adicionar no server.js o middleware para o express entender o body da requisição

```javascript
app.use(express.json())
```

Para testar a execução, execute o comando `npm start` e verifique se a mensagem é exibida no terminal.
Para testar a rota, utilize o Postman / Insomnia / Thunderclient para enviar uma requisição POST para http://localhost:3000/api/users com o body contendo os dados do usuário.

### 4. Validando os dados da requisição

Vamos adicionar a validação dos dados utilizando o express-validator

```bash
npm i express-validator
```

Vamos adicionar a validação no arquivo src/controllers/user.controller.js

```javascript
import { validationResult } from 'express-validator'

export default class UserController{
  static async create(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const user = await User.create({
      data: req.body
    })
    res.json(user)
  }  
}
```

Vamos criar um arquivo src/validators/user.validator.js

```javascript
import { body } from 'express-validator'

export const createUserValidator = [
  body('email').isEmail().withMessage("Email inválido"),
  body('name').isString().withMessage("Nome inválido"),
]
```

Vamos importar o validator no arquivo src/routes/user.route.js

```javascript
import { createUserValidator } from '../validators/user.validator.js'
```

Vamos adicionar o validator na rota de criação de usuário

```javascript
router.post('/', createUserValidator, UserController.create)
```

### 5. Criando uma rota para listar um usuário

Vamos adicionar o método show no arquivo src/controllers/user.controller.js

```javascript
export default class UserController{
  static async show(req, res) {
    const user = await User.findUnique({
      where: {
        id: parseInt(req.params.id)
      }
    })
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }
    res.json(user)
  }
}
```

Vamos adicionar a rota no arquivo src/routes/user.route.js

```javascript
router.get('/:id', UserController.show)
```

Agora temos uma rota para listar um usuário, para testar a rota, utilize o Postman / Insomnia / Thunderclient para enviar uma requisição GET para http://localhost:3000/api/users/:id substituindo :id pelo id do usuário.

### 6. Criando as rotas de atualização e exclusão de usuário

Vamos adicionar o método update no arquivo src/controllers/user.controller.js

```javascript
export default class UserController{
  static async update(req, res) {
    const user = await User.findUnique({
      where: {
        id: parseInt(req.params.id)
      }
    })
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }
    const updatedUser = await User.update({
      where: {
        id: parseInt(req.params.id)
      },
      data: req.body
    })
    res.json(updatedUser)
  }
}
```

Vamos adicionar o método delete no arquivo src/controllers/user.controller.js

```javascript
export default class UserController{
  static async delete(req, res) {
    const user = await User.findUnique({
      where: {
        id: parseInt(req.params.id)
      }
    })
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }
    await User.delete({
      where: {
        id: parseInt(req.params.id)
      }
    })
    res.status(204).json({ message: 'Usuário deletado com sucesso' })
  }
}
```

Vamos adicionar as rotas no arquivo src/routes/user.route.js

```javascript
router.put('/:id', UserController.update)
router.delete('/:id', UserController.delete)
```

Agora temos rotas para atualizar e deletar um usuário, para testar as rotas, utilize o Postman / Insomnia / Thunderclient para enviar uma requisição PUT ou DELETE para http://localhost:3000/api/users/:id substituindo :id pelo id do usuário.

Podemos validar a rota de atualização e exclusão de usuário, para isso, vamos adicionar no arquivo src/validators/user.validator.js os validadores updateUserValidator e deleteUserValidator

```javascript
import { body, param } from 'express-validator'

export const updateUserValidator = [
  param('id').isInt().withMessage("ID inválido"),
  body('email').isEmail().withMessage("Email inválido"),
  body('name').isString().withMessage("Nome inválido"),
]

export const deleteUserValidator = [
  param('id').isInt().withMessage("Id inválido"),
]
```

Vamos importar os validadores no arquivo src/routes/user.route.js

```javascript
import { createUserValidator, updateUserValidator, deleteUserValidator } from '../validators/user.validator.js'
```

Vamos adicionar os validadores nas rotas de atualização e exclusão de usuário

```javascript
router.put('/:id', updateUserValidator, UserController.update)
router.delete('/:id', deleteUserValidator, UserController.delete)
```

No arquivo src/controllers/user.controller.js, vamos adicionar a validação dos dados

```javascript
  static async update(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }   
    ...
```

```javascript
  static async delete(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }   
    ...
```

### 7. Adicionando um novo atributo para o usuário

Vamos adicionar o atributo age no arquivo prisma/schema.prisma

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  age   Int?
}
```

Vamos executar o comando para atualizar o banco de dados

```bash
npx prisma db push
```

Esse comando irá adicionar a coluna age na tabela de usuários. Os dados existentes não serão afetados. Caso o campo seja obrigatório, é necessário adicionar o atributo @default(0) para definir um valor padrão.

Vamos ajustar o novo atributo, ele pode ser opcional, para isso, vamos adicionar o atributo required como false no arquivo src/validators/user.validator.js

```javascript
  body('age').isInt().withMessage("Idade inválida").optional(),
```

Agora é possível enviar a idade do usuário na requisição de criação e atualização. Nosso controller já está usando o body completo da requisição, então não é necessário fazer nenhuma alteração no controller.