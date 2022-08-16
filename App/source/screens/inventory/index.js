import React from 'react';
import moment from 'moment';
import {View, ScrollView, StyleSheet} from 'react-native';
import Card from '../../components/Card';

moment.locale('en-IN');

const Inventory = ({navigation}) => {

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.cardGroup}>
                    <Card
                        align='left'
                        navigation={navigation}
                        navigationTo='Boxes'
                        title='Boxes'
                        details='Add & view boxes'
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

export default Inventory;
