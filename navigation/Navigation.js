import React from 'react';
import { Dimensions, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    createAppContainer,
    createDrawerNavigator,
    createStackNavigator,
    createSwitchNavigator,
    SafeAreaView,
} from 'react-navigation';
import { MenuIcon } from '../components/MenuIcon';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import BalanceScreen from '../screens/BalanceScreen';
import ChatScreen from '../screens/Chat';

import SignUpUserScreen from '../screens/SignUpUserScreen';
import InstructionScreen from '../screens/InstructionScreen';
import MainScreen from '../screens/MainScreen';
import MyAutoScreen from '../screens/MyAutoScreen';
import MyInfoScreen from '../screens/MyInfoScreen';
import MyDocsScreen from '../screens/MyDocumentsScreen';
import OrderCompleteScreen from '../screens/OrderCompleteScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import OrderPreviewScreen from '../screens/OrderPreviewScreen';
import PayScreen from '../screens/PayScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SignInScreen from '../screens/SignInScreen';
import WaitCompleteOrderScreen from '../screens/WaitCompleteOrder';
import AppDrawer from './AppDrawer';

const { height, width } = Dimensions.get('window');

function IconMenuItem({ tintColor, name }) {
    return <Icon name={name} size={24} style={{ color: tintColor }} />;
}

// добавляет высоту статусбара в SafeAreaView (используется в ActionBar) из react-navigation
// необходимо для отрисовки под прозрачным статусбаром, иначе статусбар перекрывает ActionBar
SafeAreaView.setStatusBarHeight(StatusBar.currentHeight);

const yellowHeader = {
    headerStyle: {
        backgroundColor: '#FFC234',
    },
};

const yellowHeaderWithHamburger = ({ navigation }) => {
    return Object.assign({}, yellowHeader, {
        headerLeft: <MenuIcon navigationProps={navigation} />,
        headerLeftContainerStyle: { paddingLeft: 8 },
    });
};

const yellowHeaderWithHamburgerAndBack = ({ navigation }) => {
    return Object.assign({}, yellowHeader, {
        headerLeft: <MenuIcon navigationProps={navigation} />,
        headerBackTitle: 'Назад',
        headerTruncatedBackTitle: 'Назад',
        headerLeftContainerStyle: { paddingLeft: 8 },
    });
};

const FulfillingOrderStack = createStackNavigator(
    {
        OrderDetail: OrderDetailScreen,
        OrderChat: ChatScreen,
        OrderComplete: OrderCompleteScreen,
    },
    { defaultNavigationOptions: yellowHeader },
);

const FulfillingOrderSwitch = createSwitchNavigator(
    {
        FulfillingOrder: FulfillingOrderStack,
        WaitCompleteOrder: WaitCompleteOrderScreen,
    },
    { defaultNavigationOptions: yellowHeader },
);

const MainStack = createStackNavigator(
    {
        Main: { screen: MainScreen, navigationOptions: yellowHeaderWithHamburgerAndBack },
        Balance: {
            screen: BalanceScreen,
            navigationOptions: { headerBackTitle: 'Назад', headerTruncatedBackTitle: 'Назад' },
        },
        Pay: PayScreen,
        OrderPreview: OrderPreviewScreen,
    },
    { defaultNavigationOptions: yellowHeader },
);

const MyInfoStack = createStackNavigator({
    MyInfo: {
        screen: MyInfoScreen,
        navigationOptions: yellowHeaderWithHamburger,
    },
});

const MyCarStack = createStackNavigator(
    {
        MyCar: {
            screen: MyAutoScreen,
            navigationOptions: yellowHeaderWithHamburger,
        },
    },
    {
        defaultNavigationOptions: {
            headerTitle: 'Мое авто',
        },
    },
);

const MyDocsStack = createStackNavigator(
    {
        MyDoc: {
            screen: MyDocsScreen,
            navigationOptions: yellowHeaderWithHamburger,
        },
    },
    {
        defaultNavigationOptions: {
            headerTitle: 'Мои документы',
        },
    },
);

const SettingsStack = createStackNavigator({
    Settings: {
        screen: SettingsScreen,
        navigationOptions: yellowHeaderWithHamburger,
    },
});

const InstructionsStack = createStackNavigator({
    Instructions: {
        screen: InstructionScreen,
        navigationOptions: yellowHeaderWithHamburger,
    },
});

const AppStack = createDrawerNavigator(
    {
        //основной стек авторизованного пользователя
        //   Home: AppLoadingScreen,  // эта штука сломала навигацию, раcкомментировать ЗАПРЕЩЕНО

        Page1: {
            screen: MainStack,
            navigationOptions: {
                drawerLabel: () => null, //'Заявки',
                //    drawerIcon: <IconMenuItem name='inbox' />
            },
        },

        Page5: {
            screen: MyInfoStack,
            navigationOptions: {
                drawerLabel: 'Моя информация',
                drawerIcon: <IconMenuItem name="user-circle-o" />,
            },
        },
        // Page2: {
        //     screen: OrderListScreen,
        //     navigationOptions: {
        //         drawerLabel: 'Мои заказы',
        //         drawerIcon: <IconMenuItem name='truck' />
        //     }
        // },

        Page2: {
            screen: MyCarStack,
            navigationOptions: {
                drawerLabel: 'Моё авто',
                drawerIcon: <IconMenuItem name="truck" />,
            },
        },

        Page6: {
            screen: MyDocsStack,
            navigationOptions: {
                drawerLabel: 'Мои документы',
                drawerIcon: <IconMenuItem name="briefcase" />,
            },
        },

        Page3: {
            screen: SettingsStack,
            navigationOptions: {
                drawerLabel: 'Настройки',
                drawerIcon: <IconMenuItem name="gear" />,
            },
        },

        Page4: {
            screen: InstructionsStack,
            navigationOptions: {
                drawerLabel: 'Инструкции',
                drawerIcon: <IconMenuItem name="info-circle" />,
            },
        },
    },
    {
        drawerWidth: width * 0.8,
        contentComponent: AppDrawer,
        contentOptions: {
            activeBackgroundColor: 'transparent',
            activeTintColor: 'black',
            /*       iconContainerStyle: {
        width: 45,
        border: 2
      } */
        },
    },
);

const AuthStack = createStackNavigator(
    {
        //стэк аутентификации
        SignIn: {
            screen: SignInScreen,
            navigationOptions: { headerBackTitle: 'Назад', headerTruncatedBackTitle: 'Назад' },
        },
        RegisterPerson: SignUpUserScreen,
    },
    {
        headerLayoutPreset: 'center',
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#FFC234',
                textAlign: 'center',
            },
        },
    },
);

export default createAppContainer(
    createSwitchNavigator(
        //свитч проверки авторизации
        {
            AuthLoading: AuthLoadingScreen,
            App: AppStack,
            Auth: AuthStack,
            FulfillingOrder: FulfillingOrderSwitch,
        },
        {
            initialRouteName: 'AuthLoading',
            resetOnBlur: false,
        },
    ),
);
