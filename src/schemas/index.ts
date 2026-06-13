import { z } from 'zod';
import { ApiBrandSchema } from './brands';

/* ============================================================
    AUTENTICACIÓN Y USUARIOS
============================================================ */

// ---------- Registro ----------
export const RegisterSchema = z.object({
    email: z.string().email({ message: 'Email no válido' }),
    nombre: z.string().min(1, { message: 'El nombre es obligatorio' }),
    password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

// ---------- Registro en Checkout ----------
export const CheckoutRegisterSchema = z.object({
    nombre: z.string().min(1, { message: 'El nombre es obligatorio' }),
    apellidos: z.string().min(1, { message: 'Los apellidos son obligatorios' }),
    tipoDocumento: z.enum(['DNI', 'RUC', 'CE']),
    numeroDocumento: z.string().min(1, { message: 'El número de documento es obligatorio' }),
    email: z.string().email({ message: 'Email no válido' }),
    telefono: z.string()
        .min(1, { message: 'El teléfono es obligatorio' })
        .regex(/^[0-9]{9}$/, { message: 'Debe contener 9 dígitos numéricos' }),
});
export type CheckoutRegister = z.infer<typeof CheckoutRegisterSchema>;

// ---------- Login ----------
export const LoginSchema = z.object({
    email: z.string().email({ message: 'Email no válido' }),
    password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

// ---------- Respuestas de éxito ----------
export const SuccessSchemaRegister = z.object({
    message: z.string(),
    userId: z.string(),
    token: z.string(),
});

export const SuccessSchemaLogin = z.object({
    message: z.string(),
    token: z.string(),
    role: z.enum(['cliente', 'administrador', 'vendedor', 'colaborador']),
});

export const SuccessSchemaForgotPassword = z.object({
    message: z.string(),
});

export const SuccessSchemaTokenValidation = z.object({
    message: z.string(),
});

// ---------- Respuestas de error ----------
export const ErrorResponseSchema = z.object({
    message: z.string(),
});

export const ErrorResponse = z.object({
    message: z.string(),
});

export const SuccessResponse = z.object({
    message: z.string(),
});

// ---------- Validación de token ----------
export const TokenSchema = z.string({ message: 'Token inválido' })
    .length(6, { message: 'Token inválido' });

// ---------- Reset password ----------
export const resetPasswordSchema = z.object({
    password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation'],
});

export const ForgotPasswordSchema = z.object({
    email: z.string().email({ message: 'Email no válido' }),
});

// ---------- Edición y respuesta de usuarios ----------
export const BaseUserSchema = z.object({
    nombre: z.string().optional(),
    apellidos: z.string().optional(),
    tipoDocumento: z.enum(['DNI', 'RUC', 'CE']).optional(),
    numeroDocumento: z.string().optional(),
    telefono: z.string().optional(),
    email: z.string().email().optional(),
    rol: z.enum(['cliente', 'administrador', 'vendedor', 'colaborador']).optional(),
    googleId: z.string().optional(),
});

export const UserEditSchema = BaseUserSchema.extend({
    _id: z.string().optional(),
});

export const UserSchema = z.object({
    _id: z.string().optional(),
    nombre: z.string().optional(),
    apellidos: z.string().optional(),
    tipoDocumento: z.enum(['DNI', 'RUC', 'CE']).optional(),
    numeroDocumento: z.string().optional(),
    telefono: z.string().optional(),
    email: z.string().email().optional(),
    rol: z.enum(['cliente', 'administrador', 'vendedor', 'colaborador']).optional(),
    googleId: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    __v: z.number().optional(),
});
export type User = z.infer<typeof UserSchema>;

export const UsersAPIResponse = z.object({
    users: z.array(UserSchema),
    totalUsers: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
});
export type UsersAPIResponse = z.infer<typeof UsersAPIResponse>;


/* ============================================================
   CATEGORÍAS
============================================================ */

// ---------- Atributos ----------
export const categoryAttributeSchema = z.object({
    name: z.string().min(1, 'El nombre del atributo es obligatorio'),
    values: z.array(z.string().min(1, 'El valor no puede estar vacío'))
        .refine(
            (vals) => new Set(vals.map(v => v.toLowerCase())).size === vals.length,
            { message: 'No se permiten valores duplicados dentro del mismo atributo' }
        ),
    isVariant: z.boolean().optional(),
});

export type CategoryAttribute = z.infer<typeof categoryAttributeSchema>;

export const categoryAttributesArraySchema = z.array(categoryAttributeSchema)
    .refine(
        (attrs) => new Set(attrs.map(a => a.name.toLowerCase())).size === attrs.length,
        { message: 'No se permiten atributos con el mismo nombre' }
    );

// ---------- Categoría base ----------
export const categoryBaseSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    descripcion: z.string().optional(),
    slug: z.string().optional(),
    parent: z.string().nullable().optional(),
    attributes: categoryAttributesArraySchema.optional(),
    image: z.string().url('Debe ser una URL válida').optional(),
    isActive: z.boolean().optional(),
});

// ---------- Create & Update ----------
export const createCategorySchema = categoryBaseSchema;
export const updateCategorySchema = categoryBaseSchema.partial();

// ---------- Respuestas ----------
export const categoryParentSchema = z.object({
    _id: z.string(),
    nombre: z.string(),
    slug: z.string().optional(),
});
export type categoryParentSchemaType = z.infer<typeof categoryParentSchema>;

export const apiCategorySchema = categoryBaseSchema.extend({
    _id: z.string(),
    slug: z.string().optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
    __v: z.number().optional(),
    parent: z.union([z.string(), categoryParentSchema]).nullable().optional(),

});

export const apiCategoryListSchema = z.array(apiCategorySchema);
export type CategoryResponse = z.infer<typeof apiCategorySchema>;
export type CategoryListResponse = z.infer<typeof apiCategoryListSchema>;


/* ============================================================
   PRODUCTOS Y VARIANTES
============================================================ */
// ---------- Esquemas base ----------
const atributosSchema = z.record(z.string(), z.string());

export const especificacionSchema = z.object({
    key: z.string().min(1),
    value: z.string().min(1),
});

// ---------- Dimensiones ----------
export const dimensionsSchema = z.object({
    length: z.number().min(0, 'El largo no puede ser negativo'),
    width: z.number().min(0, 'El ancho no puede ser negativo'),
    height: z.number().min(0, 'El alto no puede ser negativo'),
});

// ---------- Variantes ----------
export const variantSchema = z.object({
    nombre: z.string().optional(),
    precio: z.number().min(0, 'El precio no puede ser negativo').optional(),
    precioComparativo: z.number().min(0, 'El precio comparativo no puede ser negativo').optional(),
    stock: z.number().min(0, 'El stock no puede ser negativo').default(0),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    imagenes: z.array(z.string().url('Debe ser una URL válida')).optional(),
    atributos: atributosSchema.default({}),
});

// ---------- Producto base ----------
export const productBaseSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    slug: z.string().optional(),
    descripcion: z.string().optional(),
    precio: z.number().min(0, 'El precio no puede ser negativo').default(0),
    precioComparativo: z.number().min(0, 'El precio comparativo no puede ser negativo').optional(),
    costo: z.number().min(0, 'El costo no puede ser negativo').optional(),
    imagenes: z.array(z.string().url('Debe ser una URL válida')).optional(),
    categoria: z.string().min(1, 'La categoría es obligatoria'),
    stock: z.number().min(0, 'El stock no puede ser negativo').optional(),
    diasEnvio: z.number().min(1, 'Los días de envío deben ser un número positivo').optional(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    isActive: z.boolean().optional().default(true),
    esDestacado: z.boolean().optional().default(false),
    esNuevo: z.boolean().optional().default(false),
    atributos: atributosSchema.optional(),
    especificaciones: z.array(especificacionSchema)
        .optional()
        .refine((specs) => {
            if (!specs) return true;
            const keys = specs.map(spec => spec.key.toLowerCase());
            return new Set(keys).size === keys.length;
        }, { message: 'No se permiten claves duplicadas en las especificaciones' }),
    brand: z.string().optional(),
    variants: z.array(variantSchema).optional(),
    isFrontPage: z.boolean().optional().default(false),
    line: z.string().optional(),
    complementarios: z.array(z.string()).optional().default([]),
    tags: z.array(z.string()).optional().default([]),
    weight: z.number().min(0, 'El peso no puede ser negativo').optional(),
    dimensions: dimensionsSchema.optional(),
    metaTitle: z.string().max(60, 'El metaTitle no puede superar los 60 caracteres').optional(),
    metaDescription: z.string().max(160, 'La metaDescription no puede superar los 160 caracteres').optional(),
});

// ---------- Create & Update ----------
export const createProductSchema = productBaseSchema.extend({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    categoria: z.string().min(1, 'La categoría es obligatoria'),
});
export const updateProductSchema = productBaseSchema.partial();

// ---------- API Response ----------
export const ApiVariantSchema = variantSchema.extend({
    _id: z.string(),
});

export const ComplementaryProductSchema = z.object({
    _id: z.string(),
    nombre: z.string(),
    precio: z.number(),
    slug: z.string(),
    imagenes: z.array(z.string()).optional(),
});

export type TComplementaryProduct = z.infer<typeof ComplementaryProductSchema>;

export const ApiProductSchema = productBaseSchema
    .omit({ slug: true, brand: true, line: true })
    .extend({
        _id: z.string(),
        slug: z.string(),
        categoria: z.union([z.string(), apiCategorySchema]).optional().nullable(),
        brand: ApiBrandSchema.optional(),
        line: z.union([
            z.string(),
            z.object({
                _id: z.string().optional(),
                nombre: z.string(),
                slug: z.string(),
            })
        ]).optional().nullable(),
        complementarios: z.union([
            z.array(z.string()),
            z.array(ComplementaryProductSchema)
        ]).optional().default([]),
        variants: z.array(ApiVariantSchema).optional(),
        rating: z.number().min(0).max(5).default(0),
        numReviews: z.number().min(0).default(0),
        deletedAt: z.string().datetime().optional().nullable(),
        createdAt: z.string().datetime().optional(),
        updatedAt: z.string().datetime().optional(),
        __v: z.number().optional(),
    });

export const ApiProductsSchema = z.array(ApiProductSchema);

// ---------- Tipos inferidos ----------
export type TEspecificacion = z.infer<typeof especificacionSchema>;
export type TDimensions = z.infer<typeof dimensionsSchema>;
export type TVariant = z.infer<typeof variantSchema>;
export type TApiVariant = z.infer<typeof ApiVariantSchema>;
export type TProductBase = z.infer<typeof productBaseSchema>;
export type TCreateProduct = z.infer<typeof createProductSchema>;
export type TUpdateProduct = z.infer<typeof updateProductSchema>;
export type TApiProduct = z.infer<typeof ApiProductSchema>;
export type TApiProducts = z.infer<typeof ApiProductsSchema>;

export const ApiProductFullSchema = ApiProductSchema.extend({
    categoria: apiCategorySchema,
});

export type TApiProductFull = z.infer<typeof ApiProductFullSchema>;

// ---------- Listas y Respuestas ----------
export const ProductListSchema = ApiProductSchema.pick({
    _id: true,
    nombre: true,
    precio: true,
    slug: true,
    imagenes: true,
    precioComparativo: true,
    brand: true,
    categoria: true,
});

export const productResponseAllSchema = ApiProductSchema.pick({
    slug: true,
    updatedAt: true,
});

export const productsResponseAllSchema = z.array(productResponseAllSchema);
export type TProductResponseAll = z.infer<typeof productResponseAllSchema>;
export type TProductsResponseAll = z.infer<typeof productsResponseAllSchema>;

export const ProductsListSchema = z.array(ProductListSchema);
export type TProductListSchema = z.infer<typeof ProductListSchema>;

export const apiProductListSchema = z.array(ApiProductSchema);

export const productsAPIResponse = z.object({
    products: z.array(ApiProductSchema),
    totalPages: z.number(),
    currentPage: z.number(),
    totalProducts: z.number(),
});
export type ProductsAPIResponse = z.infer<typeof productsAPIResponse>;


/* ============================================================
   🏷️ MARCAS Y FILTROS
============================================================ */

// 1. Schema para Marca dentro del filtro
export const brandFilterSchema = z.object({
    id: z.string(),
    nombre: z.string(),
    slug: z.string(),
});

// 2. Schema para Categoría dentro del filtro
export const categoryFilterSchema = z.object({
    id: z.string(),
    nombre: z.string(),
    slug: z.string(),
});

// 3. Schema para Atributos Dinámicos (ej: Color, Memoria)
const attributeFilterSchema = z.object({
    name: z.string(), // ej: "Color"
    values: z.array(z.string()), // ej: ["Rojo", "Azul"]
});

// 4. Schema para Precio (Mongo lo devuelve como array de 1 elemento)
const priceFilterSchema = z.object({
    min: z.number().nullable().optional(),
    max: z.number().nullable().optional(),
});

// 5. Schema PRINCIPAL de Filtros (El objeto contenedor)
export const filterSchema = z.object({
    brands: z.array(brandFilterSchema).optional().default([]),
    categories: z.array(categoryFilterSchema).optional().default([]),
    atributos: z.array(attributeFilterSchema).optional().default([]),
    price: z.array(priceFilterSchema).optional().default([]),
});

export type TFilter = z.infer<typeof filterSchema>;


/* ============================================================
   🚀 RESPUESTA FINAL DE LA API CON FILTROS
============================================================ */

export const productsApiResponseWithFilters = productsAPIResponse.extend({
    // CORRECCIÓN AQUÍ: 'filters' es un OBJETO, no un array de objetos.
    // Antes tenías: z.array(filterSchema)
    filters: filterSchema.optional(),
});

export type TProductsApiResponseWithFilters = z.infer<typeof productsApiResponseWithFilters>;


export const ApiProductWithCategorySchema = ApiProductSchema.extend({
    categoria: apiCategorySchema,
});

export const productsWithCategoryAPIResponse = z.object({
    products: z.array(ApiProductWithCategorySchema),
    totalPages: z.number(),
    currentPage: z.number(),
    totalProducts: z.number(),
});
export type ProductWithCategoryResponse = z.infer<typeof ApiProductWithCategorySchema>;

/* ============================================================
   🧾 TIPOS GENERALES
============================================================ */

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductResponse = z.infer<typeof ApiProductSchema>;


// CARTA Y ITEMS DE CARRITO

export const VariantCartSchema = z.object({
    _id: z.string(),
    nombre: z.string().optional(),
    precio: z.number().optional(),
    atributos: z.record(z.string()).default({}),
    stock: z.number().min(0).optional(),
    imagenes: z.array(z.string()).optional(),
});

export type VariantCart = z.infer<typeof VariantCartSchema>;

const CartItemSchema = ApiProductSchema.pick({
    _id: true,
    nombre: true,
    precio: true,
    imagenes: true,
    stock: true,
}).extend({
    cantidad: z.number().min(1, { message: 'La cantidad debe ser al menos 1' }),
    subtotal: z.number().min(0, { message: 'El subtotal debe ser al menos 0' }),
    variant: VariantCartSchema.optional(),
});

export type CartItem = z.infer<typeof CartItemSchema>;
export const CartSchema = z.object({
    cart: z.array(CartItemSchema),
    total: z.number(),
});
export type Cart = z.infer<typeof CartSchema>;


/* **********************************************
*************************************************





END END END 





*************************************************
******************************************
*/

// CART


export const AttributeSchema = z.object({
    name: z.string().min(1, { message: 'El nombre del atributo es obligatorio' }),
    values: z.array(z.string().min(1, { message: 'Cada valor del atributo es obligatorio' }))
        .min(1, { message: 'Debe haber al menos un valor para el atributo' })
});


export const AttributesSchema = z.array(AttributeSchema)
export type Attribute = z.infer<typeof AttributeSchema>
export type Attributes = z.infer<typeof AttributesSchema>


const CategorySchemaParent = z.object({
    _id: z.string(),
    nombre: z.string().min(1, { message: 'El nombre es obligatorio' }),
    parent: z.string().nullable().optional(), // Puede ser null si no tiene padre
});

export const CategorySchema = z.object({
    _id: z.string(),
    nombre: z.string(),
    slug: z.string(),
    parent: CategorySchemaParent.nullable().optional(), // Puede ser null si no tiene padre
    descripcion: z.string().optional(),
    attributes: z.array(AttributeSchema).optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
    __v: z.number().optional(),
})


export const VariantOptionSchema = z.object({
    nombre: z.string().min(1, { message: 'El nombre de la opción es obligatorio' }),
    valores: z.array(
        z.string().min(1, { message: 'Cada valor de la opción es obligatorio' })
    ).min(1, { message: 'Debe haber al menos un valor para la opción' })
});

export const VariantSchema = z.object({
    opciones: z.array(VariantOptionSchema).min(1, { message: 'Cada variante debe tener al menos una opción' }),
    stock: z.number().min(0, { message: 'El stock es obligatorio y debe ser mayor o igual a 0' }),
    barcode: z.string().optional().or(z.literal('')), // Permite opcional o cadena vacía
});

const AtributosProductSchema = z.record(z.string(), z.string());

// Create product schema
export const CreateProductSchema = z.object({
    nombre: z.string().min(1, { message: 'El nombre es obligatorio' }),
    descripcion: z.string().min(1, { message: 'La descripciónn es obligatoria' }),
    precio: z.number().min(0, { message: 'El precio es obligatorio' }),
    costo: z.number().min(0).optional(),
    categoria: z.string().min(1, { message: 'La categoría es obligatoria' }),
    stock: z.number().min(0, { message: 'El stock es obligatorio' }),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    imagenes: z.array(z.string()),
    variantes: z.array(VariantSchema).optional(),
    esDestacado: z.boolean().default(false).optional(),
    esNuevo: z.boolean().default(false).optional(),
    isActive: z.boolean().default(true),
    atributos: AtributosProductSchema.optional(),
});

// Response API
export const ProductSchema = z.object({
    _id: z.string(),
    nombre: z.string(),
    slug: z.string().optional(),
    descripcion: z.string().optional(),
    precio: z.number(),
    costo: z.number().optional(),
    imagenes: z.array(z.string()),
    categoria: CategorySchema.optional(),
    stock: z.number(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    isActive: z.boolean().default(true).optional(),
    esDestacado: z.boolean().default(false).optional(),
    esNuevo: z.boolean().default(false).optional(),
    variantes: z.array(VariantSchema).optional(),
    atributos: AtributosProductSchema.optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),

})

export type Variant = z.infer<typeof VariantSchema>
export type VariantOption = z.infer<typeof VariantOptionSchema>
export type Product = z.infer<typeof ProductSchema>
export const productsSchema = z.array(ProductSchema);

export const ProductsAPIResponse = z.object({
    products: z.array(ProductSchema),
    totalPages: z.number(),
    currentPage: z.number(),
    totalProducts: z.number(),
})
export type ProductsList = z.infer<typeof ProductsAPIResponse>

// image 

export const ImageSchemaResponse = z.object({
    images: z.array(z.string()),
})

export const ImageSchema = z.object({
    image: z.string(),
})


export const ProductAPIResponse = z.object({
    _id: z.string(),
    nombre: z.string(),
    slug: z.string().optional(),
    descripcion: z.string().optional(),
    precio: z.number(),
    costo: z.number().optional(),
    imagenes: z.array(z.string()),
    categoria: CategorySchema.optional(),
    stock: z.number(),
    sku: z.string().optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
    __v: z.number().optional(),
    barcode: z.string().optional(),
    isActive: z.boolean().default(true), // Campo para indicar si el producto está activo
    variantes: z.array(VariantSchema).optional(),
    esDestacado: z.boolean().default(false).optional(),
    esNuevo: z.boolean().default(false).optional(),
    atributos: AtributosProductSchema.optional(),
})

export const ProductAPIResponseInPopulate = ProductAPIResponse.pick({
    _id: true,
    nombre: true,
    imagenes: true,
    sku: true,
    updatedAt: true,
    barcode: true,
})

export type ProductType = z.infer<typeof ProductAPIResponse>

export const ProductAPIResponseList = z.object({
    products: z.array(ProductAPIResponse),
    totalPages: z.number(),
    currentPage: z.number(),
    totalProducts: z.number(),
})
export type ProductList = z.infer<typeof ProductAPIResponseList>

export type ProductAPIResponseType = z.infer<typeof ProductAPIResponse>

export const CategoryAPIResponse = CategorySchema
export type Category = z.infer<typeof CategorySchema>

export const CategoriesAPIResponse = z.array(CategorySchema)
export type CategoriasList = z.infer<typeof CategoriesAPIResponse>



// ORDER


//Enums 

export const OrderStatusEnum = z.enum(['PENDIENTE', 'PROCESANDO', 'ENVIADO', 'ENTREGADO', 'CANCELADO', 'pending', 'approved', 'rejected', 'refunded', 'canceled', 'awaiting_payment']);
export type OrderStatusEnum = z.infer<typeof OrderStatusEnum>;

// Dirección de envío
// export const ShippingAddressSchema = z.object({
//     departamento: z.string(),
//     provincia: z.string(),
//     distrito: z.string(),
//     direccion: z.string(),
//     numero: z.string().optional(),
//     piso: z.string().optional(),
//     referencia: z.string().optional(),
// });

// export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;


// Producto que se está pidiendo (solo se envía el ID)
// export const OrderItemSchema = z.object({
//     productId: z.string().min(1, { message: 'El ID del producto es obligatorio' }),
//     quantity: z.number().min(1, { message: 'La cantidad debe ser al menos 1' }),
//     price: z.number().min(0, { message: 'El precio debe ser al menos 0' }),
// });

// export const statusHistorySchema = z.object({
//     status: OrderStatusEnum,
//     changedAt: z.string().datetime().default(() => new Date().toISOString()),
// });


// // Creación de la orden
// export const CreateOrderSchema = z.object({
//     // items: z.array(OrderItemSchema).min(1, { message: 'Debe haber al menos un producto en la orden' }),
//     subtotal: z.number().nonnegative(),
//     shippingCost: z.number().nonnegative(),
//     totalPrice: z.number().nonnegative(),
//     shippingAddress: ShippingAddressSchema,
//     status: OrderStatusEnum.default('PENDIENTE').optional(),
//     shippingMethod: z.string().optional(),
//     notes: z.string().optional(),
//     paymentMethod: PaymentMethodEnum.or(z.string()).default('MERCADOPAGO').optional(),
//     paymentStatus: PaymentStatusEnum.or(z.string()).default('PENDIENTE').optional(),
// });

// Respuesta de la orden populada

// item de la orden

const ProductSchemaOrder = z.object({
    productId: ProductAPIResponseInPopulate.nullable(),
    quantity: z.number(),
    price: z.number()
})

export const OrderResponseSchemaPopulate = z.object({
    _id: z.string(),
    user: UserSchema,
    items: z.array(ProductSchemaOrder),
    subtotal: z.number(),
    shippingCost: z.number(),
    totalPrice: z.number(),
    // shippingAddress: ShippingAddressSchema,
    status: OrderStatusEnum,
    // statusHistory: z.array(statusHistorySchema).optional(),
    trackingId: z.string().optional(),
    isPrinted: z.boolean().default(false).optional(),
    paymentId: z.string().optional(),
    notes: z.string().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
})

// Respuesta de la orden de la api
// export const OrderResponseSchema = z.object({
//     _id: z.string(),
//     orderNumber: z.string().optional(),
//     user: UserSchema.or(z.string()).optional().nullable(),
//     // items: z.array(OrderItemSchema),
//     subtotal: z.number(),
//     shippingCost: z.number(),
//     totalPrice: z.number(),
//     shippingAddress: ShippingAddressSchema,
//     status: OrderStatusEnum,
//     // statusHistory: z.array(statusHistorySchema).optional(),
//     trackingId: z.string().optional(),
//     isPrinted: z.boolean().default(false).optional(),
//     paymentId: z.string().optional(),
//     notes: z.string().optional(),
//     createdAt: z.string().datetime(),
//     updatedAt: z.string().datetime(),
// });

// inferencias 
// export type Order = z.infer<typeof OrderResponseSchemaPopulate>;
// export const OrdersAPIResponse = z.object({
//     orders: z.array(OrderResponseSchema),
//     totalOrders: z.number(),
//     totalPages: z.number(),
//     currentPage: z.number(),
// });
// export type OrdersList = z.infer<typeof OrdersAPIResponse>;


// Payload para enviar a mercadopago

export const PreferenceItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    quantity: z.number(),
    unit_price: z.number().nonnegative(),
    currency_id: z.string().default('PEN'),
    picture_url: z.string().optional(),
});

