//File: frontend/src/schemas/user.schema.ts

import { z } from "zod";

// ── Enums ─────────────────────────────────────────────────────────────────────

export const UserRoleSchema = z.enum(['cliente', 'administrador', 'vendedor']);
export const TipoDocumentoSchema = z.enum(['DNI', 'RUC', 'CE']);

export type UserRole = z.infer<typeof UserRoleSchema>;
export type TipoDocumento = z.infer<typeof TipoDocumentoSchema>;

// ── Modelo base (refleja el documento de MongoDB) ─────────────────────────────

export const UserSchema = z.object({
    _id: z.string(),
    nombre: z.string(),
    apellidos: z.string().optional(),
    tipoDocumento: TipoDocumentoSchema.optional(),
    numeroDocumento: z.string().optional(),
    email: z.string().email(),
    telefono: z.string().optional(),
    rol: UserRoleSchema,
    googleId: z.string().optional(),
    isActive: z.boolean(),
    deletedAt: z.string().nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type User = z.infer<typeof UserSchema>;

// ── Respuestas de la API ───────────────────────────────────────────────────────

export const PaginatedUsersResponseSchema = z.object({
    totalUsers: z.number(), // CORREGIDO: Emparejado con el backend (totalUsers)
    currentPage: z.number(),
    totalPages: z.number(),
    users: z.array(UserSchema),
});

export type PaginatedUsersResponse = z.infer<typeof PaginatedUsersResponseSchema>;

export const UserResponseSchema = z.object({
    user: UserSchema,
});

export type UserResponse = z.infer<typeof UserResponseSchema>;

// ── Formulario: Registro público ──────────────────────────────────────────────

export const RegisterFormSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido'),
    email: z.string().email('Correo electrónico inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type RegisterFormData = z.infer<typeof RegisterFormSchema>;

// ── Formulario: Login ─────────────────────────────────────────────────────────

export const LoginFormSchema = z.object({
    email: z.string().email('Correo electrónico inválido'),
    password: z.string().min(1, 'La contraseña es requerida'),
});

export type LoginFormData = z.infer<typeof LoginFormSchema>;

// ── Formulario: Actualizar perfil propio ──────────────────────────────────────

export const UpdateProfileFormSchema = z.object({
    // MEJORA: .or(z.literal('')) evita que falle si el input queda vacío en la UI
    nombre: z.string().min(1, 'El nombre no puede quedar vacío'),
    apellidos: z.string().optional().or(z.literal('')),
    telefono: z.string().optional().or(z.literal('')),
    tipoDocumento: TipoDocumentoSchema.optional(),
    numeroDocumento: z.string().optional().or(z.literal('')),
});

export type UpdateProfileFormData = z.infer<typeof UpdateProfileFormSchema>;

// ── Formulario: Crear cliente (staff) ─────────────────────────────────────────

export const CreateClientFormSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido'),
    apellidos: z.string().optional().or(z.literal('')),
    email: z.string().email('Correo electrónico inválido'),
    telefono: z.string().optional().or(z.literal('')),
    tipoDocumento: TipoDocumentoSchema.optional(),
    numeroDocumento: z.string().optional().or(z.literal('')),
});

export type CreateClientFormData = z.infer<typeof CreateClientFormSchema>;

// ── Formulario: Cambiar rol (admin) ───────────────────────────────────────────

export const UpdateRoleFormSchema = z.object({
    rol: UserRoleSchema,
});

export type UpdateRoleFormData = z.infer<typeof UpdateRoleFormSchema>;

// ── Formulario: Cambiar contraseña (admin sobre otro usuario) ─────────────────

export const UpdatePasswordFormSchema = z.object({
    currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
    password:        z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Debe confirmar su nueva contraseña'),
}).refine(
    (data) => data.password === data.confirmPassword,
    { 
        message: 'Las nuevas contraseñas no coinciden', 
        path: ['confirmPassword'] 
    }
);

export type UpdatePasswordFormData = z.infer<typeof UpdatePasswordFormSchema>;
// ── Formulario: Olvidé mi contraseña ─────────────────────────────────────────

export const ForgotPasswordFormSchema = z.object({
    email: z.string().email('Correo electrónico inválido'),
});

export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordFormSchema>;

// ── Formulario: Restablecer contraseña con token ──────────────────────────────

export const ResetPasswordFormSchema = z.object({
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
}).refine(
    (data) => data.password === data.confirmPassword,
    { message: 'Las contraseñas no coinciden', path: ['confirmPassword'] }
);

export type ResetPasswordFormData = z.infer<typeof ResetPasswordFormSchema>;

// ── Params de query para listados ─────────────────────────────────────────────

export const UsersQuerySchema = z.object({
    page: z.number().int().min(1).optional().default(1),
    limit: z.number().int().min(1).max(100).optional().default(25),
    nombre: z.string().optional(),
    email: z.string().optional(),
    telefono: z.string().optional(),
    numeroDocumento: z.string().optional(),
});

export type UsersQuery = z.infer<typeof UsersQuerySchema>;

// ── Auth: respuesta de login / register ───────────────────────────────────────

export const AuthResponseSchema = z.object({
    message: z.string(),
    userId: z.string(),
    token: z.string(),
    role: UserRoleSchema,
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;