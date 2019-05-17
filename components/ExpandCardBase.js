import React, { Fragment } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles';

class ExpandCardBase extends React.Component {
    state = {
        cardExpanded: false
    };

    _pressExpand = () => {
        this.setState({
            cardExpanded: !this.state.cardExpanded
        });
    };

    // судя по ТЗ переход в подробную информация на кнопку Принять
    // _onPressCard = () => {
    //     this.props.onPressCard(this.props.id);
    // };

    render() {
        const { cardExpanded } = this.state;
        const { cardStyle, OpenComponent, HiddenComponent, id, expandAlways } = this.props;
        return (
            <TouchableOpacity
                style={[styles.cardBase, cardStyle]}
                key={id}
                onPress={expandAlways ? undefined : this._pressExpand}
                // onPress срабатывает сразу после корректного нажатия,
                // но для того чтобы появилась анимация прозрачности необходимо держать компонент нажатым 10 секунд
                delayPressIn={10000}
            >
                <View>
                    <View style={styles.cardRowTopContainer}>
                        <View style={{ flex: 1 }}>{OpenComponent}</View>
                        {expandAlways || (
                            <TouchableOpacity style={styles.orderChevronIcon} onPress={this._pressExpand}>
                                {cardExpanded ? (
                                    <Icon name='chevron-up' size={42} color='#c4c4c4' />
                                ) : (
                                    <Icon name='chevron-down' size={42} color='#c4c4c4' />
                                )}
                            </TouchableOpacity>
                        )}
                    </View>

                    {(cardExpanded || expandAlways) && <Fragment>{HiddenComponent}</Fragment>}
                </View>
            </TouchableOpacity>
        );
    }
}

export default ExpandCardBase;
