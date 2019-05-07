import React from "react";
import { ScrollView, View, Text } from "react-native";
import SwitchToggle from "react-native-switch-toggle";
import { DrawerItems, SafeAreaView } from "react-navigation";
import Icon from "react-native-vector-icons/FontAwesome";

class CustomDrawerContentComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    switchValue: false
  };

  onChangeSwitchValue = () => {
    this.setState({ switchValue: !this.state.switchValue });
  };

  render() {
    return (
      <ScrollView>
        <SafeAreaView
          style={{
            container: {
              flex: 1
            }
          }}
          forceInset={{ top: "never", horizontal: "never" }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              height: 120,
              backgroundColor: "#FFC234",
              //   alignContent: "center",
              alignItems: "center",
              padding: 18,
              paddingTop: 40
            }}
          >
            <Icon name="user-circle-o" size={64} />
            <Text
              style={{
                flex: 2,
                textAlign: "center",
                fontSize: 24,
                paddingLeft: 6
              }}
            >
              Иванов И.И.
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: 'space-between',
              alignItems: "center",
              borderBottomWidth: 1,
              height: 48,
              borderColor: "grey",
              padding: 12
            }}
          >
            <Text>Работаю</Text>
            <View>
              <SwitchToggle
                // trackColor={{ false: "grey", true: "#FFC234" }}
                switchOn={this.state.switchValue}
                onPress={this.onChangeSwitchValue}
                containerStyle={{
                  width: 45,
                  height: 25,
                  borderRadius: 25,
                  backgroundColor: "#ccc",
                  padding: 3
                }}
                circleStyle={{
                  width: 22,
                  height: 22,
                  borderRadius: 25,
                  backgroundColor: "black" // rgb(102,134,205)
                }}
                circleColorOff="white"
                circleColorOn="#FFC234"
                duration={250}
              />
            </View>
          </View>
          <DrawerItems {...this.props} />
        </SafeAreaView>
      </ScrollView>
    );
  }
}

export default CustomDrawerContentComponent;
