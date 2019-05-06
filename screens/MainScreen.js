import React from "react";
import { ScrollView, Text, TouchableHighlight } from "react-native";
import styles from "../styles";

class EditCarScreen extends React.Component {
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
        <MenuItem onPress={this.nextScreen} />
      </ScrollView>
    );
  }

  nextScreen = () => {};
}

function MenuItem({ name, ...other }) {
  return (
    <TouchableHighlight {...other} style={styles.buttonBottom}>
      <Text>{name}</Text>
    </TouchableHighlight>
  );
}

export default EditCarScreen;
