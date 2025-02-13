import React, { useState } from 'react'
import useProductsService from '../services/ProduitsService'
import useUserService from '../services/UserService'
import toast from 'react-hot-toast'
import UpdateComponent from './UpdateComponent'

function Dashboard() {
    const { getAllByuser, remove } = useProductsService()
    const [id , setId] = useState(null)
    const { currentUser } = useUserService()
    const products = getAllByuser(currentUser.id);

    const handleDelete = (id) => {
        remove(id)
        toast.success('Product deleted successfully')
    }
    const handleUpdate = (id) => {
        setId(id)
        document.getElementById('update').showModal()
    }
    return (
        <>
            <dialog id="updatemodel" className="modal ">
                <div className="modal-box min-w-[80vw]">
                    <h2 className="text-2xl font-bold mb-4">Product List</h2>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border px-4 py-2">Image</th>
                                    <th className="border px-4 py-2">Name</th>
                                    <th className="border px-4 py-2">Weight</th>
                                    <th className="border px-4 py-2">Dimensions</th>
                                    <th className="border px-4 py-2">From</th>
                                    <th className="border px-4 py-2">To</th>
                                    <th className="border px-4 py-2">Status</th>
                                    <th className="border px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="text-center">
                                        <td className="border px-4 py-2">
                                            <img src={product.image} alt={product.name} className="w-16 h-16 object-cover" />
                                        </td>
                                        <td className="border px-4 py-2">{product.name}</td>
                                        <td className="border px-4 py-2">{product.weight} kg</td>
                                        <td className="border px-4 py-2">{product.dimensions}</td>
                                        <td className="border px-4 py-2">Lat: {product.from.lat}, Lon: {product.from.lon}</td>
                                        <td className="border px-4 py-2">Lat: {product.to.lat}, Lon: {product.to.lon}</td>
                                        <td className="border px-4 py-2">{product.done ? 'Completed' : 'Pending'}</td>
                                        <td className="border px-4 py-2 flex flex-col items-start">
                                            <button onClick={() => handleUpdate(product.id)} className="bg-blue-500 text-white px-3 cursor-pointer py-1 rounded mr-2">Update</button>
                                            <button onClick={() => handleDelete(product.id)} className="bg-red-500 text-white px-3 cursor-pointer py-1 rounded">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
            <UpdateComponent id={id} />
        </>
    )
}

export default Dashboard