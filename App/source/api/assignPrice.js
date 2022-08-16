import { baseUrl } from '../configuration';

export const assignPrice = async (assignedPrice, token) => {
    const URL = `${baseUrl}/master/pricing/calculator`;
    const requestOptions = {
        method: 'post',
        headers: {Accept: 'application/json', 'Content-Type': 'application/json',token},
        body: JSON.stringify(assignedPrice)
        
    };

    return await fetch(URL, requestOptions)
    .then((response) => response.json())
    .then((resData) => {
        return resData;
    });
};

