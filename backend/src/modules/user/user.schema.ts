import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const userCore = {
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  name: z.string(),
  role: z.string().optional(),
};

const userCoreUpdate = {
  email: z
    .string({
      invalid_type_error: "Email must be a string",
    })
    .email(),
  name: z.string(),
};

const createUserSchema = z.object({
  ...userCore,
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  }),
});

const createUserResponseSchema = z.object({
  id: z.number(),
  ...userCore,
});

const updateUserSchema = z.object({
  ...userCoreUpdate
});

const updateUserBodySchema = z.object({
  ...userCoreUpdate
});

const updateUserResponseSchema = z.object({
  ...userCoreUpdate,
});

const userSchema  = z.object({
  id: z.number(),
  email: z
  .string({
    invalid_type_error: "Email must be a string",
  })
  .email(),
  name: z.string(),
  roles: z.string().optional(),
});

const deleteUserResponseSchema = z.object({
  id: z.number(),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  name: z.string(),
});

const excelUserSchema = z.object({
  id: z.number(),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  name: z.string(),
});

const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  password: z.string(),
});

const loginResponseSchema = z.object({
  accessToken: z.string(),
  user: userSchema 
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export type UpdateUserInput = z.infer<typeof updateUserBodySchema>;

export type UpdateUserBody = z.infer<typeof updateUserSchema>;

export type LoginInput = z.infer<typeof loginSchema>;

export type ExcelUserSchema = z.infer<typeof excelUserSchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  createUserSchema,
  createUserResponseSchema,
  updateUserSchema,
  updateUserResponseSchema,
  loginSchema,
  loginResponseSchema,
  deleteUserResponseSchema,
  excelUserSchema
});
