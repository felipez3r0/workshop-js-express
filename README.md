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
8. [Adicionando relacionamento entre tabelas](#8-adicionando-relacionamento-entre-tabelas)
9. [Adicionando Swagger para documentação da API](#9-adicionando-swagger-para-documentação-da-api)
10. [Adicionando autenticação com JWT](#10-adicionando-autenticação-com-jwt)

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

### 8. Adicionando relacionamento entre tabelas

Vamos criar uma nova tabela chamada Task no arquivo prisma/schema.prisma para salvar as tarefas de um usuário

```prisma
model Task {
  id     Int     @id @default(autoincrement())
  title  String
  userId Int
  user   User    @relation(fields: [userId], references: [id])
}
```

Observem que a tabela Task possui um campo userId que é uma chave estrangeira para a tabela User. O campo userId é obrigatório, pois não possui o atributo required como false.
O relacionamento entre as tabelas é feito através do atributo @relation, onde é informado os campos que fazem o relacionamento. No caso, o campo userId da tabela Task faz referência ao campo id da tabela User.

Precisamos ajustar o model User para ter a relação com a tabela Task

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  age   Int?
  tasks Task[]
}
```

O User tem um array de tasks, que é o relacionamento com a tabela Task.

Agora Vamos executar o comando para atualizar o banco de dados

```bash
npx prisma db push
```

Esse comando irá adicionar a tabela Task no banco de dados. Agora é possível criar tarefas para um usuário.

Vamos criar o arquivo src/models/task.model.js

```javascript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default prisma.task
```

Vamos criar o arquivo src/controllers/task.controller.js

```javascript
import Task from '../models/task.model.js'

export default class TaskController{
  static async index(req, res) {
    const tasks = await Task.findMany()
    res.json(tasks)
  }
  static async create(req, res) {
    const task = await Task.create({
      data: req.body
    })
    res.json(task)
  }
}
```

Vamos criar o arquivo src/routes/task.route.js

```javascript
import { Router } from 'express'
import TaskController from '../controllers/task.controller.js'

const router = Router()

router.get('/', TaskController.index)
router.post('/', TaskController.create)

export default router
```

Vamos importar a rota no arquivo src/routes/index.js

```javascript
import taskRoute from './task.route.js'

router.use('/tasks', taskRoute)
```

Agora é possível criar tarefas para um usuário, para testar as rotas, utilize o Postman / Insomnia / Thunderclient para enviar uma requisição POST para http://localhost:3000/api/tasks com o body contendo os dados da tarefa.

Um exemplo de body para criar uma tarefa

```json
{
  "title": "Tarefa 1",
  "userId": 1
}
```

Reparem que é necessário informar o id do usuário que a tarefa pertence. Para listar as tarefas, utilize a rota http://localhost:3000/api/tasks.

Podemos ajustar a rota para retornar com os campos do usuário, para isso, vamos ajustar o método index no arquivo src/controllers/task.controller.js

```javascript
  static async index(req, res) {
    const tasks = await Task.findMany({
      include: {
        user: true
      }
    })
    res.json(tasks)
  }
```

Observem que foi adicionado o atributo include com o valor user: true, isso faz com que a tarefa retorne com os dados do usuário. Atenção ao utilizar o include, pois pode retornar muitos dados desnecessários. É possível informar os campos que deseja retornar.

```javascript
  static async index(req, res) {
    const tasks = await Task.findMany({
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    })
    res.json(tasks)
  }
```

Vamos adicionar um novo validator para a Task no arquivo src/validators/task.validator.js

```javascript
import { body } from 'express-validator'

export const createTaskValidator = [
  body('title').isString().withMessage("Título inválido"),
  body('userId').isInt().withMessage("ID do usuário inválido"),
]
```

Vamos importar o validator no arquivo src/routes/task.route.js

```javascript
import { createTaskValidator } from '../validators/task.validator.js'

router.post('/', createTaskValidator, TaskController.create)
```

### 9. Adicionando Swagger para documentação da API

Vamos instalar o swagger-autogen para gerar a documentação da API

```bash
npm i --save-dev swagger-autogen
```

Vamos instalar o swagger-ui-express para visualizar a documentação

```bash
npm i swagger-ui-express
```

Vamos criar o arquivo src/swagger.js

```javascript
import swaggerAutogen from 'swagger-autogen'

const doc = {
  info: {
      version: "1.0.0",
      title: "Minha API",
      description: "API de exemplo - FATEC ADS"
  },
  servers: [
      {
          url: 'http://localhost:3000'
      }
  ]
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc)
```

Vamos adicionar a rota para visualizar a documentação no arquivo server.js

```javascript
import express from 'express'
import routes from './routes/index.js'
import swaggerUi from 'swagger-ui-express'
import swaggerFile from './swagger-output.json' with { type: "json" } // Carregar o arquivo JSON

const app = express()
const PORT = 3000

app.use(express.json())
app.use('/api', routes)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile)) // Adicionar a rota para visualizar a documentação

