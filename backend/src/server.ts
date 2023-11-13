import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import fjwt, { JWT } from "fastify-jwt";
import swagger from "fastify-swagger";
import { withRefResolver } from "fastify-zod";
import userRoutes from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";
import { version } from "../package.json";
import path from "path";

declare module "fastify" {
  interface FastifyRequest {
    // @ts-ignore
    jwt: JWT;
  }
  
  export interface FastifyInstance {
    authenticate: any;
  }
}

declare module "fastify-jwt" {
  interface FastifyJWT {
    user: {
      id: number;
      email: string;
      name: string | null;
      role: string; 
    };
  }
}

function buildServer() {
  const server = Fastify();

  server.register(fjwt, {
    secret: process.env.SECRET,
  });

  server.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (e) {
        return reply.send(e);
      }
    }
  );

  server.addHook("preHandler", (req, reply, next) => {
    req.jwt = server.jwt;
    return next();
  });

  for (const schema of [...userSchemas]) {
    server.addSchema(schema);
  }

  server.register(require('fastify-static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/static/' 
  });

  server.register(
    swagger,
    withRefResolver({
      routePrefix: "/docs",
      exposeRoute: true,
      staticCSP: true,
      openapi: {
        info: {
          title: "User Management",
          description: "API for some User Management",
          version,
        },
      },
    })
  );

  server.register(userRoutes, { prefix: "api/users" });

  return server;
}

export default buildServer;
