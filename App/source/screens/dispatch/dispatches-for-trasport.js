import React from 'react';
import moment from 'moment';
import {FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {fetchData} from '../../service/AsyncStorage';
import {authTokenKey} from '../../configuration';
import {getDispatches} from '../../api/dispatch';
import Loading from '../../components/Loading'

moment.locale('en-IN');

const MasterScreen = ({navigation}) => {
    const [loading, setLoading] = React.useState(true);
    const [dispatched, setDispatched] = React.useState(false);
    const [dispatchesData, setDispatchesData] = React.useState(null);
    const [dispatches, setDispatches] = React.useState(null);
    const [authToken, setAuthToken] = React.useState(null)

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getDispatchesList();
        });
        return unsubscribe;

    }, [navigation]);
    /* --------------------------------------- *
     *      Fetch all Dispatches from api      *
     * --------------------------------------- */

    const getDispatchesList = async () => {
        await fetchData(authTokenKey).then(async token => {
            setAuthToken(token)
            await getDispatchesData(token, dispatched)
        })
    }

    const getDispatchesData = async (token) => {
        setLoading(true)
        await getDispatches(token).then(async res => {
            const {success, dispatches} = await res;
            if (success) {
                await setDispatchesData(dispatches)
                await filterData(dispatched, dispatches)
            } else {
                alert(data.message)
            }
        })
    }




    const filterData = async (status, data) => {
        let newData = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].assigned === status) {
                newData.push(data[i]);
            }
        }
        await setDispatches(newData)
        await setLoading(false)
    }


    /* --------------------------------------- *
     *    On Click go to assign box to clients *
     * --------------------------------------- */
    const onPressDispatch = async (dispatchesId, assigned, time) => {
        if (assigned) {
            alert('Action not allowed')
        } else {
            await navigation.navigate('TransportDetails', {dispatchId: dispatchesId, authToken})
        }
    }

    /* --------------------------------------- *
     *     Dispatch tem card                   *
     * --------------------------------------- */
    const dispatchItem = ({item}) => {
        const {id, time, boxes, assigned} = item
        return (
            <TouchableOpacity key={item.id} style={styles.item} onPress={() => onPressDispatch(id, assigned,time)}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={[styles.circle, {backgroundColor: assigned ? 'green' : 'black'}]}>
                        <Text style={[styles.title, {fontWeight: assigned ? '100' : 'bold'}]}>{moment(time).format('Do')}</Text>
                        <Text style={[styles.title, {fontSize: 12}]}>{moment(time).format('MMM')}</Text>
                    </View>
                    <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={[styles.date, {fontWeight: assigned ? '100' : 'bold'}]}>{boxes} Boxes</Text>
                    </View>
                    <TouchableOpacity style={styles.btnDetails} onPress={() => navigation.navigate('DispatchDetails', {authToken, id})}>
                        <Text>Details</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => onPressDispatch(id, assigned, time)} style={styles.boxToSeller}>
                    <Text style={styles.dispatcher}> {assigned ? 'Assign Price' : 'Add transport details'}</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        )
    };
    return (
        <>
            <SafeAreaView style={styles.container}>
                {loading ? <Loading text='Loading data, please wait..!'/> : <FlatList data={dispatches} renderItem={dispatchItem} keyExtractor={item => item.id}/>}
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    tabBtn: {
        flex: 1,
        minHeight: 40,
        // borderRadius:5,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'black'
    },
    btnDetails: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dadada',
        margin: 10,
        padding: 5,
        borderRadius: 5
    },
    container: {
        flex: 1,
        backgroundColor: '#ececec',
        padding: 5
    },
    item: {
        // height: 100,
        justifyContent: 'center',
        margin: 5,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'white',
        borderRadius: 5
    },
    circle: {
        // backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        borderRadius: 100
    },
    title: {
        color: '#fff',
        fontSize: 15
    },
    date: {
        color: 'black',
        fontSize: 18,
    },
    dispatcher: {
        color: '#000',
        fontSize: 14,
        textTransform: 'uppercase'
    },
    boxToSeller: {
        borderTopColor: '#c5c5c5',
        alignItems: 'center',
        borderTopWidth: 0.5,
        padding: 5,
        marginTop: 8,
    }

});

export default MasterScreen;
