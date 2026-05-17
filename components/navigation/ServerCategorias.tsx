// Server Component
import { getCategories } from "@/src/services/categorys";
import ClientCategoriasDesktop from "./ClientCategoriasDesktop";

export default async function ServerCategorias() {
  const categories = await getCategories();

  return (
    <ClientCategoriasDesktop categories={categories} />
  );
}