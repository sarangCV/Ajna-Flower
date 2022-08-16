import { baseUrl } from "../configuration";

export const getBoxes = async (token) => {
    const URL = `${baseUrl}/boxes/status`;
    const requestOptions = {
        method: 'get',
        headers: {Accept: 'application/json', 'Content-Type': 'application/json', token}
    }

    return await fetch(URL, requestOptions).then(res => res.json()).then(resData => resData)
};

export const addBoxes = async (token, boxName, boxQty) => {
    const URL = `${baseUrl}/boxes`;
    const requestOptions = {
        method: 'post',
        headers: {Accept: 'application/json', 'Content-Type': 'application/json', token},
        body: JSON.stringify({boxName, boxQty})

    };
    return await fetch(URL, requestOptions).then((response) => response.json()).then((resData) => {
        console.log(resData)
        return resData;
    });
};