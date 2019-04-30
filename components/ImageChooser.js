import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { Permissions, ImagePicker } from "expo";

const styleTestTouchableOpacity = {
  borderWidth: 1,
  borderRadius: 15,
  borderColor: "grey",
  width: 70,
  height: 70,
  justifyContent: "center",
  alignItems: "center"
  //  alignContent: "flex-start"
};
const styleImage = { borderRadius: 15, width: 70, height: 70 };

function ImageChooser(props) {
  const pictureUri = require("../images/camera.png");

  return (
    <TouchableOpacity
      style={styleTestTouchableOpacity}
      onPress={props.openModal}
    >
      <Image source={pictureUri} style={styleImage} resizeMode="cover" />
    </TouchableOpacity>
  );
}

export default ImageChooser;
