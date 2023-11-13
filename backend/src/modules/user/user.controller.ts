import { FastifyReply, FastifyRequest } from "fastify";
import { verifyPassword } from "../../utils/hash";
import { CreateUserInput, UpdateUserBody, LoginInput } from "./user.schema";
import { createUser, updateUser, findUserByEmail, findUsers, deleteUser, exportUsersToExcel } from "./user.service";

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {

  const body = request.body;
  
  try {
    if (request.user.roles === 'admin') {
      const user = await createUser(body);

      if (user === 409) reply.code(user).send({ message: 'Conflict' });
      if (user === 404) reply.code(user).send({ message: 'Not Found' });

      return reply.code(201).send(user);
    }
    return reply.code(404).send({ message: 'You do not have the necessary permissions' });
  } catch (e) {
    console.log(e);
    return reply.code(500).send(e);
  }
}

export async function updateUserHandler(
  request: FastifyRequest<{
    Body: UpdateUserBody;
    Params: { id: number }; 
  }>,
  reply: FastifyReply
) {
  const { name, email } = request.body;
  const { id } = request.params;

  try {
    const user = await updateUser(Number(id), { name, email }, request.user.id);

    if (user === 404) reply.code(user).send({ message: 'Not Found' });

    return reply.code(201).send(user);
  } catch (e) {
    console.log(e);
    return reply.code(500).send(e);
  }
}

export async function deleteUserHandler(
  request: FastifyRequest<{
    Params: { id: number }; 
  }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  try {
    const user = await deleteUser(Number(id), request.user.id);

    if (user === 404) reply.code(user).send({ message: 'Not Found' });

    return reply.code(201).send(user);
  } catch (e) {
    console.log(e);
    return reply.code(500).send(e);
  }
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;

  const user = await findUserByEmail(body.email);

  if (!user) {
    return reply.code(401).send({
      message: "Invalid email or password",
    });
  }

  const correctPassword = verifyPassword({
    candidatePassword: body.password,
    salt: user.salt,
    hash: user.password,
  });

  if (correctPassword) {
    const { password, salt, ...rest } = user;

    return {
      accessToken: request.jwt.sign(rest),
      user: user
    };
  }

  return reply.code(401).send({
    message: "Invalid email or password",
  });
}

export async function getUsersHandler() {
  const users = await findUsers();

  return users;
}

export async function getUserHandler( request: FastifyRequest<{
  Params: { email: string }; 
}>) {
  const { email } = request.params; 
  const user = await findUserByEmail(email);

  return user;
}

export async function getExportExcelHandler() {
  const excel = await exportUsersToExcel();

  return excel;
}

