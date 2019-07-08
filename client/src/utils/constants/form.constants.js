export const initialFormInputState = {
    value: "", faulty: false, error: ""
}

export const cleanWhiteSpaces = text => (text.replace(/^ +$/, ""));