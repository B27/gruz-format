import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator
} from "react-navigation";
import RepoDetailScreen from "../screens/RepoDetailScreen";
import RepoListScreen from "../screens/RepoListScreen";
import SignInScreen from "../screens/SignInScreen";
import AuthLoadingScreen from "../screens/AuthLoadingScreen";
import AppLoadingScreen from "../screens/AppLoadingScreen";
import SmsScreen from "../screens/SmsScreen";
import React from "react";
import UserInfoScreen from "../screens/UserInfoScreen";
import DocumentsScreen from "../screens/DocumentsScreen";
import EditUserScreen from "../screens/EditUserScreen";
import EditCarScreen from "../screens/EditCarScreen";
import MainScreen from "../screens/MainScreen";
import { Dimensions } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const { height, width } = Dimensions.get("window");
import CustomDrawerContentComponent from "./CustomDrawerContentComponent";

const AppStack = createDrawerNavigator(
  {
    //основной стек авторизованного пользователя
    //   Home: AppLoadingScreen,  // эта штука сломала навигацию, разкомментировать ЗАПРЕЩЕНО

    Main: {
      screen: MainScreen,
      navigationOptions: {
        drawerLabel: "Заявки",
        drawerIcon: ({ tintColor }) => (
          <Icon name="inbox" size={24} style={{ color: tintColor }} />
        )
      }
    },
    Page2: {
      screen: RepoDetailScreen,
      navigationOptions: {
        drawerLabel: "Мои заказы",
        drawerIcon: ({ tintColor }) => (
          <Icon name="truck" size={24} style={{ color: tintColor }} />
        )
      }
    },
    Page3: {
      screen: UserInfoScreen,
      navigationOptions: {
        drawerLabel: "Баланс",
        drawerIcon: ({ tintColor }) => (
          <Icon name="money" size={24} style={{ color: tintColor }} />
        )
      }
    },
    Page4: {
      screen: MainScreen,
      navigationOptions: {
        drawerLabel: "Моё авто",
        drawerIcon: ({ tintColor }) => (
          <Icon name="wrench" size={24} style={{ color: tintColor }} />
        )
      }
    },
    Page5: {
      screen: RepoDetailScreen,
      navigationOptions: {
        drawerLabel: "Настройки",
        drawerIcon: ({ tintColor }) => (
          <Icon name="gear" size={24} style={{ color: tintColor }} />
        )
      }
    },
    Page6: {
      screen: UserInfoScreen,
      navigationOptions: {
        drawerLabel: "Инструкции",
        drawerIcon: ({ tintColor }) => (
          <Icon name="info-circle" size={24} style={{ color: tintColor }} />
        )
      }
    },
  },
  {
    drawerWidth: width * 0.9,
    contentComponent: CustomDrawerContentComponent,
    contentOptions: {
      activeBackgroundColor: "#FFC234",
      activeTintColor: "black",
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
        backgroundColor: "#FFC234",
        textAlign: "center",
        height: 0.1 * height,
        textAlign: "center"
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
      initialRouteName: "AuthLoading"
    }
  )
);
