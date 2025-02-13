import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addProduct, updateProduct, removeProduct, clearProducts, setProducts, updatefull } from "../store/slices/ProductSlices";
import useLocalStorage from "../hooks/UseLocalStorage";
import useordersService from "./OrdersService";


function useProductsService() {
    
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products.products);
    const [storedProducts, setStoredProducts] = useLocalStorage("products_db", []);
    const [currentUser, setCurrentUser] = useLocalStorage("current_user", null);

    const {createOrder} = useordersService()

    useEffect(() => {
        if (storedProducts.length > 0) {
            dispatch(setProducts(storedProducts));
        }
    }, [dispatch, storedProducts]);

    useEffect(() => {
        setStoredProducts(products);
    }, [products, setStoredProducts]);

    const getAll = () => products.filter(product => product.done === false) ;
    const getById = (id) => products.find(product => product.id === id) || null;
    const getAllByuser = (id) => products.filter(product => product.user_id === id) ;
    const create = (product) => {
        if (currentUser) {
            const newProduct = { ...product, id: Date.now(), user_id: currentUser.id };
            dispatch(addProduct(newProduct));
        } else {
            throw new Error("User not authenticated");
        }
    };

    const update = (product) => {
        
        createOrder(product);
    };
    const accepted = (id) => {
        dispatch(updateProduct(id));
    };
    const updatefullprod = (id , newprod) => {
        dispatch(updatefull( {id , ...newprod}));
    };

    const remove = (id) => {
        dispatch(removeProduct(id));
    };

    const clearAll = () => {
        dispatch(clearProducts());
        setCurrentUser(null);
    };

    return { 
        getAllByuser,
        getAll,
        getById,
        create,
        update,
        remove,
        updatefullprod,
        clearAll,
        accepted
    };
}

export default useProductsService;
