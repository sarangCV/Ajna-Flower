import {baseUrl} from '../configuration';

export const assignCalculatedPrice = async (clientId, itemsPricing, token) => {
    const URL = `${baseUrl}/master/pricing/store`;
    const requestOptions = {
        method: 'post',
        headers: {Accept: 'application/json', 'Content-Type': 'application/json', token},
        body: JSON.stringify({clientId, itemsPricing})

    };

    return await fetch(URL, requestOptions)
        .then((response) => response.json())
        .then((resData) => {
            return resData;
        });
};

