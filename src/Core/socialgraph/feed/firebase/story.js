import { firebase } from '../../../firebase/config';

export const storiesRef = firebase
  .firestore()
  .collection('socialnetwork_stories');

export const subscribeToStoriesFeed = (userID, callback) => {
  const storiesRef = firebase
    .firestore()
    .collection('social_feeds')
    .doc(userID)
    .collection('stories_feed')
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      (querySnapshot) => {
        const stories = [];
        querySnapshot.forEach((doc) => {
          const story = doc.data();
          story.id = doc.id;
          stories.push(story);
        });
        return callback(stories);
      },
      (_error) => {
        callback([]);
      },
    );
  return storiesRef;
};

export const subscribeStories = (friends, callback) => {
  return storiesRef.orderBy('createdAt', 'desc').onSnapshot((querySnapshot) => {
    const data = [];
    querySnapshot.forEach((doc) => {
      const temp = doc.data();
      temp.id = doc.id;

      data.push(temp);
    });
    const stories = data.filter((data) => {
      return friends.find((friend) => {
        return friend.id === data.authorID || friend.userID === data.authorID;
      });
    });
    return callback(stories);
  });
};

export const addStory = async (story, followerIDs, author) => {
  try {
    const storyData = {
      ...story,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      author,
      authorID: author.id,
    };
    const ref = await storiesRef.add(storyData);
    const finalStory = { ...storyData, id: ref.id };
    await storiesRef.doc(ref.id).update(finalStory);

    const db = firebase.firestore();
    const batch = db.batch();
    const allUsersToBeUpdated = [author.id].concat(followerIDs);
    allUsersToBeUpdated.forEach((userID) => {
      const otherUserMainFeedRef = firebase
        .firestore()
        .collection('social_feeds')
        .doc(userID)
        .collection('stories_feed')
        .doc(finalStory.id);
      batch.set(otherUserMainFeedRef, finalStory);
    });
    batch.commit();
    return { success: true, id: ref.id };
  } catch (error) {
    return { error, success: false };
  }
};

export const hydrateStoriesForNewFriendship = async (
  destUserID,
  sourceUserID,
) => {
  // we take all stories from sourceUserID and populate the stories of destUserID
  const storiesDestRef = firebase
    .firestore()
    .collection('social_feeds')
    .doc(destUserID)
    .collection('stories_feed');

  const unsubscribeToSourceStories = storiesRef
    .where('authorID', '==', sourceUserID)
    .onSnapshot(
      (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const story = doc.data();
          if (story.id) {
            storiesDestRef.doc(story.id).set(story);
          }
        });
        unsubscribeToSourceStories();
      },
      (error) => {
        console.log(error);
      },
    );
};

export const removeStoriesForOldFriendship = async (
  destUserID,
  oldFriendID,
) => {
  // We remove all stories authored by oldFriendID from destUserID's stories tray
  const storiesDestRef = firebase
    .firestore()
    .collection('social_feeds')
    .doc(destUserID)
    .collection('stories_feed');

  const unsubscribeToSourceStories = storiesRef
    .where('authorID', '==', oldFriendID)
    .onSnapshot(
      (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const story = doc.data();
          if (story.id) {
            storiesDestRef.doc(story.id).delete();
          }
        });
        unsubscribeToSourceStories();
      },
      (error) => {
        console.log(error);
      },
    );
};
