import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import Switch from 'react-native-switch-toggle';
import { DrawerItems, SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../styles';

class CustomDrawerContentComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        switchValue: false,
        balance: 345,
        userName: 'Иванов И.И.'
    };

    _onChangeSwitchValue = () => {
        this.setState({ switchValue: !this.state.switchValue });
    };

    _licenseAgreementPress = () => {
        //TODO скачивание лизенции
    };

    _userContainerPress = () => {
        //TODO открытие окна информации о пользователе
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <SafeAreaView
                    style={{ flex: 1, justifyContent: 'space-between' }}
                    forceInset={{ top: 'never', horizontal: 'never' }}
                >
                    <View>
                        <TouchableOpacity style={styles.drawerUserContainer} onPress={this._userContainerPress}>
                            <Icon name='user-circle-o' size={64} />
                            <Text style={styles.drawerUserName}>{this.state.userName}</Text>
                        </TouchableOpacity>
                        <View style={styles.drawerTopItem}>
                            <Text style={styles.drawerFontTopItem}>Работаю</Text>
                            <View>
                                <SwitchToggle switchOn={this.state.switchValue} onPress={this._onChangeSwitchValue} />
                            </View>
                        </View>
                        <View style={styles.drawerTopItem}>
                            <Text style={styles.drawerFontTopItem}>Баланс</Text>
                            <Text style={styles.drawerFontTopItem}>{`${this.state.balance} руб.`}</Text>
                        </View>
                        <DrawerItems {...this.props} />
                    </View>
                    <Text style={styles.drawerLicenseAgreement} onPress={this._licenseAgreementPress}>
                        Лицензионное соглашение
                    </Text>
                </SafeAreaView>
            </View>
        );
    }
}

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
                padding: 3
            }}
            circleStyle={{
                width: 22,
                height: 22,
                borderRadius: 25
            }}
            circleColorOff='white'
            circleColorOn='#FFC234'
            duration={250}
        />
    );
}

export default CustomDrawerContentComponent;
