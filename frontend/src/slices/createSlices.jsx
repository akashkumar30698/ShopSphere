import { createSlice } from '@reduxjs/toolkit'


const initialState = {
 cart: [],
 count: 0,
}

export const counterSlice = createSlice({
  name: 'addToCart',
  initialState,
  reducers: {
    increment: (state) => {
      state.count++;
    },
    addToCartOnClick: (state, action) => {
      const existingProduct = state.cart.find(item => item.id === action.payload.id);
      
      if (existingProduct) {
        existingProduct.productQuantity += action.payload.productQuantity;

        
      } else {
        state.cart.push(action.payload);
      }
    },
    
  }
  
});



// Action creators are generated for each case reducer function
export const { addToCartOnClick,increment } = counterSlice.actions

export default counterSlice.reducer


/*

// Async thunk for updating product quantity in the database
//Thunk is used API calling

export const updateProductQuantity = createAsyncThunk(
  'updateProductQuantity',
  async (cartItem) => {
    try {
      const token = Cookies.get("accessToken");

      if (!token) {
        throw new Error('No token found');
      }
 

      console.log(cartItem)

      const res = await fetch(`${import.meta.env.VITE_APP_URL}/:userId/cartPage`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cartItem),
      });

      if (res.ok) {
        const data = await res.json();
        return data;
      }

     
    } catch (err) {
      console.log("Some error occurred", err);

    }
  }
);


export const counterSlice = createSlice({
  name: 'addToCart',
  initialState,
  reducers: {
    increment: (state) => {
      state.count++;
    },
    addToCartOnClick: (state, action) => {
      const existingProduct = state.cart.find(item => item.id === action.payload.id);
      
      if (existingProduct) {
        existingProduct.productQuantity += action.payload.productQuantity;

        updateProductQuantity(state.cart)
      } else {
        state.cart.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => { // Thunk is used for API calling
    builder
      .addCase(updateProductQuantity.fulfilled, (state, action) => {
  
        console.log('Cart updated successfully', action.payload);
      })
      .addCase(updateProductQuantity.rejected, (state, action) => {

        console.log('Failed to update cart', action.error);
      });
  }
});


*/