export const PreferencePayerSchema = z.object({
    email: z.string().email({ message: 'Email no válido' }),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    phone: z.object({
        area_code: z.string().optional(),
        number: z.string().optional(),
    }).optional(),
});

export const CreatePreferenceSchema = z.object({
    items: z.array(PreferenceItemSchema),
    payer: PreferencePayerSchema,
    orderId: z.string()
});

// Inferencias
// export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type CreatePreferenceInput = z.infer<typeof CreatePreferenceSchema>;

// Esquemas para izipay


export const IzipayTokenSchema = z.object({
    token: z.string(),
});





//** SALES **//

export const SaleStatusEnum = z.enum(['PENDING', 'COMPLETED', 'PARTIALLY_REFUNDED', 'REFUNDED', 'CANCELED']);
export const SalePaymentMethodEnum = z.enum(['CASH', 'CARD', 'TRANSFER', 'YAPE', 'PLIN', 'MERCADOPAGO', 'OTHER']);
export const SalePaymentStatusEnum = z.enum(['pending', 'approved', 'rejected', 'refunded']);

export const SaleItemSchema = z.object({
    product: z.string(), // para envío solo se usa el id
    variantId: z.string().optional(),
    quantity: z.number().min(1, { message: 'La cantidad debe ser al menos 1' }),
    price: z.number().min(0, { message: 'El precio debe ser al menos 0' }),
});

