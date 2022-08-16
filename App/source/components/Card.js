import React from 'react';
import {TouchableOpacity, Text, View, StyleSheet} from 'react-native';

const Headers = (props) => {
    const {align, navigation, navigationTo, title, color, details} = props;
    const container = {
        width: '47.2%',
        minHeight: 100,
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: align == 'right' ? '5%' : 0,
        backgroundColor: color,
        borderRadius: 10,
        shadowColor: 'gray',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2,
        elevation: 3,
    }
    return (
        <TouchableOpacity style={container} onPress={() => navigation.navigate(navigationTo)}>
            <View style={styles.inner}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.details}>{details}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    inner: {
        flex: 1,
        width: '100%',
        resizeMode: 'stretch',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'

    },
    title: {
        position: 'absolute',
        top: 20,
        textAlign: 'center',
        color: '#424242',
        fontSize: 22,
        fontWeight: 'bold'
    },
    details: {
        position: 'absolute',
        top: 55,
        left: 10,
        right: 10,
        textAlign: 'center',
        color: '#868686',
        fontSize: 12,
    }
});

export default Headers;
