import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'

export const SET_LOADING = 'SET_LOADING'
export const SET_IMAGES = 'SET_IMAGES'
export const SET_ERROR = 'SET_ERROR'
export const SET_FILTERS = 'SET_FILTERS'
export const SELECT_IMAGE = 'SELECT_IMAGE'
export const CLEAR_SELECTION = 'CLEAR_SELECTION'
export const NEXT_PAGE = 'NEXT_PAGE'
export const PREV_PAGE = 'PREV_PAGE'

const initialState = {
  images: [],
  loading: false,
  error: null,
  filters: { width: 300, height: 300, page: 1, limit: 12, blur: 0, grayscale: false },
  selectedImage: null,
}

function galleryReducer(state, action) {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      }
    case SET_IMAGES:
      return {
        ...state,
        images: action.payload,
      }
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
      }
    case SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      }
    case SELECT_IMAGE:
      return {
        ...state,
        selectedImage: action.payload,
      }
    case CLEAR_SELECTION:
      return {
        ...state,
        selectedImage: null,
      }
    case NEXT_PAGE:
      return {
        ...state,
        filters: {
          ...state.filters,
          page: state.filters.page + 1,
        },
      }
    case PREV_PAGE:
      return {
        ...state,
        filters: {
          ...state.filters,
          page: Math.max(1, state.filters.page - 1),
        },
      }
    default:
      return state
  }
}

const GalleryContext = createContext(null)

export function GalleryProvider({ children }) {
  const [state, dispatch] = useReducer(galleryReducer, initialState)

  const fetchImages = useCallback(async (activeFilters) => {
    const { page, limit, width, height, blur, grayscale } = activeFilters
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    dispatch({ type: SET_LOADING, payload: true })
    dispatch({ type: SET_ERROR, payload: null })

    try {
      const response = await fetch(
        `https://picsum.photos/v2/list?page=${page}&limit=${limit}`,
        { signal: controller.signal },
      )

      if (!response.ok) {
        throw new Error('Não foi possível carregar as imagens no momento.')
      }

      const data = await response.json()
      const enrichedImages = data.map((apiImage) => {
        let displayUrl = `https://picsum.photos/id/${apiImage.id}/${width}/${height}`

        if (grayscale && blur > 0) {
          displayUrl += `?grayscale&blur=${blur}`
        } else if (grayscale) {
          displayUrl += '?grayscale'
        } else if (blur > 0) {
          displayUrl += `?blur=${blur}`
        }

        return {
          ...apiImage,
          displayUrl,
          renderWidth: width,
          renderHeight: height,
          aspectRatio: width > 0 && height > 0 ? width / height : 1,
        }
      })

      dispatch({ type: SET_IMAGES, payload: enrichedImages })
      dispatch({ type: SET_ERROR, payload: null })
    } catch (error) {
      const message =
        error.name === 'AbortError'
          ? 'A requisição demorou demais. Tente novamente em instantes.'
          : 'Ocorreu um erro ao buscar imagens. Verifique sua conexão e tente novamente.'

      dispatch({ type: SET_IMAGES, payload: [] })
      dispatch({ type: SET_ERROR, payload: message })
    } finally {
      clearTimeout(timeoutId)
      dispatch({ type: SET_LOADING, payload: false })
    }
  }, [])

  const applyFilters = useCallback(
    async (newFilters) => {
      const nextFilters = {
        ...state.filters,
        ...newFilters,
      }

      dispatch({ type: SET_FILTERS, payload: newFilters })
      await fetchImages(nextFilters)
    },
    [fetchImages, state.filters],
  )

  const selectImage = useCallback((image) => {
    dispatch({ type: SELECT_IMAGE, payload: image })
  }, [])

  const clearSelection = useCallback(() => {
    dispatch({ type: CLEAR_SELECTION })
  }, [])

  const goToNextPage = useCallback(async () => {
    const nextFilters = {
      ...state.filters,
      page: state.filters.page + 1,
    }

    dispatch({ type: NEXT_PAGE })
    await fetchImages(nextFilters)
  }, [fetchImages, state.filters])

  const goToPrevPage = useCallback(async () => {
    const previousPage = Math.max(1, state.filters.page - 1)
    const previousFilters = {
      ...state.filters,
      page: previousPage,
    }

    dispatch({ type: PREV_PAGE })
    await fetchImages(previousFilters)
  }, [fetchImages, state.filters])

  useEffect(() => {
    fetchImages(initialState.filters)
  }, [fetchImages])

  const value = useMemo(
    () => ({
      ...state,
      fetchImages,
      applyFilters,
      selectImage,
      clearSelection,
      goToNextPage,
      goToPrevPage,
    }),
    [state, fetchImages, applyFilters, selectImage, clearSelection, goToNextPage, goToPrevPage],
  )

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
}

export function useGallery() {
  const context = useContext(GalleryContext)

  if (!context) {
    throw new Error('useGallery deve ser usado dentro de GalleryProvider')
  }

  return context
}
