import React from 'react';
import moment from 'moment';
import {View, ScrollView, StyleSheet} from 'react-native';
import Card from '../../components/Card';

moment.locale('en-IN');

const Accounts = ({navigation}) => {

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.cardGroup}>
                    <Card
                        align='left'
                        navigation={navigation}
                        navigationTo='Invoice'
                        title='Invoice'
                        details='Generate and download invoice'
                        color='#ffffff'/>
                    <Card
                        align='right'
                        navigation={navigation}
                        navigationTo='Home'
                        title='Report'
                        details='View sails report by company'
                        color='#ffffff'/>
                </View>
                <View style={styles.cardGroup}>
                    <Card
                        align='left'
                        navigation={navigation}
                        navigationTo='Home'
                        title='Payments'
                        details='Add payment & expenses'
                        color='#ffffff'/>
                </View>

                <View style={{height: 20}}/>
            </ScrollView>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ececec',
        paddingHorizontal: 20,
    },
    cardGroup: {
        marginTop: 24,
        flexDirection: 'row'
    }
});

export default Accounts;
