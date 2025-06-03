# My Web App
This repository contains a full stack web application for my coding projects, which is hosted on a self-hosted GitHub runner.

The exposed entry points for my application are the following:
* frontend - [zorphy.net](https://zorphy.net)
* backend - [server.zorphy.net](https://zorphy.net)

## Dependencies
To run the application locally, the following dependencies need to be installed:
* Java + Maven
* Node + npm


## Backend
The backend server is a Java **Spring Boot** server. 

To run the server locally execute the following command in the directory `backend/`:
```
mvn spring:boot run
```

## Frontend
The frontend server is an **Angular** application.

To run the server locally execute the following commands in the directory `frontend/`:
```
npm install
ng serve
```

## Database
The database server is a **PostgreSQL** Docker container that uses docker volumes for data persistence.

To run the database container locally execute the following command in the root directory:
```
docker compose up db
```

## Deployment
The web application is automatically deployed by a CI/CD pipeline with a GitHub runner. The application is deployed to the host server with **Docker Compose** to manage all the different services.

A more detailed documentation can be found on this repositories wiki pages [here](https://github.com/zor-cell/WebApplication/wiki/Deployment). 
