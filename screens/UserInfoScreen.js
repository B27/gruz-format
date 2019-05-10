import React, { Component } from 'react';
import { View, Text, Button, AsyncStorage } from 'react-native';

import { username } from '../constants';

class UserInfoScreen extends Component {
	static navigationOptions = {
		title: 'UserInfo',
		drawerLabel: 'UserInfo'
	};

	componentDidMount() {}
	render() {
		const { loadingInfo } = this.props;
		if (loadingInfo) return <Text>Loading...</Text>;
		return (
			<View>
				<Button title='Выйти из аккаунта' onPress={() => this._signOutAsync()} />
			</View>
		);
	}

	_signOutAsync = async () => {
		await AsyncStorage.clear();
		this.props.navigation.navigate('Auth');
	};
}

export default UserInfoScreen;
