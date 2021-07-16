export { groupBy } from '../../../helpers/collections';
import { firebaseFriendship } from '../../friendships/';
import { friends } from '../../friendships/redux';
import FriendshipManager from '../../friendships/firebase/friendshipManager';
import { notificationManager } from '../../../notifications';
import { IMLocalized } from '../../../localization/IMLocalization';
import { firebase } from '../../../firebase/config';

export const commentsRef = firebase
  .firestore()
  .collection('socialnetwork_comments');

export const reactionsRef = firebase
  .firestore()
  .collection('socialnetwork_reactions');

export const postsRef = firebase.firestore().collection('SocialNetwork_Posts');

const usersRef = firebase.firestore().collection('users');

export const subscribeToUserReactions = (userID, callback) => {
  const reactionsRef = firebase
    .firestore()
    .collection('socialnetwork_reactions')
    .where('reactionAuthorID', '==', userID)
    .onSnapshot(
      (querySnapshot) => {
        const reactions = [];
        querySnapshot.forEach((doc) => {
          const reaction = doc.data();
          reactions.push(reaction);
        });
        return callback(reactions);
      },
      (error) => {
        console.log(error);
        callback([]);
      },
    );
  return reactionsRef;
};

const onQueryCollectionUpdate = (querySnapshot, postId) => {
  const data = [];
  querySnapshot.forEach((doc) => {
    const temp = doc.data();
    temp.id = doc.id;
    if (postId === temp.postID) {
      data.push(temp);
    }
  });
  return data;
};

const onCollectionUpdate = (querySnapshot, postId) => {
  const data = [];
  querySnapshot.forEach((doc) => {
    const temp = doc.data();
    temp.id = doc.id;
    data.push(temp);
  });
  return data;
};

export const subscribeComments = (postId, callback) => {
  return commentsRef.orderBy('createdAt', 'asc').onSnapshot((querySnapshot) => {
    let comments = onQueryCollectionUpdate(querySnapshot, postId);
    comments = comments.filter((comment) => comment.authorID);
    comments = comments.map(async (comment) => {
      const userDoc = await usersRef.doc(comment.authorID).get();
      const promiseComment = {
        ...comment,
        firstName: userDoc.data().firstName || userDoc.data().fullname,
        profilePictureURL: userDoc.data().profilePictureURL,
      };

      return promiseComment;
    });
    Promise.all(comments).then((newComment) => {
      return callback(newComment);
    });
  });
};

export const subscribeReactions = (callback, postId) => {
  return reactionsRef.onSnapshot((querySnapshot) => {
    let reactions = [];
    if (postId) {
      reactions = onQueryCollectionUpdate(querySnapshot, postId);
    } else {
      reactions = onCollectionUpdate(querySnapshot);
    }

    const groupedByReaction = groupBy('reaction');
    const groupedReactions = groupedByReaction(reactions);
    const formattedReactions = [];

    for (var key of Object.keys(groupedReactions)) {
      const rawReaction = groupedReactions[key];
      const formattedReaction = {
        type: rawReaction[0].reaction,
        count: rawReaction.length,
        reactionAuthorID: rawReaction[0].reactionAuthorID,
        postID: rawReaction[0].postID,
      };
      formattedReactions.push(formattedReaction);
    }

    return callback(formattedReactions);
  });
};

export const getUserReactions = (userId, callback) => {
  return reactionsRef
    .where('reactionAuthorID', '==', userId)
    .onSnapshot((querySnapshot) => {
      const date = new Date();
      const seconds = date.getTime() / 1000;

      const reactions = querySnapshot.docs.map((doc) => {
        const temp = doc.data();
        temp.id = doc.id;
        return temp;
      });

      const groupedByPostId = groupBy('postID');
      const groupedReactionsByPostId = groupedByPostId(reactions);
      const formattedReactions = [];

      for (var key of Object.keys(groupedReactionsByPostId)) {
        const rawReaction = groupedReactionsByPostId[key];
        const formattedReaction = {
          reactionAuthorID: rawReaction[0].reactionAuthorID,
          postID: rawReaction[0].postID,
          reactions: rawReaction.map((item) => {
            return {
              type: item.reaction,
              reactionAuthorID: item.reactionAuthorID,
              postID: item.postID,
              createdAt: item.createdAt || { seconds },
              id: item.id,
            };
          }),
        };
        formattedReactions.push(formattedReaction);
      }

      callback({ reactions: formattedReactions, fetchCompleted: true });
    });
};

