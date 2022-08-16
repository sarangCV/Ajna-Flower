import { baseUrl, headers } from '../configuration/index';

export const getCategory = async (token) => {

//fetching data from the api
    const URL = `${baseUrl}/items-list`;
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

// Add Category to list
export const addItems = async (token, itemName, qtyPerBunch) => {
    const URL = `${baseUrl}/items-list`;
    const requestOptions = {
        method: 'post',
        headers: {Accept: 'application/json', 'Content-Type': 'application/json', token},
        body: JSON.stringify({itemName, qtyPerBunch})

    };
    return await fetch(URL, requestOptions).then((response) => response.json()).then((resData) => {
        console.log(resData)
        return resData;
    });
};

export const deleteItem = async (token, id) => {
        const URL = `${baseUrl}/items-list/delete/${id}`;
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
