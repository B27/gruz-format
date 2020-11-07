import 'react-native-gesture-handler';
import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

LogBox.ignoreLogs([
    'currentlyFocusedField is deprecated and will be removed in a future release. Use currentlyFocusedInput',
]);

AppRegistry.registerComponent(appName, () => App);