export const addComment = async (
  comment,
  commentAuthor,
  post,
  followEnabled,
) => {
  try {
    const ref = await commentsRef.add({
      ...comment,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    await commentsRef
      .doc(ref.id)
      .update({ ...comment, commentID: ref.id, id: ref.id });

    // Send push notification to author
    notificationManager.sendPushNotification(
      post.author,
      IMLocalized('collaction'),
      commentAuthor.firstName + ' ' + IMLocalized('commented on your post.'),
      'social_comment',
      { outBound: commentAuthor },
    );

    if (followEnabled) {
      updateCommentCountOnAllTimelines(comment);
    } else {
      updateCommentCountOnAllFriendsTimelines(comment);
    }
    return { success: true, id: ref.id };
  } catch (error) {
    return { error, success: false };
  }
};

export const handleReaction = async (reaction, user, post, followEnabled) => {
  try {
    const postId = post.id;
    const documentSnapshots = await reactionsRef
      .where('reactionAuthorID', '==', user.id)
      .where('postID', '==', postId)
      .get();

    if (documentSnapshots.docs.length > 0) {
      if (followEnabled || reaction == null) {
        // this is simply an unlike
        documentSnapshots.docs.forEach(async (docRef) => {
          await reactionsRef.doc(docRef.id).delete();
        });
      } else {
        // this is modifying a previous reaction into a different reaction, facebook style (e.g. angry into love)
        documentSnapshots.docs.forEach(async (docRef) => {
          await reactionsRef.doc(docRef.id).update({ reaction });
        });
      }
    } else {
      const newReaction = {
        postID: postId,
        reaction,
        reactionAuthorID: user.id,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };
      await reactionsRef.add(newReaction);

      // Send push notification to author
      const message = followEnabled
        ? user.firstName + ' ' + IMLocalized('liked your post.')
        : user.firstName + ' ' + IMLocalized('reacted to your post.');
      notificationManager.sendPushNotification(
        post.author,
        IMLocalized('collaction'),
        message,
        'social_reaction',
        { outBound: user, reaction },
      );
    }
    if (followEnabled) {
      updateReactionsCountForFollowers(post);
    } else {
      updateReactionsCountForFriends(post);
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteReaction = async (userId, postId) => {
  await reactionsRef
    .where('reactionAuthorID', '==', userId)
    .where('postID', '==', postId)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const updateReactionsCountForFollowers = async (post) => {
  // After we added the reaction to the reactions table (the main source of truth for reactions), update the counts in the timeline of all people seeing this post
  // We compute the canonical reactions count
  const allReactions = await reactionsRef.where('postID', '==', post.id).get();
  const allReactionsCount = allReactions.docs.length;

  // We update the canonical entry
  postsRef.doc(post.id).update({ reactionsCount: allReactionsCount });

  // We fetch all users who follow the author of the post and update their timelines
  const unsubscribe = firebaseFriendship.subscribeToInboundFriendships(
    post.authorID,
    (inboundFriendships) => {
      const inboundUserIDs = inboundFriendships.map(
        (friendship) => friendship.id,
      );
      const allUserIDsToBeUpdated = [post.authorID].concat(inboundUserIDs);

      const db = firebase.firestore();
      let batch = db.batch();
      allUserIDsToBeUpdated.forEach((userID) => {
        if (!userID) {
          return;
        }
        const feedPostsRef = firebase
          .firestore()
          .collection('social_feeds')
          .doc(userID)
          .collection('main_feed')
          .doc(post.id);
        batch.set(
          feedPostsRef,
          {
            reactionsCount: allReactionsCount,
          },
          {
            merge: true,
          },
        );
      });
      // Commit the batch
      batch.commit();
      unsubscribe();
    },
  );
};

const updateReactionsCountForFriends = async (post) => {
  // After we added the reaction to the reactions table (the main source of truth for reactions), update the counts in the timeline of all people seeing this post
  // We compute the canonical reactions count
  const allReactions = await reactionsRef.where('postID', '==', post.id).get();
  const allReactionsCount = allReactions.docs.length;

  // We update the canonical entry
  postsRef.doc(post.id).update({ reactionsCount: allReactionsCount });

  // We get all friends of the author and update their timelines
  const manager = new FriendshipManager(
    false,
    (friendships, inbound, outbound) => {
      const friendsUserIDs = friendships.map(
        (friendship) => friendship.user.id,
      );
      const allUserIDsToBeUpdated = [post.authorID].concat(friendsUserIDs);
      const db = firebase.firestore();
      let batch = db.batch();
      allUserIDsToBeUpdated.forEach((userID) => {
        const feedPostsRef = firebase
          .firestore()
          .collection('social_feeds')
          .doc(userID)
          .collection('main_feed')
          .doc(post.id);
        batch.set(
          feedPostsRef,
          {
            reactionsCount: allReactionsCount,
          },
          {
            merge: true,
          },
        );
      });
      // Commit the batch
      batch.commit();
      manager.unsubscribe();
    },
  );
  manager.fetchFriendships(post.authorID);
};

const updateCommentCountOnAllTimelines = async (comment) => {
  // Fetch the current comment count
  const allCommentsForThisPost = await commentsRef
    .where('postID', '==', comment.postID)
    .get();
  const commentCount = allCommentsForThisPost.docs.length;

  // Update canonical posts table
  postsRef.doc(comment.postID).update({ commentCount: commentCount });

  // We fetch all users who follow the author of the post and update their timelines
  const unsubscribe = firebaseFriendship.subscribeToInboundFriendships(
    comment.authorID,
    (inboundFriendships) => {
      const inboundUserIDs = inboundFriendships.map(
        (friendship) => friendship.id,
      );
      const allUserIDsToBeUpdated = [comment.authorID].concat(inboundUserIDs);

      const db = firebase.firestore();
      const batch = db.batch();
      allUserIDsToBeUpdated.forEach((userID) => {
        if (!userID) {
          return;
        }
        const otherUserMainFeedRef = firebase
          .firestore()
          .collection('social_feeds')
          .doc(userID)
          .collection('main_feed')
          .doc(comment.postID);
        batch.set(
          otherUserMainFeedRef,
          {
            commentCount: commentCount,
          },
          {
            merge: true,
          },
        );
      });
      batch.commit();
      unsubscribe();
    },
  );
};

const updateCommentCountOnAllFriendsTimelines = async (comment) => {
  // Fetch the current comment count
  const allCommentsForThisPost = await commentsRef
    .where('postID', '==', comment.postID)
    .get();
  const commentCount = allCommentsForThisPost.docs.length;

  // Update canonical posts table
  postsRef.doc(comment.postID).update({ commentCount: commentCount });

  // We fetch all friends of the author of the post and update their timelines
  const unsubscribeInbound = firebaseFriendship.subscribeToInboundFriendships(
    comment.authorID,
    (inboundFriendships) => {
      const unsubscribeOutbound = firebaseFriendship.subscribeToOutboundFriendships(
        comment.authorID,
        (outboundFriendships) => {
          const inboundUserIDs = inboundFriendships.map(
            (friendship) => friendship.id,
          );
          const outboundUserIDs = outboundFriendships.map(
            (friendship) => friendship.id,
          );
          const allUserIDsToBeUpdated = [comment.authorID].concat(
            inboundUserIDs.filter((id) => outboundUserIDs.includes(id)),
          ); // author + all mutual friendships
          const db = firebase.firestore();
          const batch = db.batch();
          allUserIDsToBeUpdated.forEach((userID) => {
            if (!userID) {
              return;
            }
            const otherUserMainFeedRef = firebase
              .firestore()
              .collection('social_feeds')
              .doc(userID)
              .collection('main_feed')
              .doc(comment.postID);
            batch.set(
              otherUserMainFeedRef,
              {
                commentCount: commentCount,
              },
              {
                merge: true,
              },
            );
          });
          batch.commit();
          unsubscribeInbound();
          unsubscribeOutbound();
        },
      );
    },
  );
};
