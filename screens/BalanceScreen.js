import React from 'react';
import { TouchableOpacity, TextInput, Text, View, ScrollView, AsyncStorage } from 'react-native';
import styles from '../styles';

class BalanceScreen extends React.Component {
	state = {
		sum: null,
		message: ''
	};

	static navigationOptions = {
		title: 'Пополнить баланс'
	};

	render() {
		return (
			<ScrollView contentContainerStyle={styles.registrationScreen}>
				<View style={styles.inputContainer} behavior='padding' enabled>
					<Text style={{ marginBottom: 15, fontSize: 16 }}>
						Ваш баланс: <Text style={{ marginBottom: 10, fontSize: 16 }}>200 р.</Text>
					</Text>
					<Text style={{ marginBottom: 15, fontSize: 16 }}>
						Введите сумму на которую хотите пополнить счет:
					</Text>
					<TextInput
						style={styles.input}
						placeholder='Сумма'
						placeholderTextColor='grey'
						keyboardType='numeric'
						onChangeText={sum => this.setState({ sum })}
					/>
				</View>
				<Text style={{ color: 'red' }}>{this.state.message}</Text>
				<TouchableOpacity style={{ ...styles.buttonBottom,  marginTop: 0 }} onPress={this._goToRobokassa}>
					<Text style={styles.text}>ПЕРЕЙТИ К ОПЛАТЕ</Text>
				</TouchableOpacity>
			</ScrollView>
		);
	}
	_goToRobokassa = async () => {
		if (!this.state.sum) return this.setState({ message: "Необходимо заполнить поле 'Сумма'" });

		this.props.navigation.navigate('Robokassa', {
			sum: this.state.sum,
			userId: await AsyncStorage.getItem('userId')
		});
	};
}

export default BalanceScreen;
