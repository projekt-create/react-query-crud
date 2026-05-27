import {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct as updateProductApi
} from './api/ProductsApi.js'

import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'

import { useState } from 'react'

const App = () => {

  const queryClient = useQueryClient()

const { data, isLoading, isError, error } = useQuery({
  queryKey: ['products'],
  queryFn: getProducts
})

const addMutation = useMutation({
  mutationFn: addProduct,

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ['products']
    })
  }
})
  
  const deleteMutation = useMutation({
  mutationFn: deleteProduct,

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ['products']
    })
  }
})

const updateMutation = useMutation({
  mutationFn: updateProductApi,

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ['products']
    })
  }
})

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: null,
    currency: '',
    rating: null,
    images: ''
  })
  
  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: '',
    description: '',
    price: null,
    currency: '',
    rating: null,
    images: ''
  })

  const [postModal, setPostModal] = useState(false)
  const [editModal, setEditModal] = useState(false)

  const fakeCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  const handelOpenPostModal = () => { 
    setPostModal(true)
  }

  const handelClosePostModal = () => {
    setPostModal(false)
  }

  const handelOpenEditModal = (productId) => {
    const productToEdit = data.find((product) => product.id === productId)
    if (!productToEdit) return

    setEditModal(true)
    setUpdateProduct({
      ...productToEdit,
      images: productToEdit.images?.[0] || ''
    })
  }

  const handelCloseEditModal = () => {
    setEditModal(false)
  }

  const handelChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    })
  }

  const handelUpdateChange = (e) => {
    setUpdateProduct({
      ...updateProduct,
      [e.target.name]: e.target.value
    })
  }

  const handelSubmit = (e) => {
    e.preventDefault()
    addMutation.mutate({
      ...product,
      price: Number(product.price),
      rating: Number(product.rating),
      images: [product.images]
    })
    handelClosePostModal()
  }

  const handelUpdateSubmit = (e) => {
    e.preventDefault()
    updateMutation.mutate({
      ...updateProduct,
      price: Number(updateProduct.price),
      rating: Number(updateProduct.rating),
      images: [updateProduct.images]
    })
    handelCloseEditModal()
  }

  const handelDelete = (id) => {
    deleteMutation.mutate(id)
  }

  return (
    <div className='w-full min-h-screen flex flex-col items-center bg-linear-to-r from-cyan-500 to-blue-500'>
      <div className='w-7xl h-16 px-4 flex items-center justify-between rounded-2xl  bg-white/30 mt-10'>
        <h1 className='text-2xl font-bold'>React-query or Tanstack Query Shop</h1>
        <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:bg-blue-700' onClick={handelOpenPostModal} > {isLoading ? 'Loading...' : 'Add Product'}</button>
      </div>

      <div className='w-7xl h-150 mt-10 flex flex-wrap gap-4 bg-white/30 rounded-2xl p-4 justify-center overflow-y-auto scrollbar-track-blue-200 scrollbar-thumb-blue-500 scrollbar-thin'>
        {isLoading && fakeCards?.map((card) => (
          <div key={card} className='w-64 h-64 bg-gray-300 animate-pulse rounded-lg p-4'>
            <div className='w-full h-40 bg-gray-400 animate-pulse rounded-t-lg'></div>
            <div className='space-y-2 mt-3'>
              <div className='h-4 bg-gray-400 rounded'></div>
              <div className='h-4 w-20 bg-gray-400 rounded'></div>
            </div>
          </div>
        ))}

        {isError && <p className='text-red-500'>{error?.message}</p>}
        
        {!isLoading && !isError && data?.map((product) => (
          <div key={product?.id} className='w-80 h-96 bg-white rounded-lg shadow-md flex flex-col p-4 hover:scale-105 transition'>
            <img src={product?.images[0] || product?.images[1]} alt={product?.name} className='w-full h-40 object-cover rounded-t-lg' />
            <h2 className='text-lg font-semibold mt-4'>{product?.name}</h2>
            <p className='text-gray-600 mt-2'>{product?.description.slice(0, 40) + ' ' + '...'}</p>
            <div className='flex items-center gap-2'>
              <p className='text-blue-500 font-bold text-xl'>Price:  ${product?.price}</p>
              <p className='text-gray-600 font-bold text-xl' >{product?.currency}</p>
            </div>
              <p className='text-gray-600'>Rating: {product?.rating}</p>
            <div className='flex items-center gap-2'>
              <button onClick={() => handelOpenEditModal(product?.id)} className='bg-blue-500 text-white px-4 py-2 rounded mt-auto hover:bg-blue-600 active:bg-blue-700'>Edit</button>
              <button onClick={() => handelDelete(product?.id)} className='bg-red-500 text-white px-4 py-2 rounded mt-auto hover:bg-red-600 active:bg-red-700'>Delete</button>
            </div>
          </div>
        ))
        }

        {postModal && (
          <div className='fixed inset-0 backdrop-blur-sm flex items-center justify-center'>
            <div className='bg-white rounded-lg p-6 w-96'>
              <h2 className='text-xl font-bold mb-4'>Add Product</h2>
              <form onSubmit={handelSubmit} className='space-y-4'>
                <input type="text" name="name" placeholder='Name' onChange={handelChange} className='w-full border border-gray-300 rounded px-3 py-2' required  />
                <input type="text" name="description" placeholder='Description' onChange={handelChange} className='w-full border border-gray-300 rounded px-3 py-2' required />
                <input type="number" name="price" placeholder='Price' onChange={handelChange} className='w-full border border-gray-300 rounded px-3 py-2' required />
                <input type="text" name="currency" placeholder='Currency' onChange={handelChange} className='w-full border border-gray-300 rounded px-3 py-2' required />
                <input type="number" name="rating" placeholder='Rating' onChange={handelChange} className='w-full border border-gray-300 rounded px-3 py-2' required />
                <input type="text" name="images" placeholder='Image URL' onChange={handelChange} className='w-full border border-gray-300 rounded px-3 py-2' required />
                <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:bg-blue-700'>Submit</button>
                <button type='button' onClick={handelClosePostModal} className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 active:bg-gray-700'>Cancel</button>
              </form>
            </div>
          </div>
        )}

        {editModal && (
          <div className='fixed inset-0 backdrop-blur-sm flex items-center justify-center'>
            <div className='bg-white rounded-lg p-6 w-96'>
              <h2 className='text-xl font-bold mb-4'>Edit Product</h2>
              <form onSubmit={handelUpdateSubmit} className='space-y-4'>
                <input type="text" name="name" placeholder='Name' value={updateProduct?.name} onChange={handelUpdateChange} className='w-full border border-gray-300 rounded px-3 py-2' required />
                <input type="text" name="description" placeholder='Description' value={updateProduct?.description} onChange={handelUpdateChange} className='w-full border border-gray-300 rounded px-3 py-2' required />
                <input type="number" name="price" placeholder='Price' value={updateProduct?.price} onChange={handelUpdateChange} className='w-full border border-gray-300 rounded px-3 py-2' required />
                <input type="text" name="currency" placeholder='Currency' value={updateProduct?.currency} onChange={handelUpdateChange} className='w-full border border-gray-300 rounded px-3 py-2' required />
                <input type="number" name="rating" placeholder='Rating' value={updateProduct?.rating} onChange={handelUpdateChange} className='w-full border border-gray-300 rounded px-3 py-2' required />
                <input type="text" name="images" placeholder='Image URL' value={updateProduct?.images} onChange={handelUpdateChange} className='w-full border border-gray-300 rounded px-3 py-2' required />
                <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:bg-blue-700'>Submit</button>
                <button type='button' onClick={handelCloseEditModal} className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 active:bg-gray-700'>Cancel</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