export const receiptTypeSchema = z.enum(['TICKET', 'BOLETA', 'FACTURA']).optional();
export type TReceiptType = z.infer<typeof receiptTypeSchema>;

export const CreateSaleSchema = z.object({
    items: z.array(SaleItemSchema).min(1, { message: 'Debe tener al menos un producto' }),
    totalPrice: z.number().min(0),
    employee: z.string().optional(),
    customerDNI: z.string().optional(),
    totalDiscountAmount: z.number().min(0).optional(),
    order: z.string().optional(),
    status: SaleStatusEnum.optional(),
    paymentMethod: SalePaymentMethodEnum.optional(),
    paymentStatus: SalePaymentStatusEnum.optional(),
    receiptType: receiptTypeSchema,
});

export type CreateSaleInput = z.infer<typeof CreateSaleSchema>;


// Esquemas para ventas


export const SaleItemResponseSchemaPopulate = z.object({
    product: ProductAPIResponseInPopulate,
    quantity: z.number(),
    price: z.number(),
});

export const SaleItemResponseSchema = z.object({
    product: ProductAPIResponseInPopulate.or(z.string()), // puede venir populado o como id
    quantity: z.number(),
    price: z.number(),
});




export const SaleResponseSchema = z.object({
    _id: z.string(),
    customerDNI: z.string().optional(),
    employee: UserSchema.or(z.string()).optional().nullable(),
    items: z.array(SaleItemResponseSchema),
    totalPrice: z.number(),
    totalDiscountAmount: z.number().optional(),
    order: z.string().optional().nullable(),
    status: SaleStatusEnum,
    paymentStatus: SalePaymentStatusEnum,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    receiptNumber: z.string().optional(),
    __v: z.number().optional(),
});

