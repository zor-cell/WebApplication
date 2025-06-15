# Web Application
## Description
This repository contains a full stack web application for my coding projects, which is hosted on a self-hosted GitHub runner.
More in-depth technical details of this project can be found in the [Wiki](https://github.com/zor-cell/WebApplication/wiki) of this repository. 

The project includes descriptions and websites for my coding projects. The exposed
entry points for my application are the following:
* Frontend - [zorphy.net](https://zorphy.net)
* Backend - [server.zorphy.net](https://zorphy.net)

Made by [Philippe Zorman](https://github.com/zor-cell/WebApplication/tree/master)

## Services
The project exposes three main services at the moment:
* **Backend**

  The Backend Server is a Java [Spring Boot](https://spring.io/projects/spring-boot) application.
* **Frontend**

  The Frontend Server is a [Angular](https://angular.dev/) application.
* **Database**

  The database is a [PostgreSQL](https://www.postgresql.org/) database.


## Setup
There are 2 ways to set up the project: using Docker (recommended) or running each service manually.

It is important to note that for either options, environment variables need to be set in 
the root directory in a `.env` file.
An example file is provided with the `.env.example` file.

### Option 1: Docker (recommended)
You can run the entire stack using Docker, which simplifies the setup process and avoids the need to install any additional tools or dependencies.  
This method is ideal for quickly spinning up the project in a consistent environment.

#### Requirements
* [Docker](https://www.docker.com/) installed on your machine

#### Commands
* From the root of the project, run:
  ```bash
  docker compose up -d --build
  ```

This will build and start all services automatically in the background with Docker.
The services can then be reached on these ports:
* Backend - http://localhost:8020
* Frontend - http://localhost:8021
* Database - http://localhost:8022

### Option 2: Manual setup
If you prefer to run each service locally without Docker, you'll need to install all required dependencies and run each component separately.

#### Requirements
* [Java](https://www.java.com/) with [Maven](https://maven.apache.org/) (backend)
* [Node.js](https://nodejs.org/) with [npm](https://www.npmjs.com/) (frontend)
* [Docker](https://www.docker.com/) (database)

#### Commands
* **Backend**
  ```bash
  cd backend
  mvn spring-boot:run
  ```
* **Frontend**
  ```bash
  cd frontend
  npm install
  npm run start
  ```
  
* **Database**
  
  Run in root directory:
  ```bash
  docker compose up -d --build db
  ```

This will run all services locally. The services can then be reached on these ports:
* Backend - http://localhost:8080
* Frontend - http://localhost:4200
* Database - http://localhost:8022

## Deployment
The web application is automatically deployed by a CI/CD pipeline with a GitHub runner. The application is deployed to the host server with Docker Compose to manage all the different services.

A more detailed documentation can be found on this repositories wiki pages [here](https://github.com/zor-cell/WebApplication/wiki/Deployment). 
