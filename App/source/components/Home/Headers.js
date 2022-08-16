import React from 'react';
import moment from 'moment'
import {StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {icon} from '../../configuration';
import Icons from '../Icons'

moment.locale('en-IN');

const Headers = ({navigation}) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle='dark-content' backgroundColor='#fff'/>
            <TouchableOpacity style={styles.left}>
                <Icons name={icon} size={2}/>
            </TouchableOpacity>
            <View style={styles.center}>
                <Text style={styles.timeText}>{moment(Date()).format('Do MMM YY (ddd)')}</Text>
            </View>
            <TouchableOpacity style={styles.right} onPress={() => navigation.navigate('Settings')}>
                <Icon name='settings' size={30} color='black' />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical:10,
        paddingHorizontal:20,
        // width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:'#fff'
    },
    left: {
        width: '30%',
    },
    center: {
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    right: {
        width: '30%',
        alignItems: 'flex-end',
    },
    timeText: {
        fontSize: 15,
    }
});

export default Headers;