app.listen(PORT, () => {
  console.log(`Server executando em http://localhost:${PORT}`)
})
```

Precisamos adicionar o comando para gerar a documentação no arquivo package.json

```json
"scripts": {
    "start": "npx nodemon src/server.js",
    "swagger": "node src/swagger.js"
  },
```

Agora é possível gerar a documentação da API com o comando `npm run swagger` e visualizar a documentação em http://localhost:3000/docs.

Podemos adicionar ao nosso swagger.js a definição das entidades da API e dos Body Params que vamos utilizar

```javascript
const doc = {
  info: {
      version: "1.0.0",
      title: "Minha API",
      description: "API de exemplo - FATEC ADS"
  },
  servers: [
      {
          url: 'http://localhost:3000'
      }
  ],
  definitions: {
    AddOrUpdateUser: {
      email: "novoemail@email.com", name: "Novo nome do usuário", age: 25
    },
    AddOrUpdateTask: {
      title: "Nova tarefa", userId: 1
    }
  }
}
```

No nosso controller, podemos adicionar um comentário para o swagger-autogen entender o que é esperado na requisição

```javascript
  static async create(req, res) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/AddOrUpdateUser"
                    }  
                }
            }
        } 
    */
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const user = await User.create({
      data: req.body
    })
    res.json(user)
  } 
```

Outra opção, talvez até mais interessante, é adicionar o comentário diretamente no arquivo de validação

```javascript
import { body, param } from 'express-validator'

export const createUserValidator = [
  /*  #swagger.requestBody = {
          required: true,
          content: {
              "application/json": {
                  schema: {
                      $ref: "#/components/schemas/AddOrUpdateUser"
                  }  
              }
          }
      } 
  */  
  body('email').isEmail().withMessage("Email inválido"),
  body('name').isString().withMessage("Nome inválido"),
  body('age').isInt().withMessage("Idade inválida").optional(),
]

export const updateUserValidator = [
  /*
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do usuário',
      required: true,
      type: 'integer'
    }
    
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/AddOrUpdateUser"
          }  
        }
      }
    }
  */
  param('id').isInt().withMessage("ID inválido"),
  body('email').isEmail().withMessage("Email inválido"),
  body('name').isString().withMessage("Nome inválido"),
  body('age').isInt().withMessage("Idade inválida").optional(),
]

export const deleteUserValidator = [
  /*
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do usuário',
      required: true,
      type: 'integer'
    }
  */
  param('id').isInt().withMessage("ID inválido"),
]
```

Dessa forma, o swagger-autogen irá gerar a documentação com base nos comentários que adicionamos no código. Para atualizar a documentação, execute o comando `npm run swagger` e verifique a documentação em http://localhost:3000/docs depois de iniciar o projeto com `npm start`.

### 10. Adicionando autenticação com JWT

Vamos começar ajustando o arquivo prisma/schema.prisma para adicionar um campo password na tabela User

```prisma
model User {
  id       Int     @id @default(autoincrement())
  email    String  @unique
  name     String?
  age      Int?
  password String
  tasks    Task[]
}
```

Vamos executar o comando para atualizar o banco de dados

```bash
npx prisma db push
```

Vamos instalar o pacote bcrypt para criptografar a senha

```bash
npm i bcrypt
npm i -D @types/bcrypt
```

Vamos ajustar o cadastro de usuário para receber o password, começamos ajustando o `user.validator.js`

```javascript
body('password').isString().withMessage("Senha inválida"),
```

Ajustamos o `user.controller.js` para criptografar a senha, a ideia é utilizar o bcrypt para gerar a hash da senha e evitar salvar a senha em texto puro no banco de dados

```javascript
import bcrypt from 'bcrypt'

