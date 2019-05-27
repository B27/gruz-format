import { Permissions, Notifications } from 'expo';
import axios from 'axios';

export default async function registerForPushNotificationsAsync() {
	const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
	let finalStatus = existingStatus;

	// only ask if permissions have not already been determined, because
	// iOS won't necessarily prompt the user a second time.
	if (existingStatus !== 'granted') {
		// Android remote notification permissions are granted during the app
		// install, so this will only ask on iOS
		const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
		finalStatus = status;
	}

	// Stop here if the user did not grant permissions
	if (finalStatus !== 'granted') {
		return;
	}

	// Get the token that uniquely identifies this device
	let token = await Notifications.getExpoPushTokenAsync();

	// axios.interceptors.request.use(request => {
	// 	console.log('Starting Request', request);
	// 	return request;
	// });

	// axios.interceptors.response.use(response => {
	// 	console.log('Response:', response);
	// 	return response;
	// });
	let response;
	// POST the token to your backend server from where you can retrieve it to send push notifications.
	try {
		console.log(token);
		response = await axios.post('/push_token', {token});
	} catch (err) {
		//console.log('post error', err.response);
	}

}
