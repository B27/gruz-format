import React from "react";
import {
	View,
	Text,
	TouchableOpacity,
	Modal,
	Image,
	ActivityIndicator
} from "react-native";
import styles from "../../styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

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
				
				<View style={{ flex: 1, justifyContent: "center" }}>
					{this.props.previewUri === undefined ? (
						<ActivityIndicator size="large" color="#FFC234" />
					) : (
						<Image
							source={{ uri: this.props.previewUri }}
							style={styles.preview}
						/>
					)}
				</View>
				<TouchableOpacity
					style={{ position: "absolute", left: 10, top: 10 }}
					onPress={() => {
						this.props.closeModal();
					}}
				>
					<Icon name="chevron-left" size={40} color="white" />
				</TouchableOpacity>
				<TouchableOpacity style={{ position: "absolute", right: 10, top: 10 }}onPress={() => {
						this.props.setPicture(this.props.previewUri);
					}}
				>
					<Icon name="check-circle-outline" size={40} color="white" />
				</TouchableOpacity>
			</Modal>
		);
	}
}
export default PreviewModal;
