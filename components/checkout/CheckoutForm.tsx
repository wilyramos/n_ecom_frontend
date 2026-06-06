// File: frontend/components/checkout/CheckoutForm.tsx
'use client'

import { useState, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { useCheckoutStore, type CheckoutData } from '@/src/store/checkoutStore'
import { useCartStore } from '@/src/store/cartStore'
import { createOrderAction } from '@/actions/order/create-order-action'
import { processPaymentCulqi } from '@/actions/checkout/process-culqi-payment'
import { locations } from '@/src/data/locations'
import ErrorMessage from '../ui/ErrorMessage'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, User as UserIcon, MapPin, Truck, Store } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { TCreateOrder, User, TOrder } from '@/src/schemas'
import { CulqiModal, type CulqiModalRef, type CulqiInstance } from './CulqiModal'

type Props = {
    user?: User | null
}

type ShippingMode = "delivery" | "pickup";

export default function CheckoutForm({ user }: Props) {
    const router = useRouter()
    const { setData } = useCheckoutStore()
    const { cart } = useCartStore()
    const [loading, setLoading] = useState(false)
    const [shippingMode, setShippingMode] = useState<ShippingMode>("delivery")
    const store = useCheckoutStore()

    const [activeOrder, setActiveOrder] = useState<(TOrder & { culqiOrderId?: string }) | null>(null)
    const culqiModalRef = useRef<CulqiModalRef>(null)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        trigger,
        control,
        clearErrors,
        formState: { errors, isValid },
    } = useForm<CheckoutData>({
        mode: 'onChange',
        defaultValues: {
            email: user?.email || store.data?.email || '',
            nombre: user?.nombre || store.data?.nombre || '',
            apellidos: user?.apellidos || store.data?.apellidos || '',
            tipoDocumento: user?.tipoDocumento || store.data?.tipoDocumento || 'DNI',
            numeroDocumento: user?.numeroDocumento || store.data?.numeroDocumento || '',
            telefono: user?.telefono || store.data?.telefono || '',
            departamento: store.data?.departamento || '',
            provincia: store.data?.provincia || '',
            distrito: store.data?.distrito || '',
            direccion: store.data?.direccion || '',
            numero: store.data?.numero || '',
            pisoDpto: store.data?.pisoDpto || '',
            referencia: store.data?.referencia || '',
        },
    })

    const selectedDepartamento = watch('departamento')
    const selectedProvincia = watch('provincia')

    const provincias = useMemo(() => {
        if (!selectedDepartamento || !locations[selectedDepartamento]) return []
        return Object.keys(locations[selectedDepartamento])
    }, [selectedDepartamento])

    const distritos = useMemo(() => {
        if (!selectedDepartamento || !selectedProvincia || !locations[selectedDepartamento]?.[selectedProvincia]) {
            return []
        }
        return locations[selectedDepartamento][selectedProvincia]
    }, [selectedDepartamento, selectedProvincia])

    const handleTabChange = (value: string) => {
        const mode = value as ShippingMode;
        setShippingMode(mode);

        if (mode === "pickup") {
            setValue('departamento', 'Lima');
            setValue('provincia', 'Lima');
            setValue('distrito', 'Santiago de Surco');
            setValue('direccion', 'Av caminos del inca');
            setValue('numero', '257');
            setValue('pisoDpto', '3');
            setValue('referencia', 'Tda 326');
            clearErrors(['departamento', 'provincia', 'distrito', 'direccion', 'referencia']);
        } else {
            setValue('departamento', '');
            setValue('provincia', '');
            setValue('distrito', '');
            setValue('direccion', '');
            setValue('numero', '');
            setValue('pisoDpto', '');
            setValue('referencia', '');
        }
        trigger();
    };

    const onSubmit = async (data: CheckoutData) => {
        // console.log("📝 [CheckoutForm] Iniciando creación de orden...");
        setLoading(true)
        setData(data)

        // Reset dinámico de estados residuales previos del DOM
        setActiveOrder(null);
        const oldIframe = document.getElementById("culqi_checkout_iframe");
        if (oldIframe) oldIframe.remove();
        const oldContainer = document.querySelector(".culqi-checkout-container");
        if (oldContainer) oldContainer.remove();

        const subtotal = cart.reduce((t, i) => t + i.precio * i.cantidad, 0)
        const shippingCost = 0
        const totalPrice = subtotal + shippingCost

        const payload: TCreateOrder = {
            items: cart.map(item => ({
                productId: item._id,
                quantity: item.cantidad,
                price: item.precio,
                variantId: item.variant?._id,
                variantAttributes: item.variant?.atributos || {},
                nombre: item.nombre,
                imagen: item.imagenes?.[0],
            })),
            subtotal,
            shippingCost,
            totalPrice,
            currency: 'PEN',
            shippingAddress: {
                departamento: data.departamento,
                provincia: data.provincia,
                distrito: data.distrito,
                direccion: data.direccion,
                numero: data.numero,
                pisoDpto: data.pisoDpto,
                referencia: data.referencia,
            },
            payment: { provider: 'culqi', status: 'pending' },
            customerProfile: {
                nombre: data.nombre,
                apellidos: data.apellidos,
                email: data.email,
                telefono: data.telefono,
                tipoDocumento: data.tipoDocumento,
                numeroDocumento: data.numeroDocumento,
            }
        }

        const result = await createOrderAction(payload)

        if (!result.ok) {
            // console.error("❌ [CheckoutForm] Error en createOrderAction:", result.message);
            toast.error(result.message)
            setLoading(false)
            return
        }

        // console.log("✅ [CheckoutForm] Orden generada en DB. Culqi ID recibido:", result.culqiOrderId);
        localStorage.setItem("currentOrderId", result.order._id)

        const completeOrder = {
            ...result.order,
            culqiOrderId: result.culqiOrderId
        };

        setActiveOrder(completeOrder);

        // Desplegar pasarela JIT tras hidratación estatal
        setTimeout(() => {
            if (culqiModalRef.current) {
                console.log("🚀 [CheckoutForm] Abriendo modal CulqiCheckout...");
                culqiModalRef.current.open();
            } else {
                console.error("⚠️ [CheckoutForm] La referencia culqiModalRef no está montada.");
            }
            setLoading(false);
        }, 500);
    }

    const handleCulqiPaymentCaptured = async (culqiInstance: CulqiInstance) => {
        if (culqiInstance.error) {
            console.error("❌ [CheckoutForm] Error desde el SDK de Culqi:", culqiInstance.error);
            toast.error(culqiInstance.error.user_message);
            return;
        }

        if (!activeOrder) return;

        const amount = Math.round(activeOrder.totalPrice * 100);
        const orderId = String(activeOrder._id);
        const orderNumber = activeOrder.orderNumber;
        const userEmail = activeOrder.customerProfile?.email;

        try {
            if (culqiInstance.token) {
                // 💳 FLUJO SÍNCRONO: Tarjetas / Yape Directo (Requiere cargo backend)
                console.log("💳 [CheckoutForm] Token de tarjeta capturado. Enviando cargo...");
                await processPaymentCulqi({
                    token: culqiInstance.token.id,
                    email: culqiInstance.token.email || userEmail,
                    amount,
                    orderId,
                });
                culqiInstance.close();
                router.push(`/checkout-result/verifying?orderNumber=${orderNumber}`);
            } else if (culqiInstance.order) {
                // 🏦 FLUJO ASÍNCRONO: PagoEfectivo / Banca Móvil / QR / Agentes
                // Se detiene el flujo aquí. El propio SDK de Culqi confirma y renderiza el CIP/QR nativamente.
                console.log("🏦 [CheckoutForm] Objeto orden asíncrono capturado. El SDK asume el renderizado nativo del CIP/QR.");
                toast.success("Código CIP / QR generado de manera exitosa en la ventana.");

                // Redirigir de manera diferida o esperar a que el usuario visualice su código en el modal
                setTimeout(() => {
                    router.push(`/checkout-result/verifying?orderNumber=${orderNumber}`);
                }, 4000);
            }
        } catch (err) {
            console.error("❌ [CheckoutForm] Error en proceso de captura:", err);
            toast.error(err instanceof Error ? err.message : "Error procesando el pago.");
        }
    }

    return (
        <>
            {activeOrder && (
                <CulqiModal
                    ref={culqiModalRef}
                    order={activeOrder}
                    onPaymentCaptured={handleCulqiPaymentCaptured}
                    onError={(err) => toast.error(err)}
                />
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-foreground">
                <Tabs defaultValue="delivery" value={shippingMode} onValueChange={handleTabChange} className="w-full">
                    <TabsList className="grid grid-cols-2 w-full border-border-default h-12 rounded-2xl">
                        <TabsTrigger value="delivery">
                            <Truck size={14} /> Envío a domicilio
                        </TabsTrigger>
                        <TabsTrigger value="pickup">
                            <Store size={14} /> Retiro en tienda
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Contacto e Identificación */}
                <div className="p-4 rounded-2xl border border-border-default bg-surface-primary space-y-2">
                    <div className="flex items-center gap-2 border-b border-border-default pb-2">
                        <UserIcon size={16} className="text-fg-muted" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-fg-primary">
                            Contacto e Identificación
                        </h3>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label required={!user} className="text-xs">
                            {user ? 'Cuenta de usuario' : 'Correo electrónico'}
                        </Label>
                        <Input
                            {...register('email', {
                                required: "El correo electrónico es obligatorio",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Ingresa un formato de correo válido"
                                }
                            })}
                            disabled={!!user}
                            className={cn(
                                "border-border-default focus:ring-brand-charcoal",
                                user && " bg-surface-primary text-fg-primary",
                                errors.email && "border-destructive focus:ring-destructive"
                            )}
                            placeholder={!user ? "tu@email.com" : undefined}
                        />
                        <div className="min-h-[16px]">
                            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <Label required className="text-xs">Nombre</Label>
                            <Input
                                {...register('nombre', { required: "El nombre es obligatorio" })}
                                placeholder="Tu nombre"
                                className={cn("border-border-default", errors.nombre && "border-destructive")}
                            />
                            <div className="min-h-[16px]">
                                {errors.nombre && <ErrorMessage>{errors.nombre.message}</ErrorMessage>}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label required className="text-xs">Apellidos</Label>
                            <Input
                                {...register('apellidos', { required: "Los apellidos son obligatorios" })}
                                placeholder="Tus apellidos"
                                className={cn("border-border-default", errors.apellidos && "border-destructive")}
                            />
                            <div className="min-h-[16px]">
                                {errors.apellidos && <ErrorMessage>{errors.apellidos.message}</ErrorMessage>}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="flex flex-col gap-1.5 sm:col-span-3">
                            <Label required className="text-xs">Tipo Doc.</Label>
                            <Controller
                                control={control}
                                name="tipoDocumento"
                                rules={{ required: "Requerido" }}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full border-border-default">
                                            <SelectValue placeholder="DNI" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DNI">DNI</SelectItem>
                                            <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                                            <SelectItem value="CE">Carnet de Ext.</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <div className="min-h-[16px]">
                                {errors.tipoDocumento && <ErrorMessage>{errors.tipoDocumento.message}</ErrorMessage>}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5 sm:col-span-4">
                            <Label required className="text-xs">N° Documento</Label>
                            <Input
                                {...register('numeroDocumento', {
                                    required: "El documento es obligatorio",
                                    minLength: { value: 8, message: "Mínimo 8 caracteres" }
                                })}
                                placeholder="00000000"
                                className={cn("border-border-default", errors.numeroDocumento && "border-destructive")}
                            />
                            <div className="min-h-[16px]">
                                {errors.numeroDocumento && <ErrorMessage>{errors.numeroDocumento.message}</ErrorMessage>}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5 sm:col-span-5">
                            <Label required className="text-xs">Teléfono / Móvil</Label>
                            <Input
                                {...register('telefono', {
                                    required: "El teléfono es obligatorio",
                                    pattern: { value: /^[0-9]{9}$/, message: "Debe tener 9 dígitos" }
                                })}
                                placeholder="999999999"
                                className={cn("border-border-default", errors.telefono && "border-destructive")}
                            />
                            <div className="min-h-[16px]">
                                {errors.telefono && <ErrorMessage>{errors.telefono.message}</ErrorMessage>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dirección o Tienda */}
                <div className="p-4 rounded-2xl border border-border-default bg-surface-primary space-y-2">
                    <div className="flex items-center gap-2 border-b border-border-default pb-2">
                        <MapPin size={16} className="text-fg-muted" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-fg-primary">
                            {shippingMode === "delivery" ? "Dirección de envío" : "Tienda de recojo"}
                        </h3>
                    </div>

                    {shippingMode === "delivery" ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <Label required className="text-xs">Departamento</Label>
                                    <Controller
                                        control={control}
                                        name="departamento"
                                        rules={{ required: "El departamento es obligatorio" }}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={(val) => {
                                                    field.onChange(val)
                                                    setValue('provincia', '')
                                                    setValue('distrito', '')
                                                    trigger(['departamento', 'provincia', 'distrito'])
                                                }}
                                                value={field.value || undefined}
                                            >
                                                <SelectTrigger className={cn("w-full border-border-default", errors.departamento && "border-destructive")}>
                                                    <SelectValue placeholder="Seleccionar" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.keys(locations).map(dep => (
                                                        <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    <div className="min-h-[16px]">
                                        {errors.departamento && <ErrorMessage>{errors.departamento.message}</ErrorMessage>}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <Label required className="text-xs">Provincia</Label>
                                    <Controller
                                        control={control}
                                        name="provincia"
                                        rules={{ required: "La provincia es obligatoria" }}
                                        render={({ field }) => (
                                            <Select
                                                disabled={!provincias.length}
                                                onValueChange={(val) => {
                                                    field.onChange(val)
                                                    setValue('distrito', '')
                                                    trigger(['provincia', 'distrito'])
                                                }}
                                                value={field.value || undefined}
                                            >
                                                <SelectTrigger className={cn("w-full border-border-default", errors.provincia && "border-destructive")}>
                                                    <SelectValue placeholder="Seleccionar" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {provincias.map(p => (
                                                        <SelectItem key={p} value={p}>{p}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    <div className="min-h-[16px]">
                                        {errors.provincia && <ErrorMessage>{errors.provincia.message}</ErrorMessage>}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <Label required className="text-xs">Distrito</Label>
                                    <Controller
                                        control={control}
                                        name="distrito"
                                        rules={{ required: "El distrito es obligatorio" }}
                                        render={({ field }) => (
                                            <Select
                                                disabled={!distritos.length}
                                                onValueChange={(val) => {
                                                    field.onChange(val)
                                                    trigger('distrito')
                                                }}
                                                value={field.value || undefined}
                                            >
                                                <SelectTrigger className={cn("w-full border-border-default", errors.distrito && "border-destructive")}>
                                                    <SelectValue placeholder="Seleccionar" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {distritos.map(d => (
                                                        <SelectItem key={d} value={d}>{d}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    <div className="min-h-[16px]">
                                        {errors.distrito && <ErrorMessage>{errors.distrito.message}</ErrorMessage>}
                                    </div>
                                </div>
                            </div>

                            <div className="grid  gap-3">
                                <div className="flex flex-col gap-1.5 sm:col-span-6">
                                    <Label required className="text-xs">Calle / Avenida / Jr.</Label>
                                    <Input
                                        {...register('direccion', { required: "La dirección es obligatoria" })}
                                        placeholder="Av. Principal"
                                        className={cn("border-border-default", errors.direccion && "border-destructive")}
                                    />
                                    <div className="min-h-[16px]">
                                        {errors.direccion && <ErrorMessage>{errors.direccion.message}</ErrorMessage>}
                                    </div>
                                </div>
                                {/* <div className="flex flex-col gap-1.5 sm:col-span-3">
                                    <Label className="text-xs">Número</Label>
                                    <Input {...register('numero')} placeholder="123" className="border-border-default" />
                                    <div className="min-h-[16px]" />
                                </div> */}
                                {/* <div className="flex flex-col gap-1.5 sm:col-span-3">
                                    <Label className="text-xs">Piso / Dpto</Label>
                                    <Input {...register('pisoDpto')} placeholder="Apto 401" className="border-border-default" />
                                    <div className="min-h-[16px]" />
                                </div> */}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label required className="text-xs">Referencia descriptiva</Label>
                                <Input
                                    {...register('referencia', { required: "La referencia es obligatoria" })}
                                    placeholder="Ej. Frente al parque, portón marrón..."
                                    className={cn("border-border-default", errors.referencia && "border-destructive")}
                                />
                                <div className="min-h-[16px]">
                                    {errors.referencia && <ErrorMessage>{errors.referencia.message}</ErrorMessage>}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 rounded-xl border border-border-default bg-surface-secondary/40 space-y-2">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-bold text-fg-primary">Lima - Santiago de surco</p>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-fg-action text-accent-foreground">
                                    Entrega Gratis
                                </span>
                            </div>
                            <p className="text-xs font-medium text-fg-muted leading-relaxed max-w-md">
                                Av caminos del inca 257, piso 3, Tda 326. Horario de atención: Lun-Dom 10am-10pm.
                            </p>
                            <p className="text-[11px] font-semibold pt-1">
                                &bull; Listo para recoger despues de realizar el pago.
                            </p>
                        </div>
                    )}
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        disabled={loading || !isValid}
                        variant="accent"
                        className="w-full disabled:cursor-not-allowed cursor-pointer font-bold"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Cargando pasarela...</span>
                            </div>
                        ) : (
                            'Pagar ahora'
                        )}
                    </Button>
                </div>
            </form>
        </>
    )
}