import React from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import styles from "../styles";

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
        <MenuItem name="sdf" onPress={this.nextScreen} />
      </ScrollView>
    );
  }

  nextScreen = () => {console.log("MainScreen log")};
}

function MenuItem({ name, ...other }) {
  return (
    <TouchableOpacity {...other} style={{
      width: 125,
      height: 45,
      borderRadius: 25,
      backgroundColor: 'red',
      alignContent: 'center',
      marginTop: 10,
      marginBottom: 20
  }}>
      <Text>{name}</Text>
    </TouchableOpacity>
  );
}

export default EditCarScreen;
