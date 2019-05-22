import React from 'react';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createAppContainer, createDrawerNavigator, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import { MenuIcon } from '../components/MenuIcon';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import BalanceScreen from '../screens/BalanceScreen';
import DocumentsScreen from '../screens/DocumentsScreen';
import EditCarScreen from '../screens/EditCarScreen';
import EditUserScreen from '../screens/EditUserScreen';
import InstructionScreen from '../screens/InstructionScreen';
import MainScreen from '../screens/MainScreen';
import MyAutoScreen from '../screens/MyAutoScreen';
import MyInfoScreen from '../screens/MyInfoScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import OrderPreviewScreen from '../screens/OrderPreviewScreen';
import RepoDetailScreen from '../screens/RepoDetailScreen';
import RobokassaScreen from '../screens/RobokassaScreen';
import SignInScreen from '../screens/SignInScreen';
import SmsScreen from '../screens/SmsScreen';
import AppDrawer from './AppDrawer';

const { height, width } = Dimensions.get('window');

function IconMenuItem({ tintColor, name }) {
	return <Icon name={name} size={24} style={{ color: tintColor }} />;
}

const yellowHeader = {
	headerStyle: {
		backgroundColor: '#FFC234'
	}
};

const yellowHeaderWithHamburger = ({ navigation, ...others }) => {
	return Object.assign({}, yellowHeader, {
		headerLeft: <MenuIcon navigationProps={navigation} />,
		headerLeftContainerStyle: { paddingLeft: 8 }
	});
};

// const yellowHeaderWithHamburger = Object.assign({}, yellowHeader, {
//     headerLeft: <MenuIcon />,
//     headerLeftContainerStyle: { paddingLeft: 8 }
// });

const MainStack = createStackNavigator(
    {
        Main: { screen: MainScreen, navigationOptions: yellowHeaderWithHamburger },
        Balance: BalanceScreen,
        Robokassa: RobokassaScreen,
        OrderPreview: OrderPreviewScreen,
        OrderDetail: OrderDetailScreen
    },
    { defaultNavigationOptions: yellowHeader }
);

const MyInfoStack = createStackNavigator({
	MyInfo: {
		screen: MyInfoScreen,
		navigationOptions: yellowHeaderWithHamburger
	}
});

const MyCarStack = createStackNavigator(
	{
		MyCar: {
			screen: MyAutoScreen,
			navigationOptions: yellowHeaderWithHamburger
		}
	},
	{
		defaultNavigationOptions: {
			headerTitle: 'Мое авто'
		}
	}
);

const SettingsStack = createStackNavigator({
	Settings: {
		screen: RepoDetailScreen,
		navigationOptions: yellowHeaderWithHamburger
	}
});

const InstructionsStack = createStackNavigator({
	Instructions: {
		screen: InstructionScreen,
		navigationOptions: yellowHeaderWithHamburger
	}
});


const AppStack = createDrawerNavigator(
	{
		//основной стек авторизованного пользователя
		//   Home: AppLoadingScreen,  // эта штука сломала навигацию, раcкомментировать ЗАПРЕЩЕНО

		Page1: {
			screen: MainStack,
			navigationOptions: {
				drawerLabel: () => null //'Заявки',
				//    drawerIcon: <IconMenuItem name='inbox' />
			}
		},

		Page5: {
			screen: MyInfoStack,
			navigationOptions: {
				drawerLabel: 'Моя информация',
				drawerIcon: <IconMenuItem name='user-circle-o' />
			}
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
				drawerIcon: <IconMenuItem name='truck' />
			}
		},

		Page3: {
			screen: SettingsStack,
			navigationOptions: {
				drawerLabel: 'Настройки',
				drawerIcon: <IconMenuItem name='gear' />
			}
		},

		Page4: {
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
