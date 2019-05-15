import { StyleSheet, Dimensions } from 'react-native';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

const OrderStyle = StyleSheet.create({
    orderRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginHorizontal: 12,
        paddingVertical: 4
        // borderWidth: 1, borderColor: 'green'
    },

    orderRowTopContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },

    orderText: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 10
    },

    orderChevronIcon: {
        // borderWidth: 1
    },

    orderIcon: {
        marginRight: 12
    },

    buttonRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },

    orderBase: {
        flex: 1,
        paddingTop: 4,
        paddingBottom: 4,
        backgroundColor: '#f1f1f1',
        // borderWidth: 1,
        // borderColor: 'red',
        borderRadius: 10
    },

    buttonText: {
        fontWeight: 'bold'
    },

    button: {
        padding: 12
    },

    clockText: {
        marginTop: 2
    },

    locationText: {
        marginRight: 12
    },

    descriptionText: {
        marginRight: 32
    },


});
export default OrderStyle;
