import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { DrawerItems, SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../styles';
import { privacyPolicyURL } from '../constants';
import SwitchToggle from '../components/SwitchToggle';
import BalanceScreen from '../screens/BalanceScreen';
import MyContext from '../Context';

class CustomDrawerContentComponent extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {
		workingStatus: false,
		balance: 345,
		userName: 'Иванов И.И.'
	};

	_onChangeSwitchValue = () => {
		this.setState({ workingStatus: !this.state.workingStatus });
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
								<SwitchToggle switchOn={this.state.workingStatus} onPress={this._onChangeSwitchValue} />
							</View>
						</View>
						<TouchableOpacity style={styles.drawerTopItem} onPress={this._balancePress}>
							<Text style={styles.drawerFontTopItem}>Баланс</Text>
							<MyContext.Consumer>
                                {value => 
        
                                    <Text style={styles.drawerFontTopItem}>{`${value.balance} руб.`}</Text>
                                }
							</MyContext.Consumer>
						</TouchableOpacity>
						<DrawerItems {...this.props} />
					</View>
					<Text style={styles.drawerLicenseAgreement} onPress={this._licenseAgreementPress}>
						Политика конфиденциальности
					</Text>
				</SafeAreaView>
			</View>
		);
	}
}

export default CustomDrawerContentComponent;
