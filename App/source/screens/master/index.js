import React from 'react';
import moment from 'moment';
import {View, ScrollView, StyleSheet} from 'react-native';
import Card from '../../components/Card';

moment.locale('en-IN');

const Master = ({navigation}) => {

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.cardGroup}>
                    <Card
                        align='left'
                        navigation={navigation}
                        navigationTo='Home'
                        title='Dispatch'
                        details='Manage & cancel dispatches'
                        color='#ffffff'/>
                    <Card
                        align='right'
                        navigation={navigation}
                        navigationTo='Home'
                        title='Tax & Gst'
                        details='Add & manage gst & taxes company wise'
                        color='#ffffff'/>
                </View>
                <View style={styles.cardGroup}>
                    <Card
                        align='left'
                        navigation={navigation}
                        navigationTo='Items'
                        title='Items'
                        details='View & Add Items'
                        color='#ffffff'/>
                    <Card
                        align='right'
                        navigation={navigation}
                        navigationTo='Clients'
                        title='Clients'
                        details='Add & View Clients'
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

export default Master;
