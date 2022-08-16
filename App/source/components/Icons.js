import React from 'react';
import {Image} from 'react-native';

const Icon = (props) => {
    const {name, size} = props;
    let dimension = 1
    if (size) {
        dimension = size
    }
    const iconStyle = {
        width: 20 * dimension, height: 20 * dimension
    }
    return <Image style={iconStyle} source={{uri: name}}/>
};
export default Icon;
