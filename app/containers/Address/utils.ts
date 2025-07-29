import { setAddresses } from './addressSlice';

export const cacheAddresses = ({ data, dispatch }) => {
  if (data && dispatch) {
    dispatch(setAddresses(data?.delivery_addresses ?? []));
  }
};