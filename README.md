# User Control

This project provides a user control system with user and administrator roles. The application is divided into frontend and backend components, utilizing Docker to simplify deployment and configuration.

## Usage Instructions

- Prerequisites
  - Ensure you have Docker and Docker Compose installed on your system.

1. Clone the Repository

```bash
git clone https://github.com/jorge0102/management.git
cd management
```

2. Start the Application, run the following command to start the application:

```bash
docker-compose up -d
```

Let the server start serving if you do not login within 10 seconds after the images are displayed.

No need to generate the .env as there is already a bash script defined to handle that (createEnv.sh).

If there is any issue, make sure ports 8000, 3000, or 5432 are not occupied. You can stop services using these ports before executing the above command.

## Example: Stop service on port 8000

```bash
sudo service stop nombre_del_servicio
```

## Roles and Predefined Users

The application has two roles: "user" and "admin." Additionally, two predefined users have been created to facilitate functionality testing.

```bash
Rol Admin
Email: administrador@example.com
Nombre: Administrador
Contraseña: root
Rol: admin
```

```bash
Rol Usuario
Email: usuario@example.com
Nombre: Usuario
Contraseña: password
```

## Features

- User Role

  - Retrieve their own user information.
  - Edit their information.
  - Delete their account.

Admin Role

- All functionalities of the user role.
- Create new users.
- Restricted access to backend services.
- Potential user email sending in the future.

## Technologies Used

- Frontend

  - React: JavaScript library for building user interfaces.
  - React Router DOM: Route management in React applications.
  - Tailwind CSS: Styling framework usable with reusable components.

- Backend

  - Fastify: Fast and lightweight web framework for Node.js.
  - @fastify/cors: Enables CORS support in the Fastify application.
  - @fastify/jwt: JWT-based authentication for Fastify.
  - @prisma/client: Database client for accessing the database with Prisma.
  - dotenv: Loading environment variables from a file.
  - exceljs: Library for working with Excel files.
  - fastify-static: Serving static files in Fastify.
  - fastify-swagger: Automatic generation of Swagger documentation.
  - fastify-zod: Schema validation using Zod for Fastify.
  - These technologies have been selected to streamline development and ensure the security and efficiency of the user control system.

## Export for Postman and Swagger

The application offers the possibility to explore and test its services through development tools such as Postman and Swagger. You can access the documentation at the following links:
Postman Collection:

Postman Collection:
[Downloads Collection JSON](backend/postman/Management%20User.postman_collection.json)
[Downloads Enviroment JSON](backend/postman/Enviroment%20Management.postman_environment.json)

Swagger Documentation:
[Access Swagger Documentation](http://127.0.0.1:8000/docs)

Make sure to have Postman installed on your system to import the collection and easily explore API endpoints. Similarly, the Swagger documentation provides an interactive interface to understand and test the application's services.

Note that the provided URL (http://127.0.0.1:8000/docs) is local, and users should access it while the application is running.

## Contribution and Version Management

This project follows a version management workflow based on GitFlow. GitFlow is used to organize and structure development, facilitating collaboration and the implementation of new features, bug fixes, and improvements. Below are some guidelines for contributing to the project:

### GitFlow Branches

- `master`: Represents the stable version ready for production.
- `develop`: Main development branch where all features are integrated.
- `feature/{feature-name}`: Branches for developing new features.
- `bugfix/{bug-name}`: Branches for bug fixes.
- `release/{release-name}`: Branches for preparing new releases.

### Reporting Bugs and Enhancement Requests

If you encounter a bug or have an enhancement suggestion, use the "Issues" section in this repository. Ensure to provide clear and concise details so that the issue can be reproduced and addressed effectively.

Thank you for contributing to the development of this project.
