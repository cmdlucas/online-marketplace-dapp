import sF from "../constant/storeFronts";

export const storeFronts = (state = [], action) => {
    switch (action.type) {
        case sF.set_store_fronts:
            return [...action.value];
        default:
            return [...state]
    }
}
