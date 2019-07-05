import pd from "../constant/products";

export const setProducts = data => ({ type: pd.set_product, value: data });
export const editProducts = value => ({ type: pd.edit, value: value });