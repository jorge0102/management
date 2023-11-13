import { FastifyInstance } from "fastify";
import {
  loginHandler,
  registerUserHandler,
  updateUserHandler,
  getUsersHandler,
  deleteUserHandler,
  getUserHandler,
  getExportExcelHandler,
} from "./user.controller";
import { $ref } from "./user.schema";

async function userRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: {
        body: $ref("createUserSchema"),
        response: {
          201: $ref("createUserResponseSchema"),
        },
      },
      preHandler: [server.authenticate],
    },
    registerUserHandler
  );

  server.post(
    "/update/:id",
    {
      schema: {
        body: $ref("updateUserSchema"),
        response: {
          201: $ref("updateUserResponseSchema"),
        },
        params: {
          type: 'object',
          properties: {
            id: { type: 'number' },
          },
        },
      },
      preHandler: [server.authenticate],
    },
    updateUserHandler
  );
  
  server.post(
    "/delete/:id",
    {
      schema: {
        response: {
          201: $ref("deleteUserResponseSchema"),
        },
        params: {
          type: 'object',
          properties: {
            id: { type: 'number' },
          },
        },
      },
      preHandler: [server.authenticate],
    },
    deleteUserHandler
  );

  server.post(
    "/login",
    {
      schema: {
        body: $ref("loginSchema"),
        response: {
          200: $ref("loginResponseSchema"),
        },
      },
    },
    loginHandler
  );

  server.get(
    "/",
    {
      preHandler: [server.authenticate],
    },
    getUsersHandler
  );

  server.get(
    "/:email",
    {
      preHandler: [server.authenticate],
    },
    getUserHandler
  );

  server.get(
    "/excel",
    {
      preHandler: [server.authenticate],
    },
    getExportExcelHandler
  );
}

export default userRoutes;
