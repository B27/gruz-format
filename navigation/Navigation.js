import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import RepoDetailScreen from '../screens/RepoDetailScreen';
import RepoListScreen from '../screens/RepoListScreen';
import SignInScreen from '../screens/SignInScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';

const AppStack = createStackNavigator({ 
    Home: RepoListScreen,
    Detail: RepoDetailScreen
});

const AuthStack = createStackNavigator({
    SignIn: SignInScreen
});

export default createAppContainer(createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        App: AppStack,
        Auth: AuthStack
    },
    {
        initialRouteName: 'AuthLoading'
    }
));