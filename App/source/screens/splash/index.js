import React, { useEffect } from 'react';
import {View, StyleSheet, StatusBar, Image} from 'react-native';
import {fetchData} from '../../service/AsyncStorage';
import {authTokenKey, icon} from '../../configuration/index';

const SplashScreen = ({navigation}) => {
    useEffect( () => {
        routeValidate();
    }, []);
    // validating login
    const routeValidate = () => { 
        fetchData(authTokenKey).then((token)=> {
            if (token) {
                navigation.navigate('Home');
            } else {
                navigation.navigate('Login')
            }
        })
    };
    return (
        <View style={styles.container}>  
            <StatusBar barStyle='dark-content' backgroundColor='#fff'/>
            <Image style={styles.logo} source={{uri: icon}}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        width: 200,
        height: 200,
    }
});

export default SplashScreen;
