export const createRequestPromise = async (url: string, method: string, body: unknown, isProtected = false) => {
    const authHeaders = await getAuthHeaders(isProtected);
    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders
        } as HeadersInit,
        body: JSON.stringify(body),
    });
    return response.json();
}

const getAuthHeaders = async (isProtected: boolean) => {
    const token = localStorage.getItem('token');
    if (isProtected)
        return {
            'Authorization': `Bearer ${token}`
        }
    else {
        return {}
    }
}