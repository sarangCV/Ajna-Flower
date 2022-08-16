import { baseUrl, headers } from '../configuration/index';

export const getClientsList = async (token) => {

    const URL = `${baseUrl}/clients-list`;
    const requestOptions = {
        method: 'get',
        headers: {Accept: 'application/json', 'Content-Type': 'application/json', token},
    };

    return await fetch(URL, requestOptions)
    .then((response) => response.json())
    .then((resData) => {
        return resData;
    });
};

// Add clients to list
export const addClients = async (token, clientDetails) => {
    const URL = `${baseUrl}/clients-list`;
    const requestOptions = {
        method: 'post',
        headers: {Accept: 'application/json', 'Content-Type': 'application/json', token},
        body: JSON.stringify(clientDetails)

    };
    return await fetch(URL, requestOptions).then((response) => response.json()).then((resData) => {
        console.log(resData)
        return resData;
    });
};

// delete clients from the list
export const delteClients = async (token, id) => {
    const URL = `${baseUrl}/clients-list/delete/${id}`;
    const requestOptions = {
        method: 'get',
        headers: {Accept: 'application/json', 'Content-Type': 'application/json', token: token},
    };

    return await fetch(URL, requestOptions)
    .then((response) => response.json())
    .then((resData) => {
        return resData;
    });
};
