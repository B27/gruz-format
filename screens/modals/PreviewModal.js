import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import styles from "../../styles";

class PreviewModal extends React.Component {
	render() {
		return (
			<Modal
				animationType="slide"
				transparent={false}
				visible={this.props.visible}
				onRequestClose={() => {
					this.props.closeModal();
                }}
                
			>
				
						<TouchableOpacity
							onPress={() => {
								this.props.closeModal();
							}}
						>
							<Text style={styles.text}>Отменить</Text>
						</TouchableOpacity>
					
				
			</Modal>
		);
	}
}
export default PreviewModal;
