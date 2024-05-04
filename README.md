# Workshop - Node / Express - Intro

Para visualizar o projeto navegue pelas branchs que representam cada etapa do desenvolvimento

# Requisitos do projeto
- Node (v18 ou posterior)

## Etapas

1. [Configuração do projeto]()

## Passo a Passo

### 1. Configuração do projeto

Vamos iniciar um projeto Node.js com Express. Para isso, crie um diretório para o projeto e execute o comando `npm init -y` para criar o arquivo `package.json`.

Em seguida, instale o Express com o comando `npm install express`.

Adicionamos o nodemon para facilitar o desenvolvimento. Para isso, execute o comando `npm install nodemon --save-dev`.

Ajustamos o package.json para executar o nodemon com o comando `npm start`.

```json
"scripts": {
    "start": "nodemon server.js"
  },
```

Criamos a pasta src e o arquivo server.js, nesse arquivo adicionamos apenas um console.log para testar a execução

```javascript
console.log('Hello World');
```

Para testar a execução, execute o comando `npm start` e verifique se a mensagem é exibida no terminal.