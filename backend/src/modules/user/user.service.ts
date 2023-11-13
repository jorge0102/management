import { Prisma } from "@prisma/client";
import { hashPassword } from "../../utils/hash";
import prisma from "../../utils/prisma";
import { CreateUserInput, UpdateUserInput } from "./user.schema";
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import * as fs from 'fs';

export async function createUser(input: CreateUserInput) {
  const { password, role, ...rest } = input;

  const { hash, salt } = hashPassword(password);

  const existingRole = await prisma.role.findUnique({
    where: { name: role },
  });

  if (!existingRole) {
    throw new Error(`The role "${role}" is invalid.`);
  }

  try {
    const user = await prisma.user.create({
      data: {
        ...rest,
        salt,
        password: hash,
        roles: {
          create: [
            {
              role: {
                connect: {
                  name: role,
                },
              },
            },
          ],
        },
      },
    });

    return user;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return 409;
    } else {
      return 404;
    }
  }
}

export async function updateUser(id: number, input: UpdateUserInput, userId: number) {

  try {

    const userAuthenticate = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (id !== userId && userAuthenticate?.roles[0].role.name === 'admin' ||
      id === userId && userAuthenticate?.roles[0].role.name === 'user') {
      const existingUser = await prisma.user.findUnique({
        where: { id: id },
      });

      if (!existingUser) {
        throw new Error(`The user with ID ${id} does not exist.`);
      }

      if (existingUser.deletedAt !== null) {
        throw new Error('The user is marked as deleted');
      }

      const updatedUser = await prisma.user.update({
        where: { id: id },
        data: input,
      });

      return updatedUser;
    }

    return 404;
  } catch (error) {
    console.error('Error updating the user:', error);
    return 404;
  }
}

export async function deleteUser(id: number, userId: number) {
  try {
    const userAuthenticate = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (id !== userId && userAuthenticate?.roles[0].role.name === 'admin' || 
    id === userId && userAuthenticate?.roles[0].role.name === 'user') {
      const existingUser = await prisma.user.findUnique({
        where: { id: id },
      });

      if (!existingUser) {
        throw new Error(`The user with ID ${id} does not exist.`);
      }

      if (existingUser.deletedAt !== null) {
        throw new Error('The user is marked as deleted');
      }

      const userWithDeletedFlag = {
        ...existingUser,
        deletedAt: new Date(),
      };

      const deleteUser = await prisma.user.update({
        where: { id: id },
        data: userWithDeletedFlag,
      });

      return deleteUser;
    }

    return 404;
  } catch (error) {
    console.error('Error deleting the user:', error);
    return 404;
  }
}

export async function findUserByEmail(email: string) {
  const userWithRoles = await prisma.user.findUnique({
    where: { email },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (userWithRoles?.deletedAt !== null) {
    throw new Error('The user is marked as deleted');
  }

  const roles = userWithRoles?.roles.map((userOnRole) => userOnRole.role);

  return {
    id: userWithRoles?.id,
    name: userWithRoles?.name,
    email: userWithRoles?.email,
    salt: userWithRoles?.salt,
    password: userWithRoles?.password,
    roles: roles[0].name,
  };
}

export async function findUsers() {
  return prisma.user.findMany({
    where: {
      deletedAt: null,
    },
    select: {
      email: true,
      name: true,
      id: true,
    },
  });
}

export async function exportUsersToExcel() {
  const users = await prisma.user.findMany();

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Users');

  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Name', key: 'name', width: 20 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Create', key: 'createdAt', width: 30 },
    { header: 'Update', key: 'updatedAt', width: 30 },
    { header: 'Delete', key: 'deletedAt', width: 30 },
  ];

  users.forEach((user) => {
    worksheet.addRow({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    });
  });

  const filename = `users_${Date.now()}.xlsx`;

  const directory = path.join(__dirname, '../../public/exports');

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }

  const filePath = path.join(directory, filename);

  await workbook.xlsx.writeFile(filePath);

  const fileUrl = `${process.env.BASE_URL}/static/exports/${filename}`;

  return {fileUrl};
}
