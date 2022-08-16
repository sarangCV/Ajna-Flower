import React from 'react';
import {Text, View, ActivityIndicator} from 'react-native';

const Loading = ({text}) => {
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size='large' color='gray'/>
            <Text style={{color: '#747474', fontSize: 18}}>{text}</Text>
        </View>
    );
};
export default Loading;
