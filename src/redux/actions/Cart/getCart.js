import axios from "axios";
import { GET_CART } from "../actions-types";

const URL = 'https://pinkpanther-backend-ip0f.onrender.com/'

export const getCart =()=>{
    return async(dispatch)=>{
        try {
            const response = await axios.get(`${URL}/cart`)
            dispatch({
                type:GET_CART,
                payload: response.data.allCart
            })
        } catch (error) {
            console.error('Error los productos del carrito', error);
        dispatch({ type: GET_CART, payload: error });
        }
    }
}

export default getCart;