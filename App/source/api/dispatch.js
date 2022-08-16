import {baseUrl} from '../configuration';

export const dispatchData = async (dispatchAt, dispatchItem, token) => {
    const URL = `${baseUrl}/dispatch`;
    const requestOptions = {
        method: 'post',
        headers: {Accept: 'application/json', 'Content-Type': 'application/json', token},
        body: JSON.stringify({
            dispatchAt,
            dispatchItem
        })
    };

    return await fetch(URL, requestOptions)
        .then((response) => response.json())
        .then((resData) => {
            return resData;
        });
};


export const getDispatches = async (token) => {
    const URL = `${baseUrl}/dispatch`;
    const requestOptions = {
        method: 'get',
        headers: {Accept: 'application/json', 'Content-Type': 'application/json', token: token},
    };
    return await fetch(URL, requestOptions).then((response) => response.json()).then((resData) => {
        return resData;
    });
};


export const assignItems = async (dispatchId, clientId, assignedItems, token) => {
    const URL = `${baseUrl}/master/assign-item`;
    const requestOptions = {
        method: 'post',
        headers: {Accept: 'application/json', 'Content-Type': 'application/json', token},
        body: JSON.stringify({dispatchId, clientId, assignedItems})
    };
    return await fetch(URL, requestOptions).then((response) => response.json()).then((resData) => {
        console.log(resData)
        return resData;
    });
};

/* ----------------------------------------- *
 *GET DISPATCH ITEM (NOT ASSIGNED TO CLIENTS)*
 * ----------------------------------------- */
export const getDispatchItem = async (id, token) => {
    const URL = `${baseUrl}/dispatch/dispatch-item`;
    const requestOptions = {
        method: 'get',
        headers: {Accept: 'application/json', 'Content-Type': 'application/json', id, token},
    };

    return await fetch(URL, requestOptions).then((response) => response.json()).then((resData) => {
        return resData;
    });
};

/* ----------------------------------------- *
 * GET DISPATCH ITEM (ASSIGNED TO CLIENTS)   *
 * ----------------------------------------- */
export const getDispatchedItem = async (id, token) => {
    const URL = `${baseUrl}/dispatch/dispatched-item`;
    const requestOptions = {
        method: 'get',
        headers: {Accept: 'application/json', 'Content-Type': 'application/json', id, token},
    };

    return await fetch(URL, requestOptions).then((response) => response.json()).then((resData) => {
        return resData;
    });
};

// GET DISPATCH DETAILS
export const getDispatchDetails = async (token, dispatchId) => {
    const URL = `${baseUrl}/dispatch/dispatch-details/${dispatchId}`;
    const requestOptions = {
        method: 'get',
        headers: {Accept: 'application/json', 'Content-type': 'application/json', token},
    };
    return await fetch(URL, requestOptions).then((response) => response.json()).then((resData) => {
        return resData;
    });
};
