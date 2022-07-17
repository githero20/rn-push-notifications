import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Alert, Button, Pressable, StyleSheet, Text, View } from "react-native";
import * as Notifications from "expo-notifications";

// Push notifications are used to send notifications from your app, to your app on another device.
// it can be configured to run when an event takes place
// However, you are not allowed to send notifications directly to users.
// Google, Apple force you to pass notifications via their backend.
// Expo's Push Notification Server communicates with google, apple under the hood to send notifications to their servers and devices on it with your app.
// So you must send a https request to the server, which then communicates with other servers to display notifications on devices where the app is installed.
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
    async function configurePushNotifications() {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;

      if (finalStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert("Permission required", "Please allow push notifications.");
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250, 250, 250],
          // lightColor: "#FF231F7C",
        });
      }
    }

    configurePushNotifications();
  }, []);

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

  const sendPushNotificationHandler = () => {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        to: "ExponentPushToken[PAjosEAskp8sLDec_1W33E]",
        // this is usually sent from the backend, i.e. after the user's token has been gotten,
        // it is saved on the db and fetched for use whenever the backend software wants to make a
        // push notification
        title: "Push Notification",
        body: "Test push notification, from Omogbai's Device",
      }),
    });
  };

  return (
    <View style={styles.container}>
      <Button
        title="Schedule Local Notification"
        onPress={scheduleNotificationHandler}
      />
      <Pressable
        style={[styles.button, styles.secondButton]}
        onPress={sendPushNotificationHandler}
      >
        <View>
          <Text style={styles.text}>Send Push Notification</Text>
        </View>
      </Pressable>
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
  button: {
    borderRadius: 4,
    padding: 8,
    backgroundColor: "purple",
  },
  secondButton: {
    marginTop: 10,
  },
  text: {
    color: "#fff",
  },
});