export const SaleResponsePopulate = z.object({
    _id: z.string(),
    customerDNI: z.string().optional(),
    employee: UserSchema.or(z.string()).optional().nullable(),
    items: z.array(SaleItemResponseSchemaPopulate),
    totalPrice: z.number(),
    totalDiscountAmount: z.number().optional(),
    order: z.string().optional().nullable(),
    status: SaleStatusEnum,
    paymentStatus: SalePaymentStatusEnum,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    receiptNumber: z.string().optional(),
    __v: z.number().optional(),
});

export type Sale = z.infer<typeof SaleResponseSchema>;

export const SalesAPIResponse = z.object({
    sales: z.array(SaleResponseSchema),
    totalSales: z.number(),
    totalAmount: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
});

// DNI

export const DniSchema = z.object({
    dni: z.string().length(8, { message: 'El DNI debe tener 8 dígitos' }),
});


// Izipay

export type IzipayOptions = {
    public_key: string;
    amount: number;
    currency: 'PEN' | 'USD';
    order_id: string;
    customer: {
        name: string;
        email: string;
    };
    metadata?: Record<string, string>;
    callback_url?: string;
};

export type IzipayInstance = {
    open: () => void;
    close: () => void;
}

export interface Window {
    Izipay?: {
        new(options: IzipayOptions): IzipayInstance;
    };
}

