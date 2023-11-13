const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");

const randomBytes = crypto.randomBytes;
const pbkdf2Sync = crypto.pbkdf2Sync;

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");

  const hash = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");

  return { hash, salt };
}

const admin = hashPassword("root");
const user = hashPassword("password");

async function seed() {
  await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: { name: "admin", label: "Admin" },
  });

  await prisma.role.upsert({
    where: { name: "user" },
    update: {},
    create: { name: "user", label: "User" },
  });

  const adminRole = await prisma.role.findFirst({
    where: {
      name: "admin",
    },
  });

  const userRole = await prisma.role.findFirst({
    where: {
      name: "user",
    },
  });

  if (!adminRole || !userRole) {
    console.error("Alguno de los roles no se encontró en la base de datos.");
    return;
  }

  await prisma.user.create({
    data: {
      email: "administrador@example.com",
      name: "Administrador",
      password: admin.hash,
      salt: admin.salt,
      roles: {
        create: [
          {
            role: {
              connect: {
                id: adminRole.id,
              },
            },
          },
        ],
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "usuario@example.com",
      name: "Usuario",
      password: user.hash,
      salt: user.salt,
      roles: {
        create: [
          {
            role: {
              connect: {
                id: userRole.id,
              },
            },
          },
        ],
      },
    },
  });
}

seed()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
