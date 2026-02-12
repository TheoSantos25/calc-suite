import { createContext, useContext } from 'react'

const CategoryColorContext = createContext<string | null>(null)

export function CategoryColorProvider({ color, children }: { color: string; children: React.ReactNode }) {
  return <CategoryColorContext.Provider value={color}>{children}</CategoryColorContext.Provider>
}

export function useCategoryColor() {
  return useContext(CategoryColorContext)
}
