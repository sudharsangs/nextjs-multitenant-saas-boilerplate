export const createRequestPromise = async (url: string, method: string, body: unknown) => {
    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });
    return response.json();
}