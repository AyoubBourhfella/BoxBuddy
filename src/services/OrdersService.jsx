import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setOrders, updateOrder, updatefull, removeOrder, clearOrders, addOrder, acceptOrder } from "../store/slices/OrdersSlices";
import useLocalStorage from "../hooks/UseLocalStorage";
import { updateProduct } from "../store/slices/ProductSlices";


function useordersService() {
    
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.orders.orders);
    const [storedOrder, setstoredOrder] = useLocalStorage("orders_db", []);
    const [currentUser, setCurrentUser] = useLocalStorage("current_user", null);


    useEffect(() => {
        if (storedOrder.length > 0) {
            dispatch(setOrders(storedOrder));
        }
    }, [dispatch, storedOrder]);

    useEffect(() => {
        setstoredOrder(orders);
    }, [orders, setstoredOrder]);

    const getAll = () => orders ;
    const getById = (id) => orders.find(order => order.id === id) || null;
    const getAllByOwner = () => orders.filter(order => order.user === currentUser.id) ;
    const createOrder = (order) => {
        if (!currentUser) {
            throw new Error("User not authenticated");
        }
    
        const isthiscreator = orders.find(o => o.id === order.id && o.user_id === currentUser.id);

        if(isthiscreator){
            throw new Error("You are the owner of this product");
        }
        const exist = orders.find(o => o.submitted_by === currentUser.id && o.id === order.id);
    
        if (exist) {
            throw new Error("You have already placed an order for this product");
        }

        const neworder = { 
            ...order, 
            id_order: orders.length + 1, 
            submitted_by: currentUser.id,  
            accepted: false 
        };
    
        dispatch(addOrder(neworder));
    };
    
    const accept = (id , productid) => {
        dispatch(acceptOrder(id));
        dispatch(updateProduct(productid))

    }
    const update = (id) => {
        dispatch(updateOrder( id));
    };
    const updatefullprod = (id , newprod) => {
        dispatch(updatefull( {id , ...newprod}));
    };

    const remove = (id) => {
        dispatch(removeOrder(id));
    };

    const clearAll = () => {
        dispatch(clearOrders());
        setCurrentUser(null);
    };

    return { 
        getAllByOwner,
        getAll,
        getById,
        createOrder,
        update,
        remove,
        updatefullprod,
        clearAll,
        accept
    };
}

export default useordersService;
