import React from "react";
import { Image, TouchableOpacity } from "react-native";

const styleTestTouchableOpacity = Object.assign({}, {
  borderWidth: 1,
  borderRadius: 15,
  borderColor: "grey",
  width: 70,
  height: 70,
  justifyContent: "center",
  alignItems: "center"
//  alignContent: "flex-start"
});
const styleImage = { borderRadius: 15, width: 70, height: 70 };

function ImageChooser () {
  const pictureUri = require("../images/camera.png");

  return (
    <TouchableOpacity
      style={styleTestTouchableOpacity}
      onPress={openCameraRoll()}
    >
      <Image
        source={pictureUri}
        style={styleImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
};

openCameraRoll = () => {
  
};

export default ImageChooser;
