// components/home/CategoriasDestacadasWrapper.tsx
import { getCategories } from "@/src/services/categorys"
import CategoriasDestacadas from "./CategoriasDestacadas"

export default async function CategoriasDestacadasWrapper() {
  const categories = await getCategories()
  return <CategoriasDestacadas categorias={categories} />
}
