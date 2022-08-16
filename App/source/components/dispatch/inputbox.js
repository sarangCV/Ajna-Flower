import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
const InputBox = ({size, text, onChangeText, value, keyboardType, maxLength}) => {
    return(
        <View style={{...size, ...styles.inputBox}}>
            <TextInput
                onChangeText={onChangeText}
                placeholder={text}
                value={value}
                keyboardType={keyboardType}
                maxLength={maxLength}
                />
        </View>
    );

};

const styles = StyleSheet.create({
    inputBox: {
        height:45,
        paddingLeft:6,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#a2a2a2',
        borderRadius: 5,
    }
});

export default InputBox;
