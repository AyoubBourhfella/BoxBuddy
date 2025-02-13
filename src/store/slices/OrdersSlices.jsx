import { createSlice } from "@reduxjs/toolkit";

const ordersSlice = createSlice({
    name: "orders",
    initialState: {
        orders: [], 
    },
    reducers: {
        setOrders: (state, action) => {
            state.orders = action.payload;
        },
        addOrder: (state, action) => {
            state.orders.push(action.payload);
        },
        updateOrder: (state, action) => {
            
           state.orders = state.orders.map(p => p.id == action.payload ? {...p , done: true} : p);
        },
        removeOrder: (state, action) => {
            state.orders = state.orders.filter(p => p.id_order !== action.payload);
        },
        clearOrders: (state) => {
            state.orders = [];
        },
        updatefull : (state, action) => {
            state.orders = state.orders.map(p => p.id == action.payload.id ? action.payload : p);
        },
        acceptOrder : (state, action) => {
            state.orders = state.orders.map(p => p.id_order == action.payload ? {...p , accepted: true , done: true} : p);
        }
    },
});

export const { setOrders, addOrder, updateOrder, updatefull, removeOrder, clearOrders , acceptOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
