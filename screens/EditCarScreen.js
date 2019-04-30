import { Picker } from "native-base";
import React from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import ImageChooser from "../components/ImageChooser";
import styles from "../styles";
import ChoiceCameraRoll from "./modals/ChoiceCameraRoll";
import { Permissions, ImagePicker } from "expo";

class EditCarScreen extends React.Component {
  state = {
    imageNum: null,
    choiceModalVisible: false,
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
        <ChoiceCameraRoll
          pickFromCamera={this.pickFromCamera}
          selectPicture={this.selectPicture}
          visible={this.state.choiceModalVisible}
          closeModal={this.closeModals}
        />
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
            <ImageChooser openModal={this.openModalImage(1)} img={this.state.image1}/>
            <ImageChooser openModal={this.openModalImage(2)} img={this.state.image2}/>
            <ImageChooser openModal={this.openModalImage(3)} img={this.state.image3}/>
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

  closeModals = () => {
    this.setState({
      choiceModalVisible: false
    });
  };

  openModalImage = num => () => {
    this.setState({
      choiceModalVisible: true,
      imageNum: num
    });
  };

  pickFromCamera = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status === "granted") {
      this.setState({ choiceModalVisible: false });
      const { cancelled, uri } = await ImagePicker.launchCameraAsync({
        mediaTypes: "Images"
      });
      if (!cancelled) this.setState({ [`image${this.state.imageNum}`]: uri });
    }
  };

  selectPicture = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      this.setState({ choiceModalVisible: false });
      const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images",
        aspect: [1, 1],
        allowsEditing: true
      });
      if (!cancelled) this.setState({ [`image${this.state.imageNum}`]: uri });
    }
  };
}

export default EditCarScreen;
