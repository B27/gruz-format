import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import RepoDetailScreen from '../screens/RepoDetailScreen';
import RepoListScreen from '../screens/RepoListScreen';
import SignInScreen from '../screens/SignInScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import AppLoadingScreen from '../screens/AppLoadingScreen';
import SmsScreen from '../screens/SmsScreen';
import UserInfoScreen from '../screens/UserInfoScreen';
import DocumentsScreen from '../screens/DocumentsScreen';
import EditUserScreen from '../screens/EditUserScreen';
import EditCarScreen from '../screens/EditCarScreen';
import { Dimensions } from 'react-native';

const {height, width} = Dimensions.get('window');

const AppStack = createStackNavigator({ //основной стек авторизованного пользователя
    Home: AppLoadingScreen,//???
    Detail: RepoDetailScreen,
    UserInfo: UserInfoScreen,//регистрация и рабочие страницы должны находиться в свиче
});

const AuthStack = createStackNavigator({ //стэк аутентификации
    SignIn: SignInScreen,
    Sms: SmsScreen,
    RegisterPerson: EditUserScreen,
    Documents: DocumentsScreen,
    EditCar: EditCarScreen
},
    {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#FFC234',
                textAlign: 'center',
                height: 0.10*height,
                textAlign: 'center',
            },           
        }
    });


export default createAppContainer(createSwitchNavigator( //свитч проверки авторизации
    {
        AuthLoading: AuthLoadingScreen,
        App: AppStack,
        Auth: AuthStack
    },
    {
        initialRouteName: 'AuthLoading',

    }
));