// ======= ORDER ======= //

/* ============================
    ENUMS (igual que backend)
============================ */
export const OrderStatus = z.enum([
    "awaiting_payment",
    "processing",
    "shipped",
    "delivered",
    "canceled",
    "paid_but_out_of_stock"
]);

export const PaymentStatus = z.enum([
    "pending",
    "approved",
    "rejected",
    "refunded",
]);

/* ============================
    SUBSCHEMAS
============================ */

export const CustomerProfileSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido"),
    apellidos: z.string().min(1, "Los apellidos son requeridos"),
    email: z.string().email("Ingresa un correo electrónico válido"),
    telefono: z.string().regex(/^[0-9]{9}$/, "El teléfono debe tener 9 dígitos numéricos"),
    tipoDocumento: z.enum(["DNI", "Pasaporte", "CE", "RUC"]),
    numeroDocumento: z.string().min(8, "Documento de identidad inválido"),
});

export const ShippingAddressSchema = z.object({
    departamento: z.string().min(1, "El departamento es requerido"),
    provincia: z.string().min(1, "La provincia es requerida"),
    distrito: z.string().min(1, "El distrito es requerido"),
    direccion: z.string().min(1, "La dirección es requerida"),
    numero: z.string().optional(),
    pisoDpto: z.string().optional(),
    referencia: z.string().min(1, "La referencia es requerida"),
});

