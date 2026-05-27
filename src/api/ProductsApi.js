import axios from 'axios'

const API = 'http://localhost:3002/products'

// GET
export const getProducts = async () => {
  const res = await axios.get(API)
  return res.data
}

// ADD
export const addProduct = async (newProduct) => {
  const res = await axios.post(API, newProduct)
  return res.data
}

// DELETE
export const deleteProduct = async (id) => {
  await axios.delete(`${API}/${id}`)
  return id
}

// EDIT
export const updateProduct = async (updatedProduct) => {
  const res = await axios.put(
    `${API}/${updatedProduct.id}`,
    updatedProduct
  )

  return res.data
}