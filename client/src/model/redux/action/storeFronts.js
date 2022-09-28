import sF from "../constant/storeFronts";

export const setStoreFronts = (data) => ({
  type: sF.set_store_fronts,
  value: data,
});
