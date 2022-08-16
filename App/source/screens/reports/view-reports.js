import React from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native';
import moment from 'moment';
import Loading from '../../components/Loading';

const ViewReports = ({route}) => {

    const [loading, setLoading] = React.useState(true);
    const [authToken, setAuthToken] = React.useState(null);
    const [reportData, setReportData] = React.useState(null);

    React.useEffect(() => {
        if (route.params) {
            setReportData(route.params)
            setLoading(false);
        }
    }, [])

    const reportItem = ({item}) => {
        const {d_date, d_boxes, d_total} = item;
        return(
            <View key={item.id} style={styles.item}>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                    <View style={[styles.circle, {backgroundColor:'black'}]}>
                        <Text style={[styles.title, {fontWeight: '100'}]}>{moment(d_date).format('Do')}</Text>
                        <Text style={[styles.title, {fontSize: 12}]}>{moment(d_date).format('MMM')}</Text>
                    </View>
                    <View style={{flex: 2, alignItems: 'flex-start', marginLeft: 10, justifyContent: 'center'}}>
                        <View>
                            <Text style={[styles.date]}> Boxes : {d_boxes ? d_boxes : 'No boxes'}</Text>
                            <Text style={[styles.date]}> Total : {d_total ? d_total : 0} ₹ </Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    };
   
    return (
        <View style={styles.container}>
           {loading ? <Loading/> : 
           (
               <>
                    <View style={styles.topView}>
                        <View style={{ flexDirection: 'row', margin: 5, padding: 5}}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Boxes : {reportData.boxesCount ? reportData.boxesCount : 'no boxes'}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', margin: 5, padding: 5}}>
                            <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Total : {reportData.totalAmount ? reportData.totalAmount : 'no amount'} ₹ </Text>
                        </View>
                    </View>
                    <FlatList
                        data={reportData.detailedData}
                        renderItem={reportItem}
                    />
                </>
           )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ececec',
        padding: 15
    },
    topView: {
        flexDirection: 'row', 
        margin: 5, 
        marginBottom: 15, 
        backgroundColor: '#fff', 
        borderRadius: 5, 
        justifyContent: 'space-between'
    },
    item: {
        height: 100,
        justifyContent: 'center',
        margin: 5,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    circle: {
        backgroundColor: 'black',
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
        fontSize: 16,
    },
});

export default ViewReports
