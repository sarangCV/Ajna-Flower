import {AppRegistry} from 'react-native';
import 'react-native-gesture-handler';
import Root from './source/Navigation';
// import Test from './source/screens/inventory';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Root);
