import ErrorClient from "@/components/checkout/ErrorClient";

type SearchParams = Promise<{ error?: string; orderId?: string }>;

export default async function ErrorPageCheckout({ searchParams }: { searchParams: SearchParams }) {
    const { error: errorMessage, orderId } = await searchParams;

    return <ErrorClient errorMessage={errorMessage} orderId={orderId} />;
}