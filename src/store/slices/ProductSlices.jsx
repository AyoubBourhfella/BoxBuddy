import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
    name: "products",
    initialState: {
        products: [], 
    },
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        addProduct: (state, action) => {
            state.products.push(action.payload);
        },
        updateProduct: (state, action) => {
            
           state.products = state.products.map(p => p.id == action.payload ? {...p , done: true} : p);
        },
        removeProduct: (state, action) => {
            state.products = state.products.filter(p => p.id !== action.payload);
        },
        clearProducts: (state) => {
            state.products = [];
        },
        updatefull : (state, action) => {
            state.products = state.products.map(p => p.id == action.payload.id ? action.payload : p);
        }
    },
});

export const { setProducts, addProduct, updateProduct, updatefull, removeProduct, clearProducts } = productsSlice.actions;
export default productsSlice.reducer;
