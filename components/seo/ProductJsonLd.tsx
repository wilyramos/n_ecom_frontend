import type { ProductWithCategoryResponse } from "@/src/schemas"

export default function ProductJsonLd({ producto }: { producto: ProductWithCategoryResponse }) {
    if (!producto) return null

    const firstImage = producto.imagenes?.[0] || 'https://www.neoshopimportaciones.com/logomini.svg'
    const url = `https://www.neoshopimportaciones.com/productos/${producto.slug}`
    const brand = producto.atributos?.Marca || 'neoshop'

    // Price siempre como string con 2 decimales
    const price = (producto.precio ?? 0).toFixed(2)

    const availability = (producto.stock ?? 0) > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock'

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: producto.nombre,
        image: [firstImage],
        description:
            producto.descripcion?.replace(/\r?\n|\r/g, ' ').trim() ||
            'No description available',        // category: producto.categoria?.nombre || 'General',
        sku: producto.sku?.replace(/[^a-zA-Z0-9_-]/g, ''),
        gtin13: producto.barcode,
        brand: {
            '@type': 'Brand',
            name: brand,
        },
        releaseDate: producto.createdAt,
        offers: {
            '@type': 'Offer',
            url,
            price,
            priceCurrency: 'PEN',
            itemCondition: 'https://schema.org/NewCondition',
            availability,
            seller: {
                '@type': 'Organization',
                name: 'neoshop',
            },
            shippingDetails: {
                '@type': 'OfferShippingDetails',
                shippingRate: {
                    '@type': 'MonetaryAmount',
                    value: '10.00',
                    currency: 'PEN'
                },
                shippingDestination: {
                    '@type': 'DefinedRegion',
                    addressCountry: 'PE'
                },
                deliveryTime: {
                    '@type': 'ShippingDeliveryTime',
                    handlingTime: {
                        '@type': 'QuantitativeValue',
                        value: 1,
                        unitCode: 'd'
                    },
                    transitTime: {
                        '@type': 'QuantitativeValue',
                        value: 3,
                        unitCode: 'd'
                    }
                }
            },
            hasMerchantReturnPolicy: {
                '@type': 'MerchantReturnPolicy',
                returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
                merchantReturnDays: 7,
                returnMethod: 'https://schema.org/ReturnByMail',
                applicableCountry: 'PE',
                returnFees: 'https://schema.org/FreeReturn'
            }
        }
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    )
}
