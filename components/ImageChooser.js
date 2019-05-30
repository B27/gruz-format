import React from 'react';
import { TouchableOpacity, Image } from 'react-native';

//import {CachedImage } from 'react-native-cached-image';

const styleTestTouchableOpacity = {
	borderWidth: 1,
	borderRadius: 15,
	borderColor: 'grey',
	width: 70,
	height: 70,
	justifyContent: 'center',
	alignItems: 'center'
	//  alignContent: "flex-start"
};
const styleImage = { borderRadius: 15, width: 70, height: 70 };

function ImageChooser({ openModal, img }) {
	let pictureUri = img;
	if (!img) pictureUri = require('../images/camera.png');

	if (typeof pictureUri === 'number') {
		return (
			<TouchableOpacity style={styleTestTouchableOpacity} onPress={openModal}>
				<Image source={pictureUri} style={styleImage} resizeMode='cover' />
			</TouchableOpacity>
		);
	} else {
		return (
			<TouchableOpacity style={styleTestTouchableOpacity} onPress={openModal}>
				<Image
					source={{
						uri: pictureUri,
						
					}}
					style={styleImage}
					resizeMode='cover'
				/>
			</TouchableOpacity>
		);
	}
}

export default ImageChooser;
