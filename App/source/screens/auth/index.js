import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Image, TouchableWithoutFeedback, Keyboard, StatusBar, BackHandler } from 'react-native';
import { validateUser } from '../../api/auth';
import { storeData, fetchData } from '../../service/AsyncStorage';
import style from './style';
import { icon, col_p, authTokenKey, authDataKey } from '../../configuration';

const LoginScreen = ({ navigation }) => {
    const [ loginId, setLoginId ] = useState('prashant');
    const [ loginPassword, setLoginPassword ] = useState('password');
    const [ errorMessage, setErrorMessage ]  = useState('')

    React.useEffect(() => {
        backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            BackHandler.exitApp();
        });
    }, [])

    // Posting data to the api
    const validate = () => {
        validateUser(loginId, loginPassword)
        .then((res) => {
            const {success, userData} = res;
            if (success) {
                storeData(authTokenKey, userData.userToken)
                .then(() => console.log('token saved to local storage..'))
                storeData(authDataKey, userData)
                .then(() => {console.log('userdata saved to local storage..'), navigation.navigate('Home')})
            } else {
                setErrorMessage(res.message)
            }
        })
        .then(Keyboard.dismiss)
        .catch((error) => {
            console.error(error);
        })
    };  
       
    return(
        <TouchableWithoutFeedback onPress = { Keyboard.dismiss }>
            <KeyboardAvoidingView style = { style.container }>
                <StatusBar barStyle = 'dark-content' backgroundColor = '#fff'/>
                <Image source = {{ uri: icon }} style = { styles.logo }/>
                <View style = { styles.inputView }>
                    <Text style = { styles.title }>Login to continue</Text>
                    <TextInput style = { styles.input } placeholder = "Enter your loginid" onChangeText = { setLoginId } autoCapitalize = "none" autoCorrect = { false } multiline = { false } returnKeyType = "done" autoCompleteType = "off" value = { loginId }/>
                    <TextInput style = { styles.input } placeholder = "Enter your password" onChangeText = { setLoginPassword } autoCapitalize = "none" autoCorrect = { false } multiline = { false } returnKeyType = "done" secureTextEntry = { true } value = { loginPassword }/>
                    { errorMessage ? <Text style = { styles.errorMessage }>{errorMessage}</Text> : null }
                    <TouchableOpacity style = { styles.button } onPress = { validate }>
                        <Text style = { styles.buttonText }>Login</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>

    );
};

const styles = StyleSheet.create({
   
    title: {
        fontSize: 25,
        color: '#555',
        marginBottom: 10,
    },
    logo: {
        position: 'absolute',
        top: '12%',
        height: 180,
        width: 180,
        
    },
    inputView: {
        width: '100%',
        alignItems: 'center',
        position: 'absolute',
        bottom: '5%',
    },
    input: {
        borderWidth: 2,
        borderColor: col_p,
        height: 50,
        width: '100%',
        margin: 12,
        padding: 10,
        borderRadius: 5
    },
    errorMessage: {
        color: '#cd3a3a',
    },
    button: {
        backgroundColor: col_p,
        height: 45,
        width: 150,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
        elevation: 1,
        marginTop: 20
    },
    buttonText: {
        color: '#fff'
    }
});

export default LoginScreen;