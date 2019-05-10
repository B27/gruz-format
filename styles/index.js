import { StyleSheet, Dimensions } from 'react-native';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
	backgroundContainer: {
		flex: 1,
		width: null,
		height: null
	},

	logoContainer: {
		marginLeft: 24,
		flex: 1,
		justifyContent: 'flex-end',
		paddingBottom: '5%'
	},

	logoText: {
		color: 'white',
		fontSize: 32,
		fontWeight: '500'
	},

	logoIcon: {
		marginTop: 15
	},

	inputBlock: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},

	input: {
		height: 45,
		borderWidth: 1,
		borderRadius: 15,
		fontSize: 16,
		paddingLeft: 15,
		marginBottom: 15,
		justifyContent: 'center'
	},

	datePickerText: {
		fontSize: 16,
		color: 'grey'
	},

	inputHalf: {
		flex: 1,
		height: 45,
		borderWidth: 1,
		borderRadius: 15,
		fontSize: 16,
		paddingLeft: 15,
		marginBottom: 15
	},

	inputWithIcon: {
		height: 45,
		borderWidth: 1,
		borderRadius: 15,
		fontSize: 16,
		paddingLeft: 48
	},

	inputWithIconCountryCode: {
		height: 45,
		borderWidth: 1,
		borderRadius: 15,
		fontSize: 16,
		paddingLeft: 71
	},

	countryCode: {
		position: 'absolute',
		top: 12,
		paddingLeft: 48,
		fontSize: 16
	},

	inputIcon: {
		position: 'absolute',
		top: 8,
		left: 15
	},

	inputContainer: {
		width: WIDTH - 55,
		marginHorizontal: 25,
		marginTop: 10
		//        flex: 1
	},

	policy: {
		marginHorizontal: 45,
		flexDirection: 'row',
		flex: 1
	},

	btnEye: {
		position: 'absolute',
		top: 8,
		right: 20
	},

	button: {
		width: WIDTH / 2,
		height: 45,
		borderRadius: 25,
		backgroundColor: 'black',
		justifyContent: 'center',
		marginTop: 10
	},

	buttonBottom: {
		width: WIDTH / 2,
		height: 45,
		borderRadius: 25,
		backgroundColor: 'black',
		justifyContent: 'center',
		marginTop: 10,
		marginBottom: 20
	},

	text: {
		color: '#FFC234',
		fontSize: 16,
		textAlign: 'center'
	},

	blackText: {
		color: 'black',
		fontSize: 16,
		textAlign: 'center'
	},

	mainMenuItemText: {
		color: 'black',
		fontSize: 20
		//   textAlign: 'center'
	},

	h2: {
		fontSize: 18
	},

	description: {
		color: 'grey',
		marginHorizontal: 35,
		textAlign: 'center',
		top: 10,
		marginBottom: 10
	},

	descriptionTwo: {
		color: 'grey',
		marginHorizontal: 6,
		textAlign: 'left',
		marginBottom: 10
	},

	//for ScrollView
	registrationScreen: {
		alignItems: 'center',
		justifyContent: 'flex-start',
		flexDirection: 'column',
		paddingTop: 10
	},

	registrationPhoto: {
		width: '100%'
	},

	camButton: {
		backgroundColor: '#FFC234',
		marginBottom: 15,
		width: 45,
		height: 45,
		borderRadius: 25,
		justifyContent: 'center'
	},

	camButton: {
		backgroundColor: '#FFC234',
		marginBottom: 15,
		width: 45,
		height: 45,
		borderRadius: 25,
		justifyContent: 'center'
	},

	choiceCameraRoll: {
		height: 200,
		backgroundColor: 'white',
		shadowColor: 'black',
		width: WIDTH * 0.9,
		elevation: 5,
		borderRadius: 10
	},

	choiceCameraRollItem: {
		backgroundColor: '#FFC234',
		borderRadius: 10,
		margin: 5,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},

	choiceCameraRollCancel: {
		backgroundColor: 'black',
		borderRadius: 10,
		margin: 5,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},

	preview: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		height: HEIGHT,
		width: WIDTH
	},

	photoButtonContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginBottom: 16
	},

	fullScreenPicture: {
		marginVertical: 10
	},

	registrationQuestion: {
		marginTop: 10,
		fontSize: 16
	},

	drawerUserContainer: {
		flexDirection: 'row',
		height: 120,
		backgroundColor: '#FFC234',
		//   alignContent: "center",
		alignItems: 'center',
		padding: 18,
		paddingTop: 40
	},

	drawerUserName: {
		flex: 2,
		textAlign: 'center',
		fontSize: 24,
		paddingLeft: 6
	},

	drawerTopItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomWidth: 1,
		height: 56,
		borderColor: '#C4C4C4',
		padding: 12
	},

	drawerFontTopItem: {
		fontSize: 16
	},

	drawerLicenseAgreement: {
		alignSelf: 'center',
		color: '#c69523',
		//   paddingTop: 120,
		//   Self: 'flex-end',

		paddingBottom: 16
	},

	instructionBase: {
		paddingLeft: '3%',
		paddingRight: '3%',
		paddingTop: 5
	},

	instructionView: {
		backgroundColor: '#FAFAFA',
		padding: 5,
		borderRadius: 3,
		justifyContent: 'center'
	},

	instructionViewTitle: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		height: 40,
		alignItems: 'center',
		padding: 5
	},

	instructionTitle: {
		fontSize: 16
	},

	instructionText: {
		flex: 1,
		justifyContent: 'flex-start',
		padding: 5
	}
});
export default styles;
