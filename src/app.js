const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function checkRepositoryExists(request, response, next) {
  const { id } = request.params;
  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(400).json({ error: 'Repository does not exists' });
  }

  request.repository = repository;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs: techs , likes: 0 }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", checkRepositoryExists, (request, response) => {
  const { repository } = request;
  const { title, url, techs } = request.body;

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository); 
});

app.delete("/repositories/:id", checkRepositoryExists, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found'});
  }

  repositories.splice(repositoryIndex, 1);
  
  return response.status(204).send();
});

app.post("/repositories/:id/like", checkRepositoryExists, (request, response) => {
  const { repository } = request;

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
