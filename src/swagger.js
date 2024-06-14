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
  ],
  definitions: {
    User: {
      id: 1,
      email: "email@email.com",
      name: "Nome do usuário",
      age: 20
    },
    Task: {
      id: 1,
      title: "Título da tarefa",
      userId: 1
    },
    AddOrUpdateUser: {
      email: "novoemail@email.com",
      name: "Novo nome do usuário",
      age: 25
    },
    AddOrUpdateTask: {
      title: "Nova tarefa",
      userId: 1
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc)