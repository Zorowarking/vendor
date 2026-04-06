import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useVendorStore } from '../store/vendorStore';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return;
  }
  
  // Here you would get the Expo Push Token or FCM token
  // token = (await Notifications.getExpoPushTokenAsync()).data;
  // console.log("Push Token:", token);

  return token;
}

export function setupNotificationListeners(router) {
  const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    // If we receive a push notification while the app is foregrounded, we can tap into it.
    // However, our Socket.IO already handles real-time foreground updates.
    console.log('Notification Received in foreground:', notification);
  });

  const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    // When the user taps a notification (e.g. while app was in background)
    const data = response.notification.request.content.data;
    if (data?.type === 'new_order') {
      // Navigate to the dashboard or specific order
      // We can also trigger the store to fetch the latest state
      router.push('/(vendor)');
    }
  });

  return { notificationListener, responseListener };
}
