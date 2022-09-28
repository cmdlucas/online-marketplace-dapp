import pd from "../constant/products";

export const products = (state = [], action) => {
  switch (action.type) {
    case pd.set_product:
      return [...action.value];
    default:
      return [...state];
  }
};
