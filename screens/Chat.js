import { inject, observer } from 'mobx-react/native';
import React from 'react';
import { View, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import styles from '../styles';
//const socket = (async()=>{await getChatSocket('5ce66399dcc0097d8b95dc17')})();

let connected = false;

@inject('store')
@observer
class Chat extends React.Component {
	state = {
		messages: []
	};
	static navigationOptions = {
		title: 'Чат с диспетчером'
	};

	setMessage(id, text, sender, name, avatar) {
		return {
			_id: id,
			text: text,
			user: {
				_id: sender,
				name: name,
				avatar: avatar
			}
		};
	}
	componentDidMount = async () => {
		console.log('dispatcher', this.props.navigation.state.params);
		await this.props.store.startChatSocket('5ce66399dcc0097d8b95dc17');
		console.log('-----' + this.props.store.socketChat.connected);

		if (!connected) {
			this.props.store.socketChat.on('history', result => {
				console.log(666666666);

				//console.log(result);
				this.props.store.chatHistory = [];
				result.forEach(item => {
					const { text, sender } = item;
					const { name, avatar } = this.idToName(sender);
					this.props.store.addChatMessage(this.setMessage(Math.random(), text, sender, name, avatar));
				});
			});

			this.props.store.socketChat.on('chat message', result => {
				const { sender, text } = result;
				const { name, avatar } = this.idToName(sender);
				this.props.store.addChatMessage(this.setMessage(Math.random(), text, sender, name, avatar));
				//console.log(result);
			});
			connected = true;
		}
	};
	idToName = id => {
		return {
			name: this.props.navigation.state.params.find(item => item.id === id).name,
			avatar: this.props.navigation.state.params.find(item => item.id === id).avatar
		};
	};

	render() {
		const arr = [...this.props.store.chatHistory];
		return (
			<View
				style={{
					flex: 1,
					flexDirection: 'column',
					justifyContent: 'flex-start',
					backgroundColor: '#FFFFFF',
					padding: 8
				}}
				key={this.props.id}
			>
				<GiftedChat
					messages={arr}
					onSend={messages => this.onSend(messages)}
					user={{
						_id: this.props.store.userId
					}}
					alwaysShowSend={true}
					renderSend={this.renderSend}
					placeholder='Введите сообщение...'
					renderUsernameOnMessage={true}
				/>
				
			</View>
		);
	}

	renderSend(props) {
		return (
			<Send {...props}>
				<Text style={{ marginBottom: 10, fontSize: 16 }}>Отправить</Text>
			</Send>
		);
	}

	onSend(messages = []) {
		messages.forEach(message => {
			//console.log(message);

			this.props.store.socketChat.emit('chat message', message.text);
		});

		this.props.store.chatHistory = GiftedChat.append([...this.props.store.chatHistory], messages).map(v => ({
			...v,
			createdAt: undefined
		}));
	}
}

export default Chat;