export const OrderItemSchema = z.object({
    productId: z.string().min(1, "El producto es requerido"),
    variantId: z.string().optional().nullable(), // Ajuste: Backend puede devolver null
    variantAttributes: z.record(z.string()).optional().nullable(),
    quantity: z.number().positive(),
    price: z.number().nonnegative(),
    nombre: z.string(), // Backend lo requiere
    imagen: z.string().url().optional().nullable(),
});

export const ProductForOrderSchema = z.object({
    _id: z.string(),
    nombre: z.string().optional(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    imagenes: z.array(z.string().url()).optional(),
});

export const OrderItemPopulatedSchema = z.object({
    productId: ProductForOrderSchema.nullable(),
    variantId: z.string().optional(),
    quantity: z.number().positive(),
    price: z.number().nonnegative(),
});

// Información de pago — incluye campos Culqi opcionales
export const PaymentInfoSchema = z.object({
    provider: z.string().min(1, "El proveedor es requerido"),
    method: z.string().optional(),
    transactionId: z.string().optional(),
    status: PaymentStatus.default("pending"),
    rawResponse: z.any().optional(),

    // ── Culqi Orden ──────────────────────────────────────────────────────────
    culqiOrderId: z.string().optional(),
    culqiOrderNumber: z.string().optional(),
    culqiPaymentCode: z.string().optional(),
    culqiOrderState: z.string().optional(),
    culqiExpirationDate: z.number().optional(),
    culqiPaidAt: z.number().optional(),

    // ── MercadoPago ──────────────────────────────────────────────────────────
    mpPreferenceId: z.string().optional(),
    mpMerchantOrderId: z.string().optional(),
    mpPaymentStatusDetail: z.string().optional(),
});

export const StatusHistorySchema = z.object({
    status: OrderStatus,
    changedAt: z.string().or(z.date()),
});

/* ============================
    ORDEN PRINCIPAL
============================ */

export const OrderSchema = z.object({
    _id: z.string(),
    orderNumber: z.string(),
    user: z.string().optional().nullable(),
    customerProfile: CustomerProfileSchema,
    items: z.array(OrderItemSchema),
    subtotal: z.number().nonnegative(),
    shippingCost: z.number().nonnegative(),
    totalPrice: z.number().nonnegative(),
    currency: z.string().default("PEN"),
    status: OrderStatus.default("awaiting_payment"),
    statusHistory: z.array(StatusHistorySchema).default([]),
    shippingAddress: ShippingAddressSchema,
    payment: PaymentInfoSchema,
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const OrderPopulatedSchema = z.object({
    _id: z.string(),
    orderNumber: z.string(),
    user: z.lazy(() => UserSchema).nullable().optional(),
    customerProfile: CustomerProfileSchema,
    items: z.array(OrderItemSchema),
    subtotal: z.number().nonnegative(),
    shippingCost: z.number().nonnegative(),
    totalPrice: z.number().nonnegative(),
    currency: z.string().default("PEN"),
    status: OrderStatus.default("awaiting_payment"),
    statusHistory: z.array(StatusHistorySchema).default([]),
    shippingAddress: ShippingAddressSchema,
    payment: PaymentInfoSchema,
    createdAt: z.string(),
    updatedAt: z.string(),
});

/* ============================
    REQUEST SCHEMAS
============================ */

export const CreateOrderSchema = z.object({
    items: z.array(OrderItemSchema).min(1, "Debe haber al menos un producto"),
    subtotal: z.number().nonnegative(),
    shippingCost: z.number().nonnegative().default(0),
    totalPrice: z.number().nonnegative(),
    currency: z.string().default("PEN"),
    shippingAddress: ShippingAddressSchema,
    customerProfile: CustomerProfileSchema,
    payment: PaymentInfoSchema,
});

// Respuesta del backend al crear una orden con Culqi.
// culqiOrderId se devuelve en el root para que el frontend
// lo inyecte en settings.order del Checkout JS.
export const CreateOrderResponseSchema = z.object({
    message: z.string(),
    order: OrderSchema,
    culqiOrderId: z.string().optional(), // presente solo si provider === 'culqi' y la API respondió OK
});

export const UpdateOrderStatusSchema = z.object({
    status: OrderStatus,
});

/* ============================
    RESPONSES DEL BACKEND
============================ */

export const OrdersListResponseSchema = z.object({
    orders: z.array(OrderSchema),
    totalOrders: z.number(),
    currentPage: z.number(),
    totalPages: z.number(),
});

export const OrdersListResponseSchemaPopulate = z.object({
    orders: z.array(OrderPopulatedSchema),
    totalOrders: z.number(),
    currentPage: z.number(),
    totalPages: z.number(),
});

/* ============================
    TYPESCRIPT TYPES
============================ */
export type TOrderStatus = z.infer<typeof OrderStatus>;
export type TPaymentStatus = z.infer<typeof PaymentStatus>;
export type TCustomerProfile = z.infer<typeof CustomerProfileSchema>;
export type TShippingAddress = z.infer<typeof ShippingAddressSchema>;
export type TOrderItem = z.infer<typeof OrderItemSchema>;
export type TPaymentInfo = z.infer<typeof PaymentInfoSchema>;
export type TStatusHistory = z.infer<typeof StatusHistorySchema>;
export type TOrder = z.infer<typeof OrderSchema>;
export type TCreateOrder = z.infer<typeof CreateOrderSchema>;
export type TCreateOrderResponse = z.infer<typeof CreateOrderResponseSchema>;
export type TOrdersListResponse = z.infer<typeof OrdersListResponseSchema>;
export type TOrderPopulated = z.infer<typeof OrderPopulatedSchema>;
export type TOrdersListResponsePopulate = z.infer<typeof OrdersListResponseSchemaPopulate>;

// ======= SALES ======= //

export const SaleSourceSchema = z.enum(["ONLINE", "POS"])

// Estado de la venta
export const SaleStatusSchema = z.enum([
    "PENDING",
    "COMPLETED",
    "PARTIALLY_REFUNDED",
    "REFUNDED",
    "CANCELED",
])

// Métodos de pago en POS
export const PaymentMethodSchema = z.enum([
    "CASH",
    "CARD",
    "YAPE",
    "PLIN",
    "TRANSFER",
])

// **** REPORT ORDERS

export const OrdersSummarySchema = z.object({
    grossSales: z.number().min(0).optional(),
    netSales: z.number().min(0).optional(),
    numberOrders: z.number().min(0).optional(),
    numberOrdersPagadas: z.number().min(0).optional(),
    numberOrdersPendientes: z.number().min(0).optional(),
    numberOrdersCanceladas: z.number().min(0).optional(),
    totalUnitsSold: z.number().min(0).optional(),
    margin: z.number().min(0).optional(),
    marginRate: z.string().min(0).optional(),
    avgPaidOrderValue: z.number().min(0).optional(),
});

export const OrdersOverTimeSchema = z.object({
    date: z.string().min(10).max(10),
    totalSales: z.number().min(0),
    numberOfOrders: z.number().min(0),
});

export const OrdersByStatusSchema = z.object({
    status: z.string(),
    numberOfOrders: z.number().min(0),
});

export const OrdersByCitySchema = z.object({
    department: z.string(),
    numberOfOrders: z.number().min(0),
    totalSales: z.number().min(0),
});

export type TOrdersSummary = z.infer<typeof OrdersSummarySchema>;
export type TOrdersOverTime = z.infer<typeof OrdersOverTimeSchema>;
export type TOrdersByStatus = z.infer<typeof OrdersByStatusSchema>;
export type TOrdersByCity = z.infer<typeof OrdersByCitySchema>;


//  ***** Purchases  *****

export const ProductForPurchasesOrderSchema = z.object({
    _id: z.string(),
    nombre: z.string().optional(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    imagenes: z.array(z.string().url()).optional(),
});



export const purchaseItemSchemaPopulated = z.object({
    productId: ProductForPurchasesOrderSchema.nullable(),
    quantity: z.number().int().positive("Cantidad debe ser mayor a 0"),
    priceUnit: z.number().nonnegative("El precio unitario no puede ser negativo"),
    totalPrice: z.number().nonnegative("El total no puede ser negativo").optional(),
})

export const purchaseItemSchema = z.object({
    productId: z.string().min(1, "El producto es obligatorio"), // ObjectId como string
    quantity: z.number().int().positive("Cantidad debe ser mayor a 0"),
    priceUnit: z.number().nonnegative("El precio unitario no puede ser negativo"),
    totalPrice: z.number().nonnegative("El total no puede ser negativo").optional(),
});

// ---------- COMPRA ----------
export const purchaseSchemaPopulated = z.object({
    numeroCompra: z.number().optional(), // generado automáticamente
    proveedor: z.string().min(1, "El proveedor es obligatorio"),
    items: z.array(purchaseItemSchemaPopulated).min(1, "Debe haber al menos un producto"),
    total: z.number().nonnegative("El total no puede ser negativo").optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
    _id: z.string().min(1, "El ID es obligatorio"),
});

// ---------- COMPRA ----------
export const purchaseSchema = z.object({
    numeroCompra: z.number().optional(), // generado automáticamente
    proveedor: z.string().min(1, "El proveedor es obligatorio"),
    items: z.array(purchaseItemSchema).min(1, "Debe haber al menos un producto"),
    total: z.number().nonnegative("El total no puede ser negativo").optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
    _id: z.string().min(1, "El ID es obligatorio"),
});

// ---------- INPUTS ----------
export const createPurchaseSchema = purchaseSchema.omit({
    numeroCompra: true,
    createdAt: true,
    updatedAt: true,
    _id: true
});

export const updatePurchaseSchema = purchaseSchema.partial();

// ---------- API  ---------- 

export const purchasesResponseSchema = z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    purchases: z.array(purchaseSchema),
});

// ---------- TYPESCRIPT TYPES ----------
export type TPurchaseItemInput = z.infer<typeof purchaseItemSchema>;
export type TPurchaseInput = z.infer<typeof createPurchaseSchema>;
export type TPurchaseUpdateInput = z.infer<typeof updatePurchaseSchema>;
export type TPurchase = z.infer<typeof purchaseSchema>;
export type TPurchasesResponse = z.infer<typeof purchasesResponseSchema>;
export type TpurchaseSchemaPopulated = z.infer<typeof purchaseSchemaPopulated>;


export const OrdersByPaymentMethodSchema = z.object({
    provider: z.string(), // O 'method' según tu DB
    numberOfOrders: z.number().min(0),
    totalSales: z.number().min(0),
});

export type TOrdersByPaymentMethod = z.infer<typeof OrdersByPaymentMethodSchema>;