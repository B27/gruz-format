import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { observer } from 'mobx-react/native';
import store from '../mobx/Store';
//import {  } from 'react-native-expo-image-cache';

//import {CachedImage } from 'react-native-cached-image';

const styleTestTouchableOpacity = {
	borderWidth: 1,
	borderRadius: 15,
	borderColor: 'grey',
	width: 70,
	height: 70,
	justifyContent: 'center',
	alignItems: 'center'
	//alignContent: "flex-start"
};
const styleImage = { borderRadius: 15, width: 70, height: 70};

const ImageChooser = observer(({ openModal, img, classStyle }) => {
    let pictureUri = img;
    console.log('КАРТИНКА ОБНОВИЛАСЬ: ' + store.refreshImage);
    
	if (!img) pictureUri = require('../images/camera.png');




	if (typeof pictureUri === 'number') {
		return (
			<TouchableOpacity style={styleTestTouchableOpacity} onPress={openModal}>
				<Image source={pictureUri} style={styleImage} resizeMode='cover' />
			</TouchableOpacity>
		);
	} else {
		return (
			<TouchableOpacity style={ styleTestTouchableOpacity} onPress={openModal}>
				<Image
					source={{
						uri: pictureUri + '?' + store.refreshImage
					}}
					style={styleImage}
					resizeMode='cover'
				/>
			</TouchableOpacity>
		);
	}
});

export default ImageChooser;
