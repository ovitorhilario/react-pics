import { createContext, useContext } from 'react'

const GalleryContext = createContext(null)

export function GalleryProvider({ children }) {
  const value = {}

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
}

export function useGallery() {
  const context = useContext(GalleryContext)

  if (!context) {
    throw new Error('useGallery deve ser usado dentro de GalleryProvider')
  }

  return context
}
