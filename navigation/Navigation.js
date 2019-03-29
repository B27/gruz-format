import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import RepoDetailScreen from '../screens/RepoDetailScreen';
import RepoListScreen from '../screens/RepoListScreen';
import SignInScreen from '../screens/SignInScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import AppLoadingScreen from '../screens/AppLoadingScreen';
import SmsScreen from '../screens/SmsScreen';
import UserInfoScreen from '../screens/UserInfoScreen';

const AppStack = createStackNavigator({ 
    Home: AppLoadingScreen,
    Detail: RepoDetailScreen,
    UserInfo: UserInfoScreen,//регистрация и рабочие страницы должны находиться в свиче
});

const AuthStack = createStackNavigator({
    SignIn: SignInScreen,
    Sms: SmsScreen
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