import React, { Fragment } from 'react';
import { ScrollView, Text, View } from 'react-native';
import ExpandCardBase from '../components/ExpandCardBase';
import styles from '../styles';

class InstructionScreen extends React.Component {

    static navigationOptions = {
        title: 'Информация'
    };

    render() {
        return (
            <ScrollView>
                <ExpandCardBase
                    OpenComponent={<Text style={styles.cardH2}>Грузчик</Text>}
                    HiddenComponent={
                        <Fragment>
                            <View style={styles.cardDescription}>
                                <Text style={styles.instructionText}>
                                    По старой традиции торжественный парад, посвящённый в этом году 74-годовщине Победы
                                    в Великой Отечественной войне, начался в десять часов утра. Посмотреть на пешие
                                    колонны и военную технику на площадь Советов пришли тысячи жителей Улан-Удэ и гостей
                                    столицы. На главной трибуне города почётные места заняли ветераны и труженики тыла.
                                    Перед военнослужащими и зрителями с поздравительной речью выступил командующий
                                    общевойсковым объединением генерал-майор Михаил Носулев. В своём выступлении
                                    генерал-майор напомнил всем о стойкости, героизме, воинской доблести и готовности к
                                    самопожертвованию воинов Великой Отечественной войны и тружеников тыла.
                                </Text>
                            </View>
                        </Fragment>
                    }
                    cardStyle={styles.cardMargins}
                />
                <ExpandCardBase
                    OpenComponent={<Text style={styles.cardH2}>Водитель</Text>}
                    HiddenComponent={
                        <Fragment>
                            <View style={styles.cardDescription}>
                                <Text style={styles.instructionText}>
                                    По старой традиции торжественный парад, посвящённый в этом году 74-годовщине Победы
                                    в Великой Отечественной войне, начался в десять часов утра. Посмотреть на пешие
                                    колонны и военную технику на площадь Советов пришли тысячи жителей Улан-Удэ и гостей
                                    столицы. На главной трибуне города почётные места заняли ветераны и труженики тыла.
                                    Перед военнослужащими и зрителями с поздравительной речью выступил командующий
                                    общевойсковым объединением генерал-майор Михаил Носулев. В своём выступлении
                                    генерал-майор напомнил всем о стойкости, героизме, воинской доблести и готовности к
                                    самопожертвованию воинов Великой Отечественной войны и тружеников тыла.
                                </Text>
                            </View>
                        </Fragment>
                    }
                    cardStyle={styles.cardMargins}
                />
            </ScrollView>
        );
    }
}

export default InstructionScreen;
