import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue = "") {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error("Error reading localStorage key ", key, error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error("Error setting localStorage key ", key, error);
        }
    }, [key, storedValue]);

    const setValue = (value) => {
        setStoredValue(value);
        localStorage.setItem(key, JSON.stringify(value));
    };

    const removeValue = () => {
        try {
            window.localStorage.removeItem(key);
            setStoredValue(initialValue);
        } catch (error) {
            console.error("Error removing localStorage key ", key, error);
        }
    };

    return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
