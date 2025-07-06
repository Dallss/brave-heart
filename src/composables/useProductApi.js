import { apiClient } from '../utils/auth.js'

export function useProductApi() {
  // Get a product by ID
  const getProductById = async (id) => {
    const response = await apiClient.get(`/Product/${id}`)
    if (!response.ok) throw new Error(await response.text())
    return await response.json()
  }

  // Get product attributes by product ID
  const getProductAttributes = async (id) => {
    const response = await apiClient.get(`/Product/${id}/attributes`)
    if (!response.ok) throw new Error(await response.text())
    return await response.json()
  }

  // Update a product
  const updateProduct = async (id, updateDto) => {
    const response = await apiClient.put(`/Product/${id}`, updateDto)
    if (!response.ok) throw new Error(await response.text())
    return await response.json()
  }

  // Create a product
  const createProduct = async (dto) => {
    const response = await apiClient.post('/Product', dto)
    if (!response.ok) throw new Error(await response.text())
    return await response.json()
  }

  // Delete a product
  const deleteProduct = async (id) => {
    const response = await apiClient.delete(`/Product/${id}`)
    if (!response.ok) throw new Error(await response.text())
    return true
  }

  // Get products grouped by type
  const getProductsByType = async () => {
    const response = await apiClient.get('/Product/by-type')
    if (!response.ok) throw new Error(await response.text())
    return await response.json()
  }

  // Get all product types
  const getProductTypes = async () => {
    const response = await apiClient.get('/ProductType')
    if (!response.ok) throw new Error(await response.text())
    return await response.json()
  }

  return {
    getProductById,
    getProductAttributes,
    updateProduct,
    createProduct,
    deleteProduct,
    getProductsByType,
    getProductTypes,
  }
}
