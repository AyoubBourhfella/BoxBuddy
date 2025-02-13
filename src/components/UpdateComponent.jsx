import React, { useEffect, useState } from 'react'
import AddForm from './AddForm'
import ClickableMap from './Updateclickablemap';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addProduct } from '../store/slices/ProductSlices';
import useProductsService from '../services/ProduitsService';
import UpdateForm from './UpdateForm';

function UpdateComponent({id}) {
    const [product, setProduct] = useState({ name: '', weight: '', dimensions: '', image: null, from: { lon: null, lat: null }, to: { lon: null, lat: null }, done: false });
    const {updatefullprod , getById} = useProductsService()
    
    useEffect(()=>{
        const prod = getById(id)
        setProduct(prod || { name: '', weight: '', dimensions: '', image: null, from: { lon: null, lat: null }, to: { lon: null, lat: null }, done: false })
    },[id])

    const handlesubmit = () => {
        Object.entries(product).map(([key, value]) => {

            if (value === null) {
                toast.error(`${key} is required`)
                return
            }
        }
        )
        if (!product.from.lon || !product.from.lat || !product.to.lon || !product.to.lat) {
            toast.error('Please select a location on the map')
            return
        }
      
        updatefullprod(id , product)
        toast.success('Product updated successfully')

    }
    return (
        <>
            <dialog id="update" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Add a product to ship.</h3>
                    <UpdateForm product={product}  setProduct={setProduct} />
                    <ClickableMap product={product} setProduct={setProduct} />

                    <div className="modal-action">
                        <button onClick={handlesubmit} className='px-3 rounded-md text-[#f84525] hover:text-white hover:bg-[#f84525] transition-all  duration-200 py-2 cursor-pointer outline-2 outline-[#f84525]' >Submit</button>
                        <form method="dialog">
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    )
}

export default UpdateComponent