export default class UserController{
  static async create(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const password = await bcrypt.hash(req.body.password, 10) // Gera a hash da senha
    const user = await User.create({
      data: {
        ...req.body,
        password
      }
    })
    res.json(user)
  }
}
```

Agora é possível criar um usuário com senha criptografada, para testar a rota, utilize o Postman / Insomnia / Thunderclient para enviar uma requisição POST para http://localhost:3000/api/users com o body contendo os dados do usuário.

Também podemos atualizar o swagger.js para adicionar o campo password

```javascript
    AddOrUpdateUser: {
      email: "novoemail@email.com",
      name: "Novo nome do usuário",
      age: 25,
      password: "novasenha"
    },
```

Para a autenticação vamos gerar um JWT com o nome do usuário, seu id e o email, vamos instalar o pacote jose para gerar o JWT

```bash
npm i jose
```

No .env vamos adicionar uma chave secreta para gerar o JWT

```env
JWT_SECRET=chavesecretalongacommuitoscaracteres
```

No controller do user vamos criar uma função login

```javascript
import * as jose from 'jose'

static async login(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    } 

    const { email, password } = req.body
    const user = await User.findUnique({
      where: {
        email
      }
    })

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Senha inválida' })
    }

    // Gera o token JWT
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(process.env.JWT_SECRET); // O método signJWT espera um Uint8Array, então vamos converter a string para Uint8Array

    const token = await new jose.SignJWT({
      id: user.id,
      email: user.email,
      name: user.name
    })
    .setIssuedAt()
    .setExpirationTime('1d') // 1 dia
    .setProtectedHeader({ alg: 'HS256' }) // algorithm
    .sign(secretKey)

    res.json({ message: 'Usuário logado com sucesso!', token })
  }
```

Vamos ajustar o user.validator.js para validar o login

```javascript
export const loginValidator = [
  /*  #swagger.requestBody = {
          required: true,
          content: {
              "application/json": {
                  schema: {
                      $ref: "#/components/schemas/LoginUser"
                  }  
              }
          }
      } 
  */
  body('email').isEmail().withMessage("Email inválido"),
  body('password').isString().withMessage("Senha inválida")
]
```

Agora podemos adicionar essa rota no user.route.js

```javascript
router.post('/login', loginValidator, UserController.login)
```

Agora é possível fazer login na aplicação, para testar a rota, utilize o Postman / Insomnia / Thunderclient para enviar uma requisição POST para http://localhost:3000/api/users/login com o body contendo os dados do usuário.

Com o token gerado, podemos adicionar a autenticação nas rotas, vamos criar um middleware para validar o token. Vamos criar o arquivo em uma pasta middlewares/auth.middleware.js

```javascript
import * as jose from 'jose'

export default async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '') // Pega o token do header
  if (!token) { // Verifica se o token foi informado
    return res.status(401).json({ message: 'Token não informado' })
  }

  const encoder = new TextEncoder();
  const secretKey = encoder.encode(process.env.JWT_SECRET); // O método verify espera um Uint8Array, então vamos converter a string para Uint8Array

  try {
    const payload = await jose.jwtVerify(token, secretKey) // Verifica se o token é válido
    req.user = payload
    next() // Continua a execução
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' })
  }
}
```

Vamos adicionar o middleware nas rotas que precisam de autenticação, por exemplo, a rota de listagem de tarefas

```javascript
router.get('/', authMiddleware, TaskController.index)
```

Para avisar o swagger que vamos utilizar token em alguma rota vamos adicionar o component no swagger.js

```javascript
const doc = {
  info: {
      version: "1.0.0",
      title: "Minha API",
      description: "API de exemplo - FATEC ADS"
  },
  components: {
    securitySchemes:{
        bearerAuth: {
            type: 'http',
            scheme: 'bearer'
        }
    }
},
...
```

No TaskController, na função de listagem de tarefas vamos adicionar o comentário de security, isso vai avisar o swagger que essa rota precisa de autenticação

```javascript
export default class TaskController{
  static async index(req, res) {
    /* #swagger.security = [{
        "bearerAuth": []
    }] */ 
```

Para atualizar a documentação com as novas rotas e autenticação, execute o comando `npm run swagger` e verifique a documentação em http://localhost:3000/docs depois de iniciar o projeto com `npm start`.