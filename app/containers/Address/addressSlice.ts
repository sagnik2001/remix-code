import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AddressValue {
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export interface Address {
  selectedAddressIndex: number;
  addresses: Array<Object>;
  selectedAddressValue :  Partial<AddressValue>
}

const initialState: Address = {
  selectedAddressIndex: 0,
  addresses: [],
  selectedAddressValue : {}
};

export const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setSelectedAddressIndex: (state, action: PayloadAction<number>) => {
      state.selectedAddressIndex = action.payload;
    },
    setAddresses: (state, action: PayloadAction<Array<Object>>) => {
      state.addresses = action.payload;
    },
    setSelectedAddressValue : (state,action) => {
       state.selectedAddressValue = action.payload
    },
    resetAddressSlice: () => initialState
  }
});

export const { setSelectedAddressIndex, setAddresses, resetAddressSlice ,setSelectedAddressValue} = addressSlice.actions;
export default addressSlice.reducer;
