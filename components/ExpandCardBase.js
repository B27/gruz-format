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

    componentDidMount() {
        const { expanded } = this.props;
        if (expanded) {
            this.setState({ cardExpanded: expanded });
        }
    }
    // судя по ТЗ переход в подробную информация на кнопку Принять
    // _onPressCard = () => {
    //     this.props.onPressCard(this.props.id);
    // };

    render() {
        const { cardExpanded } = this.state;
        const { cardStyle, OpenComponent, HiddenComponent, id, expandAlways } = this.props;
        return (
            <View style={[styles.cardBase, cardStyle]} key={id}>
                <View>
                    <View style={styles.cardRowTopContainer}>
                        <TouchableOpacity
                            style={{ flex: 1 }}
                            onPress={expandAlways ? undefined : this._pressExpand}
                            // onPress срабатывает сразу после корректного нажатия,
                            // но для того чтобы появилась анимация прозрачности необходимо держать компонент нажатым 10 секунд
                            delayPressIn={10000}
                        >
                            {OpenComponent}
                        </TouchableOpacity>
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
            </View>
        );
    }
}

export default ExpandCardBase;
