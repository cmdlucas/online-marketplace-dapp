import p from "../constant/profiles";

export const adminProfiles = (state = [], action) => {
    switch(action.type) {
        case p.set_admin:
            return [...action.value];
        default:
            return [...state];
    }
}

export const shopOwnersProfiles = (state = [], action) => {
    switch(action.type) {
        default:
            return [...state];
    }
}