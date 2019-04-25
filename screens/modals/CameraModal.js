import React from "react";
import { Text, View, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Camera, Permissions, FileSystem, MediaLibrary } from "expo";
import {
	Container,
	Content,
	Header,
	Item,
	Icon,
	Input,
	Button
} from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default class CameraModal extends React.Component {
	state = {
		hasCameraPermission: null,
		type: "back",
		ratio: "16:9"
	};

	async componentWillMount() {
		const { status } = await Permissions.askAsync(
			Permissions.CAMERA,
			Permissions.CAMERA_ROLL
		);
		this.setState({
			hasCameraPermission: status === "granted",
			hasCameraRollPermission: status === "granted"
		});
	}


	render() {
		const { hasCameraPermission } = this.state;
		if (hasCameraPermission === null) {
			return <View />;
		} else if (hasCameraPermission === false) {
			return <Text>Вы не дали разрешение для доступа к камере</Text>;
		} else {
			return (
				<Modal
					animationType="fade"
					transparent={true}
					visible={this.props.visible}
					onRequestClose={() => {
						this.props.closeModal();
					}}
				>
					<View style={{ flex: 1 }}>
						<Camera
							ref={ref => {
								this.camera = ref;
							}}
							style={styles.camera}
							type={this.state.type}
							ratio={this.state.ratio}
						>
							<View
								style={{
									backgroundColor: "transparent",
									marginTop: 10,
									marginHorizontal: 20,
									flexDirection: "row"
								}}
							>
								{this.state.type === "back" ? (
									<TouchableOpacity
										style={{
											justifyContent: "flex-start",
											flex: 1,
											flexDirection: "row"
										}}
									>
										<Icon
											name="ios-flash"
											style={{ color: "white", fontWeight: "bold" }}
										/>
									</TouchableOpacity>
								) : null}

								<TouchableOpacity
									style={{
										justifyContent: "flex-end",
										flexDirection: "row",
										flex: 1
									}}
								>
									<Icon
										onPress={() => {
											this.setState({
												type: this.state.type === "back" ? "front" : "back"
											});
										}}
										name="ios-reverse-camera"
										style={{ color: "white", fontWeight: "bold" }}
									/>
								</TouchableOpacity>
							</View>

							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									paddingHorizontal: 10,
									marginBottom: 15,
									justifyContent: "center"
								}}
							>
								<TouchableOpacity
									style={{ alignItems: "center" }}
									onPress={this.takePicture}
								>
									<MaterialCommunityIcons
										name="circle-outline"
										style={{ color: "white", fontSize: 100 }}
									/>
								</TouchableOpacity>
							</View>
						</Camera>
					</View>
				</Modal>
			);
		}
	}
	renderFlashButton = () => {};
	takePicture = async () => {
		if (this.camera) {
			this.props.openPreview();
			const { uri } = await this.camera.takePictureAsync();
			const asset = await MediaLibrary.createAssetAsync(uri);
			this.props.openPreview(asset.uri);
		}
	};
	// onPictureSaved = async photo => {
	// 	await FileSystem.moveAsync({
	// 		from: photo.uri,
	// 		to: `${FileSystem.documentDirectory}photos/${Date.now()}.jpg`
	// 	});
	// };
}
const styles = StyleSheet.create({
	camera: {
		flex: 1,
		justifyContent: "space-between"
	}
});
