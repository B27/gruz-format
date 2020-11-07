import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon2 from 'react-native-vector-icons/Ionicons';

export class MenuIcon extends React.Component {
    _menuPress = () => {
        this.props.navigationProps.toggleDrawer();
    };
    render() {
        return (
            <TouchableOpacity style={{ padding: 8 }} onPress={this._menuPress}>
                <Icon2 name="md-menu" size={24} />
            </TouchableOpacity>
        );
    }
}
