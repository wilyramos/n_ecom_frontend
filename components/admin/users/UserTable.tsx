// File: frontend/components/admin/users/UserTable.tsx

"use client";

import { useTransition, useState } from "react";
import { User, UserRole } from "@/src/schemas/user.schema";
import { softDeleteUserAction, updateUserRoleAction, adminUpdateUserAction } from "@/actions/users-actions";
import { TipoDocumentoSchema } from "@/src/schemas/user.schema";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Muted } from "@/components/ui/Typography";
import { Trash2, ShieldAlert, MoreHorizontal, Shield, User as UserIcon, Briefcase, Pencil } from "lucide-react";

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {
  const [isPending, startTransition] = useTransition();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleRoleChange = (userId: string, newRole: string, currentRole: UserRole) => {
    if (newRole === currentRole) return;

    const toastId = toast.loading("Actualizando rol del usuario...");
    startTransition(async () => {
      const formData = new FormData();
      formData.append("rol", newRole);

      const response = await updateUserRoleAction(userId, { success: false }, formData);
      if (response.success) {
        toast.success("Rol actualizado correctamente", { id: toastId });
      } else {
        toast.error(response.error || "No se pudo actualizar el rol", { id: toastId });
      }
    });
  };

  const triggerDeleteDialog = (userId: string) => {
    setDeleteUserId(userId);
    setIsDeleteDialogOpen(true);
  };

  const confirmSoftDelete = () => {
    if (!deleteUserId) return;

    const toastId = toast.loading("Procesando baja del usuario...");
    startTransition(async () => {
      const response = await softDeleteUserAction(deleteUserId, { success: false });
      if (response.success) {
        toast.success("Usuario dado de baja correctamente", { id: toastId });
        setIsDeleteDialogOpen(false);
      } else {
        toast.error(response.error || "Error al procesar la baja", { id: toastId });
      }
      setDeleteUserId(null);
    });
  };

  const triggerEditDialog = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingUser) return;

    const formData = new FormData(event.currentTarget);
    const toastId = toast.loading("Guardando cambios del usuario...");

    startTransition(async () => {
      // 2. Reemplazar la acción anterior por la nueva, enviando el ID del usuario seleccionado
      const response = await adminUpdateUserAction(editingUser._id, { success: false }, formData);

      if (response.success) {
        toast.success("Datos de usuario actualizados correctamente", { id: toastId });
        setIsEditDialogOpen(false);
        setEditingUser(null);
      } else {
        toast.error(response.error || "Ocurrió un error al actualizar los datos", { id: toastId });
      }
    });
  };

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 border border-border rounded-[var(--radius-lg)] bg-card">
        <ShieldAlert className="h-10 w-10 text-muted-foreground mb-2" />
        <Muted className="font-bold text-center">
          No se encontraron usuarios activos que coincidan con los filtros.
        </Muted>
      </div>
    );
  }

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "administrador":
        return <Badge className="bg-primary text-primary-foreground border-transparent rounded-[var(--radius-sm)] capitalize gap-1"><Shield className="w-3 h-3" /> {role}</Badge>;
      case "vendedor":
        return <Badge className="bg-secondary text-secondary-foreground border-transparent rounded-[var(--radius-sm)] capitalize gap-1"><Briefcase className="w-3 h-3" /> {role}</Badge>;
      case "colaborador":
        return <Badge className="bg-green-100 text-green-800 border-transparent rounded-[var(--radius-sm)] capitalize gap-1"><UserIcon className="w-3 h-3" /> {role}</Badge>;
      default:
        return <Badge variant="outline" className="rounded-[var(--radius-sm)] capitalize gap-1"><UserIcon className="w-3 h-3" /> {role}</Badge>;
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuario / Correo</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Rol Actual</TableHead>
            <TableHead className="w-[60px] text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id} className={isPending ? "opacity-50 pointer-events-none" : ""}>

              <TableCell className="font-bold">
                <div className="flex flex-col">
                  <span>
                    {user.nombre} {user.apellidos || ""}
                  </span>
                  <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
                </div>
              </TableCell>

              <TableCell>
                {user.tipoDocumento && user.numeroDocumento ? (
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="text-[10px] font-bold px-1.5 py-0 rounded-[var(--radius-sm)]">
                      {user.tipoDocumento}
                    </Badge>
                    <span className="text-sm font-semibold text-muted-foreground">{user.numeroDocumento}</span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground font-normal italic">No registrado</span>
                )}
              </TableCell>

              <TableCell className="font-semibold text-muted-foreground">
                {user.telefono || <span className="text-xs font-normal italic">—</span>}
              </TableCell>

              <TableCell>{getRoleBadge(user.rol)}</TableCell>

              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[180px]">

                    <button
                      onClick={() => triggerEditDialog(user)}
                      className="w-full text-left px-2 py-1.5 text-sm rounded-[var(--radius-sm)] hover:bg-background-secondary text-foreground flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Editar Datos
                    </button>

                    <DropdownMenuSeparator />

                    <div className="text-[10px] font-bold text-muted-foreground px-2 py-1.5 uppercase tracking-wider select-none">
                      Cambiar Rol
                    </div>

                    <DropdownMenuRadioGroup
                      value={user.rol}
                      onValueChange={(value) => handleRoleChange(user._id, value, user.rol)}
                    >
                      <DropdownMenuRadioItem value="cliente" className="text-sm cursor-pointer rounded-[var(--radius-sm)]">
                        Cliente
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="vendedor" className="text-sm cursor-pointer rounded-[var(--radius-sm)]">
                        Vendedor
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="administrador" className="text-sm cursor-pointer rounded-[var(--radius-sm)]">
                        Administrador
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="colaborador" className="text-sm cursor-pointer rounded-[var(--radius-sm)]">
                        Colaborador
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>

                    <DropdownMenuSeparator />

                    <button
                      onClick={() => triggerDeleteDialog(user._id)}
                      className="w-full text-left px-2 py-1.5 text-sm rounded-[var(--radius-sm)] text-destructive hover:bg-background-secondary flex items-center gap-2 font-bold transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Dar de baja
                    </button>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ── MODAL: EDICIÓN DE USUARIO ──────────────────────────────────────── */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Datos de Usuario</DialogTitle>
            <DialogDescription>
              Modifique la información básica del perfil del usuario seleccionado.
            </DialogDescription>
          </DialogHeader>

          {editingUser && (
            <form onSubmit={handleEditSubmit} className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-nombre">Nombre *</Label>
                  <Input
                    id="edit-nombre"
                    name="nombre"
                    defaultValue={editingUser.nombre}
                    required
                    disabled={isPending}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-apellidos">Apellidos</Label>
                  <Input
                    id="edit-apellidos"
                    name="apellidos"
                    defaultValue={editingUser.apellidos || ""}
                    disabled={isPending}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-email">Correo Electrónico (Solo Lectura)</Label>
                <Input
                  id="edit-email"
                  type="email"
                  defaultValue={editingUser.email}
                  disabled
                  className="bg-muted-neutral text-muted-neutral-foreground cursor-not-allowed select-none border-border"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-telefono">Teléfono</Label>
                <Input
                  id="edit-telefono"
                  name="telefono"
                  type="tel"
                  defaultValue={editingUser.telefono || ""}
                  disabled={isPending}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-tipoDocumento">Tipo Documento</Label>
                  <Select name="tipoDocumento" defaultValue={editingUser.tipoDocumento || undefined} disabled={isPending}>
                    <SelectTrigger id="edit-tipoDocumento">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {TipoDocumentoSchema.options.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-numeroDocumento">Número Documento</Label>
                  <Input
                    id="edit-numeroDocumento"
                    name="numeroDocumento"
                    defaultValue={editingUser.numeroDocumento || ""}
                    disabled={isPending}
                  />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingUser(null);
                  }}
                  disabled={isPending}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isPending} className="bg-action-cta hover:bg-action-cta-hover text-action-cta-foreground font-bold">
                  {isPending ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ── MODAL: SOFT DELETE ──────────────────────────────────────────────── */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[450px]" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>¿Está absolutamente seguro?</DialogTitle>
            <DialogDescription>
              Esta acción dará de baja al usuario en el sistema de manera lógica. No se eliminarán sus registros históricos o transaccionales, pero el usuario no podrá iniciar sesión de forma activa.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeleteUserId(null);
              }}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={confirmSoftDelete}
              disabled={isPending}
              className="bg-destructive hover:bg-destructivered text-destructive-foreground font-bold"
            >
              Confirmar Baja
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}