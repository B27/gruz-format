import React, { Fragment } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/OrderStyle';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class Order extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderExpanded: false
        };
    }

    _pressChevron = () => {
        this.setState({
            orderExpanded: !this.state.orderExpanded
        });
    };

    _onPressButton = () => {
        this.props.onPress(this.props.id);
    };

    render() {
        const { orderExpanded } = this.state;
        const { style, buttonName, description, address, time } = this.props;
        return (
            <View style={[styles.orderBase, style]} key={this.props.id}>
                <View style={styles.orderRowTopContainer}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.orderRow}>
                            <Icon name='clock-outline' color='#FFC234' size={20} style={styles.orderIcon} />
                            <Text>{time}</Text>
                        </View>
                        <View style={styles.orderRow}>
                            <Icon name='map-marker' color='#FFC234' size={20} style={styles.orderIcon} />
                            <Text style={styles.locationText}>{address}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={this._pressChevron}>
                        {orderExpanded ? (
                            <Icon name='chevron-up' size={42} color='#c4c4c4' style={styles.orderChevronIcon} />
                        ) : (
                            <Icon name='chevron-down' size={42} color='#c4c4c4' style={styles.orderChevronIcon} />
                        )}
                    </TouchableOpacity>
                </View>

                {orderExpanded && (
                    <Fragment>
                        <View style={styles.orderRow}>
                            <Icon name='message-text' color='#FFC234' size={20} style={styles.orderIcon} />
                            <Text style={styles.descriptionText}>{description}</Text>
                        </View>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.button} onPress={this._onPressButton}>
                                <Text style={styles.buttonText}>{buttonName}</Text>
                            </TouchableOpacity>
                        </View>
                    </Fragment>
                )}
            </View>
        );
    }
}

export default Order;
