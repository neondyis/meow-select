export const saveToStorage = (key: string, value: any) => {
    if(typeof window !== 'undefined') {
        return window.localStorage.setItem(key, value);
    }
}

// get from storage
export const getFromStorage = (key: string): any => {
    if (typeof window !== 'undefined') {
        return window.localStorage.getItem(key);
    }
}

export const removeFromStorage = (key: string): any => {
    if (typeof window !== 'undefined') {
        return window.localStorage.removeItem(key);
    }
}