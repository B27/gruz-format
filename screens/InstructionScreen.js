import React, { Fragment } from 'react';
import { ScrollView, Text, View } from 'react-native';
import ExpandCardBase from '../components/ExpandCardBase';
import styles from '../styles';
import axios from 'axios';

class InstructionScreen extends React.Component {
	static navigationOptions = {
		title: 'Информация'
	};
	state = {
		loaderInstruction: '',
		driverInstruction: ''
	};
	async componentDidMount(){
		this.willFocusSubscription = this.props.navigation.addListener('willFocus', async () => {
            const res = await axios.get('admin/instructions');
            console.log(res.data);
            
			this.setState({ loaderInstruction: res.data.loader_instruction, driverInstruction: res.data.driver_instruction });
		});
	};

	componentWillUnmount() {
		if (this.willFocusSubscription) {
			this.willFocusSubscription.remove();
		}
	}
	render() {
		return (
			<ScrollView>
				<ExpandCardBase
					OpenComponent={<Text style={styles.cardH2}>Грузчик</Text>}
					HiddenComponent={
						<Fragment>
							<View style={styles.cardDescription}>
								<Text style={styles.instructionText}>
									{this.state.loaderInstruction}
								</Text>
							</View>
						</Fragment>
					}
					cardStyle={styles.cardMargins}
				/>
				<ExpandCardBase
					OpenComponent={<Text style={styles.cardH2}>Водитель</Text>}
					HiddenComponent={
						<Fragment>
							<View style={styles.cardDescription}>
								<Text style={styles.instructionText}>
									{this.state.driverInstruction}
								</Text>
							</View>
						</Fragment>
					}
					cardStyle={styles.cardMargins}
				/>
			</ScrollView>
		);
	}
}

export default InstructionScreen;
