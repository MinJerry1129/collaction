import { firebase } from '../../firebase/config';
import { updateUser, getUserByID } from '../../firebase/auth';

const notificationsRef = firebase.firestore().collection('notifications');

const fcmURL = 'https://fcm.googleapis.com/fcm/send';
const firebaseServerKey = 'AAAAL5yg07Y:APA91bHllRhUMBPu1UhbdZa-GRqnuaHnj6xmOLjinbDirCwcn3lP0U1OjqsqYsKeMGi2pDDR9inLG6GT1tw4YH44sD0ialMK4PcrseWRVbC61gGk-_85p_OGLRB5hSyaSDHbDFzkuQ29';

const handleUserBadgeCount = async (userID) => {
  const { badgeCount } = await getUserByID(userID);
  if (badgeCount !== null) {
    const newBadgeCount = badgeCount + 1;
    updateUser(userID, { badgeCount: newBadgeCount });
    return newBadgeCount;
  }
  return 0;
};

const sendPushNotification = async (
  toUser,
  title,
  body,
  type,
  metadata = {},
) => {
  if (metadata && metadata.outBound && toUser.id == metadata.outBound.id) {
    return;
  }

  const notification = {
    toUserID: toUser.id,
    title,
    body,
    metadata,
    toUser,
    type,
    seen: false,
  };

  const ref = await notificationsRef.add({
    ...notification,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  notificationsRef.doc(ref.id).update({ id: ref.id });
  if (!toUser.pushToken) {
    return;
  }

  const userBadgeCount = await handleUserBadgeCount(toUser.id || toUser.userID);

  const pushNotification = {
    to: toUser.pushToken,
    notification: {
      title: title,
      body: body,
      sound: 'default',
      badge: userBadgeCount,
    },
    data: { type, toUserID: toUser.id, ...metadata },
    priority: 'high',
  };

  fetch(fcmURL, {
    method: 'post',
    headers: new Headers({
      Authorization: 'key=' + firebaseServerKey,
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(pushNotification),
  });
};

const sendCallNotification = async (
  sender,
  recipient,
  channelID,
  callType,
  callID,
) => {
  if (!recipient.pushToken) {
    return;
  }

  const pushNotification = {
    to: recipient.pushToken,
    priority: 'high',
    data: {
      channelID,
      recipientID: recipient.id,
      senderID: sender.id,
      callType,
      callID,
      callerName: sender.firstName,
      priority: 'high',
      contentAvailable: true,
    },
  };

  try {
    const response = await fetch(fcmURL, {
      method: 'post',
      headers: new Headers({
        Authorization: 'key=' + firebaseServerKey,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(pushNotification),
    });
    console.log('jjj push notif ' + JSON.stringify(pushNotification));
    console.log(JSON.stringify(response));
  } catch (error) {
    console.log(error);
  }
};

export const notificationManager = {
  sendPushNotification,
  sendCallNotification,
};
