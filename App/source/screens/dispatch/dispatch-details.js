import React from 'react'
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {getDispatchDetails} from '../../api/dispatch';
import Loading from '../../components/Loading';

const DispatchDetailsScreen = ({navigation, route}) => {

    const [dispatchDetailsList, setDispatchDetailsList] = React.useState(null);
    const [transportsList, setTransportsList] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const {authToken, id} = route.params;
        getDispatchList(authToken, id)
    }, []);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.buttonView}>
                    <TouchableOpacity style={[styles.deleteButton, {paddingLeft: 10}]}>
                        <Icon name='edit' size={28} color='blue'/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton}>
                        <Icon name='delete-forever' size={30} color='red'/>
                    </TouchableOpacity>
                </View>
            )
        })
    }, [navigation])

    const getDispatchList = async (authToken, dispatchId) => {
        await getDispatchDetails(authToken, dispatchId).then((res) => {
            const {success, data, message} = res;
            console.log(data.dispatches)
            if (success) {
                setDispatchDetailsList(data.dispatches);
                setTransportsList(data.transports);
                setLoading(false);
            } else {
                alert(message);
            }
            console.log(dispatchDetailsList)
            console.log(transportsList)

        })
    };

    return (
        <>
            {loading ? <Loading text='Loading box data...'/> : (
                <>
                    <View style={styles.itemView}>
                        <View style={styles.itemContainer}>
                            {dispatchDetailsList && dispatchDetailsList.map((item) => {
                                return (
                                    <View style={styles.selectedItems}>
                                        <Text>ID : {item.id}</Text>
                                      <View style={{flexDirection:'column'}}>
                                          {item.items&&item.items.map(d=><Text>{d}</Text>)}
                                      </View>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                    <ScrollView>
                        <View style={styles.transportView}>
                            {transportsList && transportsList.map((item) => {
                                return (
                                    <View style={styles.transportItem}>
                                        <View style={styles.transportItemHeader}>
                                            <Text style={{color: '#fff', fontSize: 16}}>Transport Details</Text>
                                        </View>
                                        <View style={styles.transportItemContainer}>
                                            <View style={styles.selectedItems}>
                                                <Text style={{marginBottom: 5}}>Contact person / Driver Name</Text>
                                                <Text style={{color: '#6e6e6e'}}>{item.contact_person}</Text>
                                            </View>
                                            <View style={styles.selectedItems}>
                                                <Text style={{marginBottom: 5}}>Contact Number</Text>
                                                <Text style={{color: '#6e6e6e'}}>{item.contact_number}</Text>
                                            </View>
                                            <View style={styles.selectedItems}>
                                                <Text style={{marginBottom: 5}}>Vehicle Number</Text>
                                                <Text style={{color: '#6e6e6e'}}>{item.vehicle_no}</Text>
                                            </View>
                                            <View style={styles.selectedItems}>
                                                <Text style={{marginBottom: 5}}>Vehicle Type</Text>
                                                <Text style={{color: '#6e6e6e'}}>{item.vehicle_type}</Text>
                                            </View>
                                            <View style={styles.selectedItems}>
                                                <Text style={{marginBottom: 5}}>Note / Additional Details</Text>
                                                <Text style={{color: '#6e6e6e'}}>{item.note}</Text>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                    </ScrollView>
                </>
            )}


        </>
    )
}

const styles = StyleSheet.create({
    buttonView: {
        // width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        // paddingVertical: 10,
        // backgroundColor: 'yellow',
        marginRight: 10
    },
    deleteButton: {
        // position: 'absolute',
        // bottom: 20,
        // right: 10,
        flex: 1,
        height: 35,
        width: 40,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        alignSelf: 'flex-end',
        // borderWidth: 1,
        // marginHorizontal: 5,
        // marginVertical: 5
    },
    transportView: {
        flex: 1,
        padding: 20,
        paddingTop: 0,
    },
    itemView: {
        borderRadius: 5,
        marginHorizontal: 20,
        marginTop: 20,
        padding: 10,
        marginBottom: 20,
        backgroundColor: '#fff'

    },
    transportItem: {

        borderRadius: 5,
        marginBottom: 25,
        backgroundColor: '#fff',
    },
    transportItemHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        backgroundColor: '#000',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    transportItemContainer: {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        padding: 5,
    },
    selectedItems: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: .5,
        borderColor: '#c5c5c5',
        paddingVertical: 5,
        paddingHorizontal: 20
    },

});

export default DispatchDetailsScreen
