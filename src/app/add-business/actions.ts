'use server'

import { loadCategoriesFromCSV } from "@/lib/csv"

export async function getCategories() {
  return await loadCategoriesFromCSV()
} 