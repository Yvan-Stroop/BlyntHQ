import { loadCategoriesFromCSV } from "@/lib/csv"
import { AddBusinessForm } from "./add-business-form"

export async function FormWrapper() {
  const categories = await loadCategoriesFromCSV()
  
  // Sort categories alphabetically by name
  const sortedCategories = [...categories].sort((a, b) => 
    a.name.localeCompare(b.name)
  )
  
  return <AddBusinessForm initialCategories={sortedCategories} />
} 