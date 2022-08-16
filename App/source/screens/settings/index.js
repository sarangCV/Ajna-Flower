import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {clearData} from '../../service/AsyncStorage'

const SettingsScreen = ({navigation}) => {
    const logoutTapped = async () => {
        await clearData().then(async d => {
            await navigation.navigate('Login');
        })
    }

    return (
        <>
            <StatusBar barStyle='dark-content' backgroundColor='#fff'/>
            <SafeAreaView style={styles.container}>
                <TouchableOpacity style={styles.logoutButton} onPress={logoutTapped}>
                    <Text>Logout</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e5e3e3',
        alignItems:'center',
        justifyContent:'center'
    },
    logoutButton:{
        padding:20,
        backgroundColor: 'red',
        color:'white'
    }
});

export default SettingsScreen;
