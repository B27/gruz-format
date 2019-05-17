import {
    createSwitchNavigator,
    createStackNavigator,
    createAppContainer,
    createDrawerNavigator
} from 'react-navigation';
import RepoDetailScreen from '../screens/RepoDetailScreen';
import OrderListScreen from '../screens/OrderList';
import RepoListScreen from '../screens/RepoListScreen';
import SignInScreen from '../screens/SignInScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import AppLoadingScreen from '../screens/AppLoadingScreen';
import SmsScreen from '../screens/SmsScreen';
import React from 'react';
import UserInfoScreen from '../screens/UserInfoScreen';
import DocumentsScreen from '../screens/DocumentsScreen';
import EditUserScreen from '../screens/EditUserScreen';
import EditCarScreen from '../screens/EditCarScreen';
import MainScreen from '../screens/MainScreen';
import InstructionScreen from '../screens/InstructionScreen';
import BalanceScreen from '../screens/BalanceScreen';
import RobokassaScreen from '../screens/RobokassaScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import AppDrawer from './AppDrawer';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const { height, width } = Dimensions.get('window');

function IconMenuItem({ tintColor, name }) {
    return <Icon name={name} size={24} style={{ color: tintColor }} />;
}

const InstructionsStack = createStackNavigator(
    {
        Instructions: InstructionScreen
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#FFC234',
                textAlign: 'center',
                height: 0.1 * height,
                textAlign: 'center'
            }
        }
    }
);

const AppStack = createDrawerNavigator(
    {
        //основной стек авторизованного пользователя
        //   Home: AppLoadingScreen,  // эта штука сломала навигацию, раcкомментировать ЗАПРЕЩЕНО

        Main: {
            screen: createStackNavigator(
                {
                    Main: MainScreen,
                    Balance: BalanceScreen,
                    Robokassa: RobokassaScreen,
                    OrderDetail: OrderDetailScreen
                },
                {
                    defaultNavigationOptions: {
                        headerStyle: {
                            backgroundColor: '#FFC234',
                            textAlign: 'center'
                        }
                    }
                }
            ),
            navigationOptions: {
                drawerLabel: 'Заявки',
                drawerIcon: <IconMenuItem name='inbox' />
            }
        },
        Page2: {
            screen: OrderListScreen,
            navigationOptions: {
                drawerLabel: 'Мои заказы',
                drawerIcon: <IconMenuItem name='truck' />
            }
        },
        Page4: {
            screen: MainScreen,
            navigationOptions: {
                drawerLabel: 'Моё авто',
                drawerIcon: <IconMenuItem name='wrench' />
            }
        },
        Page5: {
            screen: RepoDetailScreen,
            navigationOptions: {
                drawerLabel: 'Настройки',
                drawerIcon: <IconMenuItem name='gear' />
            }
        },
        Page6: {
            screen: InstructionsStack,
            navigationOptions: {
                drawerLabel: 'Инструкции',
                drawerIcon: <IconMenuItem name='info-circle' />
            }
        }
    },
    {
        drawerWidth: width * 0.8,
        contentComponent: AppDrawer,
        contentOptions: {
            activeBackgroundColor: 'transparent',
            activeTintColor: 'black'
            /*       iconContainerStyle: {
        width: 45,
        border: 2
      } */
        }
    }
);

const AuthStack = createStackNavigator(
    {
        //стэк аутентификации
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
                height: 0.1 * height,
                textAlign: 'center'
            }
        }
    }
);

export default createAppContainer(
    createSwitchNavigator(
        //свитч проверки авторизации
        {
            AuthLoading: AuthLoadingScreen,
            App: AppStack,
            Auth: AuthStack
        },
        {
            initialRouteName: 'AuthLoading'
        }
    )
);
