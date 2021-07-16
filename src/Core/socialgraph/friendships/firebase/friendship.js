import { firebaseUser } from '../../../firebase';
import { firebasePost, firebaseStory } from '../../feed/firebase';
import { notificationManager } from '../../../notifications';
import { IMLocalized } from '../../../localization/IMLocalization';
import { firebase } from '../../../firebase/config';

const usersRef = firebase.firestore().collection('users');

const socialGraphRef = firebase.firestore().collection('social_graph');

const onCollectionUpdate = (querySnapshot, callback) => {
  const data = [];
  querySnapshot.forEach((doc) => {
    const temp = doc.data();
    temp.id = doc.id;
    data.push(temp);
  });
  return callback(data, usersRef);
};

export const subscribeToInboundFriendships = (userId, callback) => {
  return socialGraphRef
    .doc(userId)
    .collection('inbound_users')
    .onSnapshot((querySnapshot) => onCollectionUpdate(querySnapshot, callback));
};

export const subscribeToOutboundFriendships = (userId, callback) => {
  return socialGraphRef
    .doc(userId)
    .collection('outbound_users')
    .onSnapshot((querySnapshot) => onCollectionUpdate(querySnapshot, callback));
};

export const addFriendRequest = async (
  fromUser,
  toUser,
  persistFriendshipsCounts,
  extendFollowers,
  enableFeedUpdates,
  callback,
) => {
  const fromUserID = fromUser.id;
  const toUserID = toUser.id;
  if (fromUserID == toUserID) {
    callback(null);
    return;
  }
  try {
    const fromUserRef = socialGraphRef.doc(fromUserID);
    const toUserRef = socialGraphRef.doc(toUserID);

    await fromUserRef.collection('outbound_users').doc(toUserID).set(toUser);
    await toUserRef.collection('inbound_users').doc(fromUserID).set(fromUser);

    if (persistFriendshipsCounts) {
      updateFriendshipsCounts(fromUserID);
      updateFriendshipsCounts(toUserID);
    }
    if (enableFeedUpdates) {
      if (extendFollowers) {
        // We followed someone so we populate our own feed with posts from that person
        firebasePost.hydrateFeedForNewFriendship(fromUserID, toUserID);
        firebaseStory.hydrateStoriesForNewFriendship(fromUserID, toUserID);
      }
    }
    var notificationBody =
      fromUser.firstName +
      ' ' +
      fromUser.lastName +
      ' ' +
      (extendFollowers
        ? IMLocalized('just followed you.')
        : IMLocalized('sent you a friend request.'));
    notificationManager.sendPushNotification(
      toUser,
      fromUser.firstName + ' ' + fromUser.lastName,
      notificationBody,
      extendFollowers ? 'friend_request' : 'social_follow',
      { fromUser },
    );
    callback({ success: true });
  } catch (error) {
    callback({ error: error });
  }
};

export const cancelFriendRequest = async (
  currentUserID,
  toUserID,
  persistFriendshipsCounts,
  enableFeedUpdates,
  callback,
) => {
  if (currentUserID == toUserID) {
    callback(null);
    return;
  }
  await socialGraphRef
    .doc(currentUserID)
    .collection('outbound_users')
    .doc(toUserID)
    .delete();
  await socialGraphRef
    .doc(toUserID)
    .collection('inbound_users')
    .doc(currentUserID)
    .delete();

  if (persistFriendshipsCounts) {
    updateFriendshipsCounts(currentUserID);
    updateFriendshipsCounts(toUserID);
  }

  if (enableFeedUpdates) {
    // currentUserID is not following toUserID anymore, so we remove feed posts and stories
    firebasePost.removeFeedForOldFriendship(currentUserID, toUserID);
    firebaseStory.removeStoriesForOldFriendship(currentUserID, toUserID);
  }
  callback({ success: true });
};

export const unfriend = async (
  currentUserID,
  toUserID,
  persistFriendshipsCounts,
  enableFeedUpdates,
  callback,
) => {
  if (currentUserID == toUserID) {
    callback(null);
    return;
  }
  if (enableFeedUpdates) {
    // This is in fact an unfollow, for a mutual follow relationship
    cancelFriendRequest(
      currentUserID,
      toUserID,
      persistFriendshipsCounts,
      enableFeedUpdates,
      (response) => {
        callback(response);
      },
    );
  } else {
    cancelFriendRequest(
      currentUserID,
      toUserID,
      persistFriendshipsCounts,
      enableFeedUpdates,
      (_response) => {
        cancelFriendRequest(
          toUserID,
          currentUserID,
          persistFriendshipsCounts,
          enableFeedUpdates,
          (response) => {
            callback(response);
          },
        );
      },
    );
  }
};

export const updateFeedsForNewFriends = (userID1, userID2) => {
  firebasePost.hydrateFeedForNewFriendship(userID1, userID2);
  firebaseStory.hydrateStoriesForNewFriendship(userID1, userID2);
  firebasePost.hydrateFeedForNewFriendship(userID2, userID1);
  firebaseStory.hydrateStoriesForNewFriendship(userID2, userID1);
};

const updateFriendshipsCounts = async (userID) => {
  // inbound
  const inbound = await socialGraphRef
    .doc(userID)
    .collection('inbound_users')
    .get();
  const inboundCount = inbound.docs ? inbound.docs.length : 0;
  firebaseUser.updateUserData(userID, { inboundFriendsCount: inboundCount });

  // outbound
  const outbound = await socialGraphRef
    .doc(userID)
    .collection('outbound_users')
    .get();
  const outboundCount = outbound.docs ? outbound.docs.length : 0;
  firebaseUser.updateUserData(userID, { outboundFriendsCount: outboundCount });
};
