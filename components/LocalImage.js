import React, { Component } from 'react'
import {
    Image,
    Dimensions
} from 'react-native'

const LocalImage = ({source, originalWidth, originalHeight}) => {
    const {width: windowWidth } = Dimensions.get('window')
    let widthChange = (windowWidth-50)/originalWidth
    let newWidth = originalWidth * widthChange
    let newHeight = originalHeight * widthChange
    console.log();
    if(typeof(source)==="number"){
        return (
            <Image source={source} style={{width: newWidth, height: newHeight}} />
        )
    } else {
        return (
            <Image source={{uri: source}} style={{width: newWidth, height: newHeight}} />
        )
    }
    
}

export default LocalImage