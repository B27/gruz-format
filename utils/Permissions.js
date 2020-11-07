import { Platform } from 'react-native';
import { PERMISSIONS, checkMultiple, requestMultiple, RESULTS } from 'react-native-permissions';

const TAG = '~Permissions~';

async function checkOrRequestPermissions({ iosPermissions = undefined, androidPermissions = undefined }) {
    switch (Platform.OS) {
        case 'android':
            let statuses;
            try {
                statuses = await checkMultiple(androidPermissions);
                console.log('permission statuses', statuses);
            } catch (error) {
                console.error(TAG, 'error while check android permissions', error);
            }

            let permissionsForRequest = [];
            androidPermissions.forEach((permission) => {
                if (statuses[permission] !== RESULTS.UNAVAILABLE && statuses[permission] !== RESULTS.GRANTED) {
                    permissionsForRequest.push(permission);
                }
            });

            console.log('permissions for request', permissionsForRequest);
            if (permissionsForRequest.length > 0) {
                try {
                    statuses = await requestMultiple(permissionsForRequest);
                } catch (error) {
                    console.error(TAG, 'error in request multiple permissions', error);
                    return;
                }

                permissionsForRequest.forEach((permission) => {
                    if (statuses[permission] !== RESULTS.UNAVAILABLE && statuses[permission] !== RESULTS.GRANTED) {
                        return statuses[permission];
                    }
                });
            }

            return RESULTS.GRANTED;

        case 'ios':
            break;
    }
}

async function askLocation() {
    return await checkOrRequestPermissions({
        androidPermissions: [
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
            PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
        ],
    });
}

export default { askLocation };
