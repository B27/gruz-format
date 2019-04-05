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
    return (
        <Image source={{uri: 'https://briefly.ru/static/authors/gogol.jpg'}} style={{width: newWidth, height: newHeight}} />
    )
}

export default LocalImage