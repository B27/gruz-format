import { createStackNavigator, createAppContainer } from 'react-navigation';
import RepoDetail from '../screens/RepoDetail';
import RepoList from '../screens/RepoList';
import Tabs from '../navigation/TabNavigation'
export const Stack = createStackNavigator({
    Home: RepoList,
    Detail: RepoDetail
},
{
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: '#f4511e'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold'
        }
    }
});

export default createAppContainer(Stack);