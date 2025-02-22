import { API_URL } from "$lib/constants";
import { createRequestPromise } from ".";

export const loginUser = async (username: string, password: string) => {
    try {
        const response = await createRequestPromise(`${API_URL}auth/login`, 'POST', {  username, password });
        return response;
    }
    catch (error) {
        return error;
    }
}

export const registerUser = async (
    email: string,
    password: string,
    username: string,
    phone: string,
    first_name: string,
    last_name: string,
) => {
    try {
        const response = await createRequestPromise(`${API_URL}auth/register`, 'POST',
            {
                email,
                password,
                username,
                phone,
                first_name,
                last_name
            });
        return response;
    }
    catch (error) {
        return error;
    }
}