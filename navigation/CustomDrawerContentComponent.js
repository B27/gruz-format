import React from "react";
import { ScrollView, View } from "react-native";
import { DrawerItems, SafeAreaView } from "react-navigation";

const CustomDrawerContentComponent = props => (
  <ScrollView>
    <View style={{ flex: 1, height: 200, backgroundColor: "#FFC234" }} />
    <SafeAreaView
      style={{
        container: {
          flex: 1
        }
      }}
      forceInset={{ top: "always", horizontal: "never" }}
    >
      
      <DrawerItems {...props} />
    </SafeAreaView>
  </ScrollView>
);

export default CustomDrawerContentComponent;
