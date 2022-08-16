import React from 'react'
import {DefaultTheme, NavigationContainer,} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Splash from './screens/splash';
import Login from './screens/auth';
import Home from './screens/home';
import Dispatch from './screens/dispatch';
import TransportDetails from './screens/dispatch/transport-details';
import Dispatches from './screens/dispatch/dispatches';
import DispatchDetailsScreen from './screens/dispatch/dispatch-details';
import AssignItems from './screens/dispatch/assign/items-to-client';
import ItemPrice from './screens/dispatch/assign/item-price';
import DispatchesViewOnly from './screens/dispatch/dispatches-for-trasport'

import Accounts from './screens/accounts';
import Invoice from './screens/inventory/invoice';


import Master from './screens/master';
import Items from './screens/master/item-details';
import AddItems from './screens/master/item-details/add-items';

import Clients from './screens/master/cilents/index';
import AddClients from './screens/master/cilents/add-client';

import Inventory from './screens/inventory';
import Boxes from './screens/inventory/boxes';
import AddBoxes from './screens/inventory/boxes/addBoxes';

import GeneratedInvoice from './screens/inventory/invoice/generated-invoice';
import Settings from './screens/settings';

import Expenses from './screens/expenses';

import Reports from './screens/reports';
import ViewReports from './screens/reports/view-reports';


const Stack = createStackNavigator();


const config = {
    animation: 'spring',
    config: {
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
        animationEnabled: true,
        animationTypeForReplace: 'push',
        gestureResponseDistance: 'horizontal'
    },
};


const Routes = () => {
    return (
        <NavigationContainer theme={DefaultTheme}>
            <Stack.Navigator initialRouteName='Splash'>

                {/*--------------- General Navigation  ---------------*/}
                <Stack.Screen name='Splash' component={Splash} options={{headerShown: false, transitionSpec: {open: config, close: config}}}/>
                <Stack.Screen name='Login' options={{headerShown: false, transitionSpec: {open: config, close: config}}} component={Login}/>
                <Stack.Screen name='Home' options={{headerShown: false, transitionSpec: {open: config, close: config}}} component={Home}/>

                {/*--------------- Dispatch Navigation ---------------*/}
                <Stack.Screen name='Dispatch' options={{headerShown: false, title: 'Dispatch Items', transitionSpec: {open: config, close: config}}} component={Dispatch}/>
                <Stack.Screen name='TransportDetails' options={{headerShown: true, title: 'Add Transport details', transitionSpec: {open: config, close: config}}} component={TransportDetails}/>
                <Stack.Screen name='Dispatches' options={{headerShown: true, title: 'Dispatches', transitionSpec: {open: config, close: config}}} component={Dispatches}/>
                <Stack.Screen name='DispatchesViewOnly' options={{headerShown: true, title: 'Dispatches List', transitionSpec: {open: config, close: config}}} component={DispatchesViewOnly}/>

                <Stack.Screen name='DispatchDetails' options={{headerShown: true, title: 'Dispatch Details', transitionSpec: {open: config, close: config}}} component={DispatchDetailsScreen}/>
                <Stack.Screen name='AssignItems' options={{headerShown: true, title: 'Assign Box to seller', transitionSpec: {open: config, close: config}}} component={AssignItems}/>
                <Stack.Screen name='AssignPrice' options={{headerShown: true, title: 'Assign and calculate price', transitionSpec: {open: config, close: config}}} component={ItemPrice}/>


                {/*--------------- Accounts Navigation ---------------*/}
                <Stack.Screen name='Accounts' options={{headerShown: true, title: 'Accounts', transitionSpec: {open: config, close: config}}} component={Accounts}/>
                <Stack.Screen name='Invoice' options={{headerShown: true, title: 'Invoice', transitionSpec: {open: config, close: config}}} component={Invoice}/>
                <Stack.Screen name='GeneratedInvoice' options={{headerShown: true, title: 'GeneratedInvoice', transitionSpec: {open: config, close: config}}} component={GeneratedInvoice}/>
                <Stack.Screen name='Master' options={{headerShown: true, title: 'Master', transitionSpec: {open: config, close: config}}} component={Master}/>
                <Stack.Screen name='Settings' options={{headerShown: true, transitionSpec: {open: config, close: config}}} component={Settings}/>

                {/* Inventory Navigation */}
                <Stack.Screen name='Inventory' options={{headerShown: true, title: 'Inventory', transitionSpec: {open: config, close: config}}} component={Inventory}/>
                <Stack.Screen name='Boxes' options={{headerShown: true, title: 'Boxes', transitionSpec: {open: config, close: config}}} component={Boxes}/>
                <Stack.Screen name='AddBoxes' options={{headerShown: true, title: 'Add Boxes', transitionSpec: {open: config, close: config}}} component={AddBoxes}/>

                {/* Master Navigation */}
                <Stack.Screen name='Items' options={{headerShown: true, title: 'Items', transitionSpec: {open: config, close: config}}} component={Items}/>
                <Stack.Screen name='AddItems' options={{headerShown: true, title: 'Add Items', transitionSpec: {open: config, close: config}}} component={AddItems}/>
                <Stack.Screen name='Clients' options={{headerShown: true, title: 'Clients', transitionSpec: {open: config, close: config}}} component={Clients}/>
                <Stack.Screen name='AddClients' options={{headerShown: true, title: 'Add Clients', transitionSpec: {open: config, close: config}}} component={AddClients}/>

                {/* Expenses Navigation */}
                <Stack.Screen name='Expenses' options={{headerShown: true, title: 'Expenses', transitionSpec: {open: config, close: config}}} component={Expenses}/>

                {/* Reports Navigation */}
                <Stack.Screen name='Reports' options={{headerShown: true, title: 'Reports', transitionSpec: {open: config, close: config}}} component={Reports}/>
                <Stack.Screen name='ViewReports' options={{headerShown: true, title: 'View Reports', transitionSpec: {open: config, close: config}}} component={ViewReports}/>


            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Routes;

