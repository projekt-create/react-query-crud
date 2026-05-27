import axios from 'axios'

const API = 'http://localhost:3002/products'

export const getProducts = async () => {
  const res = await axios.get(API)
  return res.data
}

export const addProduct = async (newProduct) => {
  const res = await axios.post(API, newProduct)
  return res.data
}

export const deleteProduct = async (id) => {
  await axios.delete(`${API}/${id}`)
  return id
}

export const updateProduct = async (updatedProduct) => {
  const res = await axios.put(
    `${API}/${updatedProduct.id}`,
    updatedProduct
  )

  return res.data
}