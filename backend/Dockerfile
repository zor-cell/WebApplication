FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /backend

COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:21-jdk-slim

WORKDIR /backend

COPY --from=build /backend/target/*.jar backend.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "backend.jar"]