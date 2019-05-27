import { inject, observer } from 'mobx-react/native';
import React from 'react';
import { View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
//const socket = (async()=>{await getChatSocket('5ce66399dcc0097d8b95dc17')})();
@inject('store')
@observer
class Chat extends React.Component {
    
	state = {
        messages: []
	};
	static navigationOptions = {
		title: 'Чат с диспетчером'
	};

	setMessage(id, text, sender) {
		return {
			_id: id,
			text: text,

			user: {
				_id: sender, 
				name: 'React Native',
				avatar: 'https://pp.userapi.com/c851020/v851020958/124b79/hm1z7MpbpAk.jpg'
			}
		};
	}
	componentWillMount = async () => {
        await this.props.store.startChatSocket('5ce66399dcc0097d8b95dc17');
		console.log('-----' + this.props.store.socketChat.connected);
        
		this.props.store.socketChat.on('history', (result) => {
            console.log(666666666);
            
			console.log(result);
			result.forEach(item => {
				const { _id, text, sender } = item;
				this.setState(previousState => ({
					messages: GiftedChat.append(previousState.messages, this.setMessage(_id, text, sender))
				}));
			});
		});
		this.props.store.socketChat.on('user', msg => {
            //this.setState({ idUser: msg._id });
            
            console.log(msg);
            
		});
		
		this.props.store.socketChat.on('chat message', result => {
			//this.setState({ message: [...this.state.message, result] });
            const { sender, text } = result;
            this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, this.setMessage(new Date(), text, sender))
            }))
            console.log(result);
            
		});
	};

	render() {
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
					messages={this.state.messages}
					onSend={messages => this.onSend(messages)}
					user={{
						_id: 1
					}}
				/>
			</View>
		);
	}
	onSend(messages = []) {
        messages.forEach(message => {
            console.log(message);
            
            this.props.store.socketChat.emit('chat message', message.text);
        })
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages)
        }));
        
		
	}
}

export default Chat;
