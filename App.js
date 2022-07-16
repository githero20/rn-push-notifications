import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import * as Notifications from "expo-notifications";

// Push notifications are used to send notifications from your app, to your app on another device.
// it can be configured to run when an even takes place
// However, you are not allowed to send notifications directly to users.
// Google, App force you to pass notifications via their backend.
// Expo's Push Notification Server communicates with google, apple under the hood to send notifications to their servers and apps, devices on it.
// So you must send a https request to the server, which then communicates with other servers (where the app is installed) to display notifications
// the request could also be sent from the backend
// the notifications look like local notifications (from the user's app), on their device

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowAlert: true,
    };
  },
});

export default function App() {
  useEffect(() => {
    const subscription1 = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification Received");
        console.log(notification);
        const userName = notification.request.content.data.userName;
        console.log(userName);
      }
    );

    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("Notification Response Received");
        console.log(response);
        const userName = response.request.content.data.userName;
        console.log(userName);
      }
    );

    // clean up function
    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, []);

  const scheduleNotificationHandler = () => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Drink water",
        body: "Drink at least 2L of water today",
        data: { userName: "AquaMan" },
      },
      trigger: {
        seconds: 5,
      },
    });
  };
  return (
    <View style={styles.container}>
      <Button
        title="Schedule Notification"
        onPress={scheduleNotificationHandler}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
