import React from 'react';
import { View, Text, TouchableOpacity, Linking, Image } from 'react-native';
import { DrawerItems, SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../styles';
import { privacyPolicyURL } from '../constants';
import SwitchToggle from '../components/SwitchToggle';
import BalanceScreen from '../screens/BalanceScreen';

import { inject, observer } from 'mobx-react/native';

@inject('store')
@observer
class CustomDrawerContentComponent extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {
		workingStatus: false,
		userName: 'Иванов И.И.'
	};

	// _onChangeSwitchValue = () => {
	// 	this.props.store.setOnWork(!this.props.store.onWork);
	// };

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

		const arr = this.props.store.name.split(' ');
		let str = '';
		str += arr[0];
		for (let i = 1; i < arr.length; i++) {
			str += ` ${arr[i][0]}.`;
		}
		return str;
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
							{this.props.store.avatar === '' ? (
								<Icon name='user-circle-o' size={64} />
							) : (
								<View>
									<Image style={{ width: 64, height: 64, borderRadius: 45 }} source={{ uri: this.props.store.avatar + '?' + this.props.store.refreshImage }} />
								</View>
							)}

							<Text style={styles.drawerUserName}>{this.showName()}</Text>
						</TouchableOpacity>
						{/* <View style={styles.drawerTopItem}>
							<Text style={styles.drawerFontTopItem}>Работаю</Text>
							<View>
								<SwitchToggle switchOn={this.props.store.onWork} onPress={this._onChangeSwitchValue} />
							</View>
						</View> */}
						<TouchableOpacity style={styles.drawerTopItem} onPress={this._balancePress}>
							<Text style={styles.drawerFontTopItem}>Баланс</Text>

							<Text style={styles.drawerFontTopItem}>{`${this.props.store.balance} руб.`}</Text>
						</TouchableOpacity>
						<DrawerItems {...this.props} />
					</View>
					<Text style={styles.drawerLicenseAgreement} onPress={this._licenseAgreementPress}>
						Сублицензионное соглашение
					</Text>
				</SafeAreaView>
			</View>
		);
	}
}

export default CustomDrawerContentComponent;
