import { baseUrl, headers } from '../configuration/index';

export const validateUser = async (loginId, loginPassword) => {

//fetching data from the api
    const URL = `${baseUrl}/auth/login`;
    const requestOptions = {
        method: 'post',
        headers: headers,
        body: JSON.stringify({
            loginId,
            loginPassword
        })
    };

    return await fetch(URL, requestOptions)
    .then((response) => response.json())
    .then((resData) => {
        return resData;
    });
};
