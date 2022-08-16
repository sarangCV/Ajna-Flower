import React from 'react';
import {BackHandler, ScrollView, StyleSheet, View} from 'react-native';
import Headers from '../../components/Home/Headers'
import Card from '../../components/Card'

const HomeScreen = ({navigation}) => {

    // const [page, ] = React.useState('home');

    React.useEffect(() => {
        backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            BackHandler.exitApp();
        });
    }, [])
    return (
        <>
            <Headers navigation={navigation}/>
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.cardGroup}>
                        <Card
                            align='left'
                            navigation={navigation}
                            navigationTo='Dispatch'
                            title='Add Dispatch'
                            details='Add dispatch items & transport details'
                            color='#ffffff'/>
                        <Card
                            align='right'
                            navigation={navigation}
                            navigationTo='Dispatches'
                            title='Dispatches'
                            details='view and manage dispatch'
                            color='#ffffff'/>
                    </View>

                    <View style={styles.cardGroup}>

                        <Card
                            align='left'
                            navigation={navigation}
                            navigationTo='Inventory'
                            title='Inventory'
                            details='add and manage daily expanses'
                            color='#ffffff'/>
                        <Card
                            align='right'
                            navigation={navigation}
                            navigationTo='Accounts'
                            title='Accounts'
                            details='Invoice, sails, payments & expenses'
                            color='#ffffff'/>
                    </View>


                    <View style={styles.cardGroup}>
                        <Card
                            align='left'
                            navigation={navigation}
                            navigationTo='Master'
                            title='Master'
                            details='Manage, dispatch, tax & more'
                            color='#ffffff'/>
                        <Card
                            align='right'
                            navigation={navigation}
                            navigationTo='Reports'
                            title='Reports'
                            details='get all reports'
                            color='#ffffff'/>
                    </View>

                    <View style={styles.cardGroup}>
                        <Card
                            align='left'
                            navigation={navigation}
                            navigationTo='DispatchesViewOnly'
                            title='Add Transport'
                            details='Add transport details'
                            color='#ffffff'/>
                        <Card
                            align='right'
                            navigation={navigation}
                            navigationTo='Expenses'
                            title='Expenses'
                            details='view and add expenses'
                            color='#ffffff'/>
                    </View>


                    <View style={{height: 20}}/>
                </ScrollView>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ececec',
        paddingHorizontal: 20,
    },
    title: {
        paddingTop: 20,
        minHeight: 30
    },
    textTitle: {
        fontSize: 24
    },
    cardGroup: {
        marginTop: 24,
        flexDirection: 'row'
    }
});

export default HomeScreen;
