import { combineSlices } from "@reduxjs/toolkit";
import UserReducer from './slices/UserSlice';
import ProductSlices from './slices/ProductSlices';
import OrdersSlices from './slices/OrdersSlices';

const Reducer = combineSlices({
  user : UserReducer,
  products: ProductSlices,
  orders: OrdersSlices
})

export default Reducer;
                

