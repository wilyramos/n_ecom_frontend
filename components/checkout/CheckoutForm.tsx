// File: frontend/components/checkout/CheckoutForm.tsx
'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useCheckoutStore, type CheckoutData } from '@/src/store/checkoutStore'
import { useCartStore } from '@/src/store/cartStore'
import { createOrderAction } from '@/actions/order/create-order-action'
import { locations } from '@/src/data/locations'
import ErrorMessage from '../ui/ErrorMessage'
import { Button } from '../ui/button'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, User as UserIcon, MapPin, Truck, Store } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { TCreateOrder, User } from '@/src/schemas'
import { InputV2 } from '../ui/InputV2'
import { SelectV2 } from '../ui/SelectV2'

type Props = {
    user?: User | null
}

type ShippingMode = "delivery" | "pickup"

let globalSubmitLock = false

export default function CheckoutForm({ user }: Props) {
    const router = useRouter()
    const { setData } = useCheckoutStore()
    const { cart } = useCartStore()
    const [loading, setLoading] = useState(false)
    const [shippingMode, setShippingMode] = useState<ShippingMode>("delivery")
    const store = useCheckoutStore()

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        trigger,
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
        const mode = value as ShippingMode
        setShippingMode(mode)

        if (mode === "pickup") {
            setValue('departamento', 'Lima')
            setValue('provincia', 'Lima')
            setValue('distrito', 'Santiago de Surco')
            setValue('direccion', 'Av caminos del inca')
            setValue('numero', '257')
            setValue('pisoDpto', '3')
            setValue('referencia', 'Tda 326')
            clearErrors(['departamento', 'provincia', 'distrito', 'direccion', 'referencia'])
        } else {
            setValue('departamento', '')
            setValue('provincia', '')
            setValue('distrito', '')
            setValue('direccion', '')
            setValue('numero', '')
            setValue('pisoDpto', '')
            setValue('referencia', '')
        }
        trigger()
    }

    const onSubmit = async (data: CheckoutData) => {
        if (globalSubmitLock) return
        globalSubmitLock = true

        setLoading(true)
        setData(data)

        document.getElementById("culqi_checkout_iframe")?.remove()
        const oldContainer = document.querySelector(".culqi-checkout-container")
        if (oldContainer) oldContainer.remove()

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
            toast.error(result.message)
            setLoading(false)
            globalSubmitLock = false
            return
        }

        localStorage.setItem("currentOrderId", result.order._id)

        console.log("🚀 [CheckoutForm] Redirigiendo a la pantalla unificada de pago.")
        globalSubmitLock = false
        setLoading(false)

        router.push(`/checkout/payment?orderId=${result.order._id}`)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-foreground">
            <Tabs defaultValue="delivery" value={shippingMode} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid grid-cols-2 w-full  h-12 rounded-2xl">
                    <TabsTrigger value="delivery">
                        <Truck size={14} className="mr-2" /> Envío a domicilio
                    </TabsTrigger>
                    <TabsTrigger value="pickup">
                        <Store size={14} className="mr-2" /> Retiro en tienda
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="p-4 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                    <UserIcon size={16} className="text-muted-foreground" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Contacto e Identificación
                    </h3>
                </div>

                <div className="space-y-1">
                    <InputV2
                        label={user ? 'Cuenta de usuario (Protegido)' : 'Correo electrónico'}
                        type="email"
                        {...register('email', {
                            required: "El correo electrónico es obligatorio",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Ingresa un formato de correo válido"
                            }
                        })}
                        disabled={!!user}
                        className={cn(user && "bg-muted/50 cursor-not-allowed", errors.email && "border-destructive focus-visible:ring-destructive")}
                    />
                    {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <InputV2
                            label="Nombre"
                            type="text"
                            {...register('nombre', { required: "El nombre es obligatorio" })}
                            className={cn(errors.nombre && "border-destructive focus-visible:ring-destructive")}
                        />
                        {errors.nombre && <ErrorMessage>{errors.nombre.message}</ErrorMessage>}
                    </div>
                    <div className="space-y-1">
                        <InputV2
                            label="Apellidos"
                            type="text"
                            {...register('apellidos', { required: "Los apellidos son obligatorios" })}
                            className={cn(errors.apellidos && "border-destructive focus-visible:ring-destructive")}
                        />
                        {errors.apellidos && <ErrorMessage>{errors.apellidos.message}</ErrorMessage>}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-4 space-y-1">
                        <SelectV2
                            label="Tipo Doc."
                            {...register('tipoDocumento', { required: "Requerido" })}
                            className={cn(errors.tipoDocumento && "border-destructive focus-visible:ring-destructive")}
                        >
                            <option value="DNI">DNI</option>
                            <option value="RUC">RUC</option>
                            <option value="CE">Carnet de Ext.</option>
                        </SelectV2>
                        {errors.tipoDocumento && <ErrorMessage>{errors.tipoDocumento.message}</ErrorMessage>}
                    </div>
                    <div className="sm:col-span-8 space-y-1">
                        <InputV2
                            label="N° Documento"
                            type="text"
                            {...register('numeroDocumento', {
                                required: "El documento es obligatorio",
                                minLength: { value: 8, message: "Mínimo 8 caracteres" }
                            })}
                            className={cn(errors.numeroDocumento && "border-destructive focus-visible:ring-destructive")}
                        />
                        {errors.numeroDocumento && <ErrorMessage>{errors.numeroDocumento.message}</ErrorMessage>}
                    </div>
                </div>

                <div className="space-y-1">
                    <InputV2
                        label="Teléfono / Móvil"
                        type="text"
                        {...register('telefono', {
                            required: "El teléfono es obligatorio",
                            pattern: { value: /^[0-9]{9}$/, message: "Debe tener 9 dígitos" }
                        })}
                        className={cn(errors.telefono && "border-destructive focus-visible:ring-destructive")}
                    />
                    {errors.telefono && <ErrorMessage>{errors.telefono.message}</ErrorMessage>}
                </div>
            </div>

            <div className="p-4 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                    <MapPin size={16} className="text-muted-foreground" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        {shippingMode === "delivery" ? "Dirección de envío" : "Tienda de recojo"}
                    </h3>
                </div>

                {shippingMode === "delivery" ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                                <SelectV2
                                    label="Dpto."
                                    {...register('departamento', { required: "Obligatorio" })}
                                    onChange={(e) => {
                                        setValue('departamento', e.target.value)
                                        setValue('provincia', '')
                                        setValue('distrito', '')
                                        trigger(['departamento', 'provincia', 'distrito'])
                                    }}
                                    className={cn(errors.departamento && "border-destructive focus-visible:ring-destructive")}
                                >
                                    <option value="">Seleccionar</option>
                                    {Object.keys(locations).map(depKey => (
                                        <option key={depKey} value={depKey}>{depKey}</option>
                                    ))}
                                </SelectV2>
                                {errors.departamento && <ErrorMessage>{errors.departamento.message}</ErrorMessage>}
                            </div>

                            <div className="space-y-1">
                                <SelectV2
                                    label="Provincia"
                                    {...register('provincia', { required: "Obligatorio" })}
                                    disabled={!provincias.length}
                                    onChange={(e) => {
                                        setValue('provincia', e.target.value)
                                        setValue('distrito', '')
                                        trigger(['provincia', 'distrito'])
                                    }}
                                    className={cn(errors.provincia && "border-destructive focus-visible:ring-destructive")}
                                >
                                    <option value="">Seleccionar</option>
                                    {provincias.map(pKey => (
                                        <option key={pKey} value={pKey}>{pKey}</option>
                                    ))}
                                </SelectV2>
                                {errors.provincia && <ErrorMessage>{errors.provincia.message}</ErrorMessage>}
                            </div>

                            <div className="space-y-1">
                                <SelectV2
                                    label="Distrito"
                                    {...register('distrito', { required: "Obligatorio" })}
                                    disabled={!distritos.length}
                                    className={cn(errors.distrito && "border-destructive focus-visible:ring-destructive")}
                                >
                                    <option value="">Seleccionar</option>
                                    {distritos.map(dKey => (
                                        <option key={dKey} value={dKey}>{dKey}</option>
                                    ))}
                                </SelectV2>
                                {errors.distrito && <ErrorMessage>{errors.distrito.message}</ErrorMessage>}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2 space-y-1">
                                <InputV2
                                    label="Calle / Avenida / Jr."
                                    type="text"
                                    {...register('direccion', { required: "La dirección es obligatoria" })}
                                    className={cn(errors.direccion && "border-destructive focus-visible:ring-destructive")}
                                />
                                {errors.direccion && <ErrorMessage>{errors.direccion.message}</ErrorMessage>}
                            </div>
                            <div className="space-y-1">
                                <InputV2
                                    label="N° / Int."
                                    type="text"
                                    {...register('numero')}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                                <InputV2
                                    label="Piso / Dpto"
                                    type="text"
                                    {...register('pisoDpto')}
                                />
                            </div>
                            <div className="col-span-2 space-y-1">
                                <InputV2
                                    label="Referencia descriptiva"
                                    type="text"
                                    {...register('referencia', { required: "La referencia es obligatoria" })}
                                    className={cn(errors.referencia && "border-destructive focus-visible:ring-destructive")}
                                />
                                {errors.referencia && <ErrorMessage>{errors.referencia.message}</ErrorMessage>}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 rounded-xl border bg-muted/30 border-input space-y-2">
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-bold text-foreground">Lima - Santiago de Surco</p>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary text-primary-foreground">
                                Entrega Gratis
                            </span>
                        </div>
                        <p className="text-xs font-medium text-muted-foreground leading-relaxed max-w-md">
                            Av. Caminos del Inca 257, piso 3, Tda 326. Horario de atención: Lun-Dom 10am-10pm.
                        </p>
                        <p className="text-[11px] font-semibold text-foreground pt-1">
                            &bull; Listo para recoger después de realizar el pago.
                        </p>
                    </div>
                )}
            </div>

            <div className="pt-2">
                <Button
                    type="submit"
                    disabled={loading || !isValid}
                    variant="accent"
                    className="w-full disabled:cursor-not-allowed cursor-pointer font-bold h-11"
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Generando orden...</span>
                        </div>
                    ) : (
                        'Ir a pagar'
                    )}
                </Button>
            </div>
        </form>
    )
}