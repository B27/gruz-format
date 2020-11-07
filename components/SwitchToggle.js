import React from 'react';
import Switch from 'react-native-switch-toggle';

function SwitchToggle({ switchOn, onPress }) {
    return (
        <Switch
            // trackColor={{ false: "grey", true: "#FFC234" }}
            switchOn={switchOn}
            onPress={onPress}
            containerStyle={{
                width: 45,
                height: 25,
                borderRadius: 25,
                padding: 3,
            }}
            circleStyle={{
                width: 22,
                height: 22,
                borderRadius: 25,
            }}
            circleColorOff="white"
            circleColorOn="#FFC234"
            duration={250}
        />
    );
}

export default SwitchToggle;
