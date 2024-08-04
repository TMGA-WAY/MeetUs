export function isEmpty(val){
    return val.trim().length ===0;
}

export function isValidEmail(val){
    return new RegExp("[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}").test(val);
}

