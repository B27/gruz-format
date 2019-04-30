import React from "react";
import {
  View,
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
  Image
} from "react-native";
import styles from "../styles";
import LocalImage from "../components/LocalImage";
import { Permissions } from "expo";
import ChoiceCameraRoll from "./modals/ChoiceCameraRoll";
import CameraModal from "./modals/CameraModal";
import PreviewModal from "./modals/PreviewModal";
import { Picker } from "native-base";
import ImageChooser from "../components/ImageChooser";

const styleTestTouchableOpacity = Object.assign(
  {},
  {
    // borderWidth: 1,
    // borderRadius: 15,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center"
    //  alignContent: "flex-start"
  }
);
const styleImage = { borderRadius: 15, width: 70, height: 70 };

class EditCarScreen extends React.Component {
  state = {
    pictureUri: require("../images/camera.png"),
    bodyType: "",
    loadCapacity: "",
    length: "",
    width: "",
    height: ""
  };

  static navigationOptions = {
    title: "Регистрация",
    headerLeft: null,
    headerTitleStyle: {
      textAlign: "center",
      flexGrow: 1,
      alignSelf: "center"
    }
  };

  render() {
    return (
      <ScrollView contentContainerStyle={styles.registrationScreen}>
        {/* <ChoiceCameraRoll
          visible={this.state.choiceModalVisible}
          closeModal={this.closeModals}
          openCamera={this.openCamera}
        />
        <CameraModal
          visible={this.state.cameraModalVisible}
          closeModal={this.closeModals}
          openPreview={this.openPreview}
        />
        <PreviewModal
          previewUri={this.state.previewUri}
          visible={this.state.previewModalVisible}
          closeModal={this.closePreviewModal}
          setPicture={this.setPicture}
        /> */}
        <Text>{this.state.message}</Text>
        <View style={styles.inputContainer} behavior="padding" enabled>
          <View
            style={{
              height: 45,
              borderWidth: 1,
              borderRadius: 15,
              paddingLeft: 15,
              marginBottom: 15,
              justifyContent: "center"
            }}
          >
            <Picker
              selectedValue={this.state.bodyType}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ bodyType: itemValue })
              }
              placeholder="Тип кузова"
            >
              <Picker.Item label="Рефрижератор" value="Рефрижератор" />
              <Picker.Item label="Термобудка" value="Термобудка" />
              <Picker.Item label="Кран. борт" value="Кран. борт" />
              <Picker.Item label="Тент" value="Тент" />
            </Picker>
          </View>
          {/* 
          <TextInput
            style={styles.input}
            placeholder="Тип кузова"
            placeholderTextColor="grey"
            onChangeText={bodyType => this.setState({ bodyType })}
          /> */}
          <TextInput
            style={styles.input}
            placeholder="Грузоподъёмность (тонны)"
            placeholderTextColor="grey"
            onChangeText={loadCapacity => this.setState({ loadCapacity })}
          />
          <Text style={styles.descriptionTwo}>Кузов:</Text>
          <TextInput
            style={styles.input}
            placeholder="Длина"
            placeholderTextColor="grey"
            onChangeText={length => this.setState({ length })}
          />
          <TextInput
            style={styles.input}
            placeholder="Ширина"
            placeholderTextColor="grey"
            onChangeText={width => this.setState({ width })}
          />
          <TextInput
            style={styles.input}
            placeholder="Высота"
            placeholderTextColor="grey"
            onChangeText={height => this.setState({ height })}
          />
          <Text style={styles.descriptionTwo}>Фотографии:</Text>
          <View style={styles.photoButtonContainer}>
            <ImageChooser />
            <ImageChooser />
            <ImageChooser />
          </View>
        </View>

        <TouchableOpacity style={styles.buttonBottom} onPress={this.nextScreen}>
          <Text style={styles.text}>ПРОДОЛЖИТЬ</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
  nextScreen = () => {
    //    this.props.navigation.navigate("Documents");
  };

  openCameraRoll = () => {
    this.setState({ choiceModalVisible: true });
  };
  openCamera = () => {
    this.setState({ cameraModalVisible: true });
  };
  openPreview = uri => {
    console.log(uri);

    this.setState({
      previewModalVisible: true,
      previewUri: uri
    });
  };
  setPicture = uri => {
    this.setState({
      pictureUri: uri,
      choiceModalVisible: false,
      cameraModalVisible: false,
      previewModalVisible: false
    });
  };
  closeModals = () => {
    this.setState({
      choiceModalVisible: false,
      cameraModalVisible: false
    });
  };
  closePreviewModal = () => {
    this.setState({
      previewModalVisible: false
    });
  };
}

export default EditCarScreen;
