"use client";

// File: frontend/components/claim/claimform.tsx

import { useActionState } from "react";
import { submitClaimAction, type ActionResult } from "@/actions/claim-action";
import { FiCheckCircle, FiAlertTriangle, FiInfo, FiLoader } from "react-icons/fi";

const initialState: ActionResult<{ correlativo: string; createdAt: string }> | null = null;

// ── Helper ─────────────────────────────────────────────────────────────────────

function FieldError({ errors }: { errors?: string[] }) {
    if (!errors?.length) return null;
    return <p className="mt-1 text-xs text-destructive">{errors[0]}</p>;
}

function inputClass(hasError: boolean) {
    return [
        "w-full border rounded-md px-3 py-2 text-sm transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "bg-background text-foreground",
        hasError 
            ? "border-destructive bg-destructive/5 text-destructive" 
            : "border-border",
    ].join(" ");
}

// ── Componente ─────────────────────────────────────────────────────────────────

export default function ClaimForm() {
    const [state, action, isPending] = useActionState(submitClaimAction, initialState);

    // Éxito: mostrar confirmación en lugar del formulario
    if (state?.success) {
        return (
            <div className="bg-accent-vivid-muted border border-accent-vivid/30 rounded-lg p-8 text-center space-y-3">
                <div className="flex justify-center text-4xl text-accent-vivid">
                    <FiCheckCircle />
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                    Reclamación registrada
                </h2>
                <p className="text-muted-foreground text-sm">
                    Tu reclamo ha sido registrado exitosamente.
                </p>
                <p className="text-sm text-foreground">
                    Número de correlativo:{" "}
                    <strong className="font-mono text-primary">
                        {state.data.correlativo}
                    </strong>
                </p>
                <p className="text-xs text-muted-foreground">
                    Guarda este número para hacer seguimiento de tu reclamo.
                    La respuesta será enviada a tu correo electrónico.
                </p>
            </div>
        );
    }

    const fe = state?.success === false ? (state.fieldErrors ?? {}) : {};

    return (
        <form action={action} className="space-y-6">

            {/* Error general del servidor */}
            {state?.success === false && !state.fieldErrors && (
                <div className="bg-destructive/10 border border-destructive text-destructive text-sm px-4 py-3 rounded-md flex items-center gap-2">
                    <FiAlertTriangle className="shrink-0" />
                    <span>{state.error}</span>
                </div>
            )}

            {/* ── Sección 1: Consumidor ──────────────────────────────────────── */}
            <section className="bg-muted/40 p-6 rounded-lg border border-border space-y-4">
                <h2 className="text-xl font-semibold border-b border-border pb-2 text-foreground">
                    1. Identificación del Consumidor
                </h2> 

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="md:col-span-2">
                        <label htmlFor="nombres" className="block text-sm font-medium text-foreground mb-1">
                            Nombre y Apellidos <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="text"
                            id="nombres"
                            name="nombres"
                            autoComplete="name"
                            disabled={isPending}
                            className={inputClass(!!fe.nombres)}
                        />
                        <FieldError errors={fe.nombres} />
                    </div>

                    <div>
                        <label htmlFor="tipoDocumento" className="block text-sm font-medium text-foreground mb-1">
                            Tipo de documento <span className="text-destructive">*</span>
                        </label>
                        <select
                            id="tipoDocumento"
                            name="tipoDocumento"
                            disabled={isPending}
                            defaultValue=""
                            className={inputClass(!!fe.tipoDocumento)}
                        >
                            <option value="" disabled className="bg-background text-muted-foreground">Seleccione</option>
                            <option value="DNI" className="bg-background text-foreground">DNI</option>
                            <option value="CE" className="bg-background text-foreground">CE</option>
                            <option value="RUC" className="bg-background text-foreground">RUC</option>
                        </select>
                        <FieldError errors={fe.tipoDocumento} />
                    </div>

                    <div>
                        <label htmlFor="numeroDocumento" className="block text-sm font-medium text-foreground mb-1">
                            Número de documento <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="text"
                            id="numeroDocumento"
                            name="numeroDocumento"
                            disabled={isPending}
                            className={inputClass(!!fe.numeroDocumento)}
                        />
                        <FieldError errors={fe.numeroDocumento} />
                    </div>

                    <div>
                        <label htmlFor="celular" className="block text-sm font-medium text-foreground mb-1">
                            Celular <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="tel"
                            id="celular"
                            name="celular"
                            autoComplete="tel"
                            disabled={isPending}
                            className={inputClass(!!fe.celular)}
                        />
                        <FieldError errors={fe.celular} />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                            Email <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="email"
                            disabled={isPending}
                            className={inputClass(!!fe.email)}
                        />
                        <FieldError errors={fe.email} />
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="direccion" className="block text-sm font-medium text-foreground mb-1">
                            Dirección <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="text"
                            id="direccion"
                            name="direccion"
                            autoComplete="street-address"
                            disabled={isPending}
                            className={inputClass(!!fe.direccion)}
                        />
                        <FieldError errors={fe.direccion} />
                    </div>

                    <div>
                        <label htmlFor="ciudad" className="block text-sm font-medium text-foreground mb-1">
                            Ciudad <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="text"
                            id="ciudad"
                            name="ciudad"
                            autoComplete="address-level2"
                            disabled={isPending}
                            className={inputClass(!!fe.ciudad)}
                        />
                        <FieldError errors={fe.ciudad} />
                    </div>

                    <div>
                        <label htmlFor="region" className="block text-sm font-medium text-foreground mb-1">
                            Región / Provincia <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="text"
                            id="region"
                            name="region"
                            autoComplete="address-level1"
                            disabled={isPending}
                            className={inputClass(!!fe.region)}
                        />
                        <FieldError errors={fe.region} />
                    </div>
                </div>
            </section>

            {/* ── Sección 2: Detalle ─────────────────────────────────────────── */}
            <section className="bg-muted/40 p-6 rounded-lg border border-border space-y-4">
                <h2 className="text-xl font-semibold border-b border-border pb-2 text-foreground">
                    2. Detalle de la Reclamación y Pedido del Consumidor
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        <span className="block text-sm font-medium text-foreground mb-2">
                            Tipo <span className="text-destructive">*</span>
                        </span>
                        <div className="flex space-x-6">
                            {(["Queja", "Reclamo"] as const).map((tipo) => (
                                <label key={tipo} className="flex items-center gap-2 cursor-pointer text-foreground select-none">
                                    <input
                                        type="radio"
                                        name="tipoReclamo"
                                        value={tipo}
                                        disabled={isPending}
                                        className="accent-ring size-4"
                                    />
                                    <span className="text-sm">{tipo}</span>
                                </label>
                            ))}
                        </div>
                        <FieldError errors={fe.tipoReclamo} />
                    </div>

                    <div>
                        <label htmlFor="fechaIncidencia" className="block text-sm font-medium text-foreground mb-1">
                            Fecha de incidencia <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="date"
                            id="fechaIncidencia"
                            name="fechaIncidencia"
                            disabled={isPending}
                            className={inputClass(!!fe.fechaIncidencia)}
                        />
                        <FieldError errors={fe.fechaIncidencia} />
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="detalle" className="block text-sm font-medium text-foreground mb-1">
                            Detalle <span className="text-destructive">*</span>
                        </label>
                        <textarea
                            id="detalle"
                            name="detalle"
                            rows={4}
                            disabled={isPending}
                            placeholder="Describe con detalle lo ocurrido (mínimo 20 caracteres)."
                            className={inputClass(!!fe.detalle)}
                        />
                        <FieldError errors={fe.detalle} />
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="pedido" className="block text-sm font-medium text-foreground mb-1">
                            Pedido — ¿Qué solicitas? <span className="text-destructive">*</span>
                        </label>
                        <textarea
                            id="pedido"
                            name="pedido"
                            rows={3}
                            disabled={isPending}
                            placeholder="Indica qué solución o acción esperas de nuestra parte."
                            className={inputClass(!!fe.pedido)}
                        />
                        <FieldError errors={fe.pedido} />
                    </div>
                </div>
            </section>

            {/* ── Aviso ──────────────────────────────────────────────────────── */}
            <div className="bg-accent-vivid-muted text-foreground border border-accent-vivid/20 p-4 rounded-md text-sm flex gap-2 items-start">
                <FiInfo className="shrink-0 text-accent-vivid mt-0.5 text-base" />
                <div>
                    <strong>Observación:</strong> La respuesta a este reclamo o queja será enviada
                    al correo electrónico indicado en este formulario en un plazo máximo de{" "}
                    <strong>15 días hábiles</strong>.
                </div>
            </div>

            {/* ── Errores de validación del formulario ───────────────────────── */}
            {state?.success === false && state.fieldErrors && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                    <FiAlertTriangle className="shrink-0" />
                    <p>{state.error}</p>
                </div>
            )}

            {/* ── Submit ─────────────────────────────────────────────────────── */}
            <button
                type="submit"
                disabled={isPending}
                className="w-full md:w-auto bg-primary text-primary-foreground font-medium py-3 px-8 rounded-md
                           hover:bg-action-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2"
            >
                {isPending ? (
                    <>
                        <FiLoader className="size-4 animate-spin" />
                        <span>Enviando…</span>
                    </>
                ) : (
                    "Enviar reclamación"
                )}
            </button>
        </form>
    );
}