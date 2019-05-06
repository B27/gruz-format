import React from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableHighlight,
  Image
} from "react-native";
import styles from "../styles";
import Icon from "react-native-vector-icons/FontAwesome";

class EditCarScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {};

  static navigationOptions = {
    title: "Иванов В.В.",
    headerLeft: null,
    headerTitleStyle: {
      textAlign: "center",
      flexGrow: 1,
      alignSelf: "center"
    }
  };

  render() {
    return (
      <ScrollView /* contentContainerStyle={styles.registrationScreen} */>
        <View
          style={{ flex: 1, flexDirection: "column", paddingHorizontal: 4 }}
        >
          <MenuItem item="Заявки" onPress={this.nextScreen} />
          <MenuItem item="Мои заказы" icon="truck" onPress={this.nextScreen} />
          <MenuItem item="Баланс" icon="wallet" onPress={this.nextScreen} />
          <MenuItem item="Моё авто" onPress={this.nextScreen} />
          <MenuItem item="Настройки" icon="gear" onPress={this.nextScreen} />
          <MenuItem item="Инструкции" icon="info-circle" onPress={this.nextScreen} />
        </View>
      </ScrollView>
    );
  }

  nextScreen = () => {
    console.log("MainScreen log");
  };
}

function MenuItem({ item, icon, ...other }) {
  return (
    <TouchableHighlight
      {...other}
      style={{
        height: 48,
        justifyContent: "center"
      }}
      underlayColor="#FFC234"
    >
      <View style={{ flexDirection: "row" }}>
        <Icon
          name={icon}
          size={24}
          //		color="#FFC234"
          style={{marginHorizontal: 12}}
        />
        <Text style={styles.mainMenuItemText}>{item.toUpperCase()}</Text>
      </View>
    </TouchableHighlight>
  );
}

export default EditCarScreen;
