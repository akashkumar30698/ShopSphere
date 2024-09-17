import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../slices/createSlices'

//console.log(counterReducer)

export const store = configureStore({
  reducer: {
    //name
    addToCart: counterReducer,
    
  },
})

