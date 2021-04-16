import { inject, observer } from 'mobx-react/native';
import React from 'react';
import { Image, Linking, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DrawerItems } from 'react-navigation';
import { privacyPolicyURL } from '../constants';
import styles from '../styles';

@inject('store')
@observer
class CustomDrawerContentComponent extends React.Component {
    state = {
        workingStatus: false,
        userName: '',
    };

    _licenseAgreementPress = () => {
        Linking.openURL(privacyPolicyURL);
    };

    _userContainerPress = () => {
        this.props.navigation.navigate('Main');
        this.props.navigation.closeDrawer();
    };

    _balancePress = () => {
        this.props.navigation.navigate('Balance');
        this.props.navigation.closeDrawer();
    };
    showName = () => {
        //	console.log('avatar' + this.props.store.avatar);
        let str = '';
        if (
            this.props.store.lastName.length >= 1 &&
            this.props.store.firstName.length >= 1 &&
            this.props.store.patronymic.length >= 1
        ) {
            str = `${this.props.store.firstName[0]}. ${this.props.store.patronymic[0]}. ${this.props.store.lastName}`;
        } else if (this.props.store.firstName.length >= 1) {
            str = this.props.store.firstName;
        } else {
            str = 'Неизвестный';
        }

        /*const arr = this.props.store.name.split(' ');
		let str = '';
		str += arr[0];
		for (let i = 1; i < arr.length; i++) {
            str += ` ${arr[i][0]}.`;
            
        }*/
        return str;
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <SafeAreaView
                    // currentHeight есть только в android, для ios отступ добавит SafeAreaView
                    style={{ backgroundColor: '#FFC234', paddingTop: StatusBar.currentHeight }}
                    // forceInset={{ top: 'always', horizontal: 'never' }}
                >
                    <TouchableOpacity style={styles.drawerUserContainer} onPress={this._userContainerPress}>
                        {this.props.store.avatar === '' ? (
                            <Icon name="user-circle-o" size={64} />
                        ) : (
                            <View>
                                <Image
                                    style={{ width: 64, height: 64, borderRadius: 45 }}
                                    source={{ uri: this.props.store.avatar + '?' + this.props.store.refreshImage }}
                                />
                            </View>
                        )}

                        <Text style={styles.drawerUserName}>{this.showName()}</Text>
                    </TouchableOpacity>
                </SafeAreaView>
                <View>
                    <TouchableOpacity style={styles.drawerTopItem} onPress={this._balancePress}>
                        <Text style={styles.drawerFontTopItem}>Баланс</Text>

                        <Text style={styles.drawerFontTopItem}>{`${this.props.store.balance} руб.`}</Text>
                    </TouchableOpacity>
                    <DrawerItems {...this.props} />
                </View>
                <Text style={styles.drawerLicenseAgreement} onPress={this._licenseAgreementPress}>
                    Сублицензионное соглашение
                </Text>
            </View>
        );
    }
}

export default CustomDrawerContentComponent;
