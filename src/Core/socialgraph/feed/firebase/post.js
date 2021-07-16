import { IMLocalized } from '../../../localization/IMLocalization';
import { firebaseUser } from '../../../firebase';
import { firebaseFriendship } from '../../friendships';
import { firebase } from '../../../firebase/config';

export const postsRef = firebase.firestore().collection('SocialNetwork_Posts');

export const subscribeToMainFeedPosts = (userID, callback) => {
  const feedPostsRef = firebase
    .firestore()
    .collection('social_feeds')
    .doc(userID)
    .collection('main_feed')
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      { includeMetadataChanges: true },
      (querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((doc) => {
          const post = doc.data();
          post.id = doc.id;
          posts.push(post);
        });
        return callback(posts);
      },
      (error) => {
        console.log(error);
        callback([]);
      },
    );
  return feedPostsRef;
};

export const subscribeToDiscoverFeedPosts = (callback) => {
  const feedPostsRef = postsRef
    .orderBy('createdAt', 'desc')
    .limit(100)
    .onSnapshot(
      { includeMetadataChanges: true },
      (querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((doc) => {
          const post = doc.data();
          post.id = doc.id;
          posts.push(post);
        });
        return callback(posts);
      },
      (error) => {
        console.log(error);
        callback([]);
      },
    );
  return feedPostsRef;
};

export const subscribeToHashtagFeedPosts = (hashtag, callback) => {
  const enityRef = firebase
    .firestore()
    .collection('entities')
    .doc('social_feeds_hashtags')
    .collection(hashtag)
    .orderBy('createdAt', 'desc')
    .limit(100)
    .onSnapshot(
      { includeMetadataChanges: true },
      (querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((doc) => {
          const post = doc.data();
          post.id = doc.id;
          posts.push(post);
        });
        return callback(posts);
      },
      (error) => {
        console.log(error);
        callback([]);
      },
    );
  return enityRef;
};

export const subscribeToProfileFeedPosts = (userID, callback) => {
  const profilePostsRef = postsRef
    .where('authorID', '==', userID)
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      { includeMetadataChanges: true },
      (querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((doc) => {
          const post = doc.data();
          post.id = doc.id;
          posts.push(post);
        });
        return callback(posts);
      },
      (error) => {
        console.log(error);
        alert(error);
        callback([]);
      },
    );
  return profilePostsRef;
};

export const subscribeToSinglePost = (postID, callback) => {
  const singlePostRef = postsRef.where('id', '==', postID).onSnapshot(
    { includeMetadataChanges: true },
    (querySnapshot) => {
      if (querySnapshot.docs && querySnapshot.docs.length > 0) {
        callback(querySnapshot.docs[0].data());
      }
    },
    (error) => {
      console.log(error);
      callback(null);
    },
  );
  return singlePostRef;
};

export const hydrateFeedForNewFriendship = async (destUserID, sourceUserID) => {
  // we take all posts & stories from sourceUserID and populate the feed & stories of destUserID
  const mainFeedDestRef = firebase
    .firestore()
    .collection('social_feeds')
    .doc(destUserID)
    .collection('main_feed');

  const unsubscribeToSourcePosts = postsRef
    .where('authorID', '==', sourceUserID)
    .onSnapshot(
      (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const post = doc.data();
          if (post.id) {
            mainFeedDestRef.doc(post.id).set(post);
          }
        });
        unsubscribeToSourcePosts();
      },
      (error) => {
        console.log(error);
      },
    );
};

export const removeFeedForOldFriendship = async (destUserID, oldFriendID) => {
  // We remove all posts authored by oldFriendID from destUserID's feed
  const mainFeedDestRef = firebase
    .firestore()
    .collection('social_feeds')
    .doc(destUserID)
    .collection('main_feed');

  const unsubscribeToSourcePosts = postsRef
    .where('authorID', '==', oldFriendID)
    .onSnapshot(
      (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const post = doc.data();
          if (post.id) {
            mainFeedDestRef.doc(post.id).delete();
          }
        });
        unsubscribeToSourcePosts();
      },
      (error) => {
        console.log(error);
      },
    );
};

// const filterForReactions = (reactions, post) => {
//   reactions.forEach(reaction => {
//     if (reaction.postID === post.id && reaction.reaction === 'like') {
//       // post.iReact = true;
//       post.reactionType = reaction.reaction;
//     }
//     // else {
//     //   post.iLikePost = false;
//     // }
//   });
// };

const filterForReactions = (reactions, post) => {
  reactions.forEach((reaction) => {
    if (reaction.postID === post.id) {
      post.userReactions = reaction.reactions.sort((a, b) => {
        a = new Date(a.createdAt.seconds);
        b = new Date(b.createdAt.seconds);
        return a > b ? -1 : a < b ? 1 : 0;
      });
    }
  });
};

export const getNewPosts = async (body) => {
  let {
    feedBatchLimit,
    lastVisibleFeed,
    acceptedFriends,
    morePostRef,
    appUser,
    allUsers,
    reactions,
  } = body;

  let postsSortRef;
  let userPosts = [];
  if (morePostRef) {
    postsSortRef = morePostRef;
  } else if (appUser) {
    postsSortRef = postsRef
      .where('authorID', '==', appUser.id)
      .orderBy('createdAt', 'desc')
      .limit(feedBatchLimit);
  } else {
    postsSortRef = postsRef.orderBy('createdAt', 'desc').limit(feedBatchLimit);
  }

  try {
    const documentSnapshots = await postsSortRef.get();

    if (documentSnapshots.docs.length > 0) {
      // Get the last visible post document
      lastVisibleFeed =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];

      let posts = documentSnapshots.docs.map((doc) => {
        return doc.data();
      });

      if (acceptedFriends) {
        posts = posts.filter((post) => {
          return acceptedFriends.find((friend) => {
            return (
              friend.id === post.authorID || friend.userID === post.authorID
            );
          });
        });

        posts = posts.map((post) => {
          const existingFriend = acceptedFriends.find((friend) => {
            return (
              friend.id === post.authorID || friend.userID === post.authorID
            );
          });

          if (reactions) {
            filterForReactions(reactions, post);
          }

          return {
            ...post,
            profilePictureURL: existingFriend.profilePictureURL,
            firstName: existingFriend.firstName || existingFriend.fullname,
            lastName: existingFriend.lastName || '',
          };
        });
      }

      if (allUsers) {
        posts = posts.map((post) => {
          const existingUser = allUsers.find((user) => {
            return user.id === post.authorID || user.userID === post.authorID;
          });

          if (reactions) {
            filterForReactions(reactions, post);
          }

          if (existingUser) {
            return {
              ...post,
              profilePictureURL: existingUser.profilePictureURL,
              firstName: existingUser.firstName || existingUser.fullname,
              lastName: existingUser.lastName || '',
            };
          }
          return {
            ...post,
          };
        });
      }

      if (appUser) {
        userPosts = posts.filter((post) => {
          return appUser.id === post.authorID;
        });

        userPosts = userPosts.map((post) => {
          if (reactions) {
            filterForReactions(reactions, post);
          }

          return {
            ...post,
            profilePictureURL: appUser.profilePictureURL,
            firstName: appUser.firstName || appUser.fullname,
            lastName: appUser.lastName || '',
          };
        });
      }

      // Construct a new query starting at this document,
      if (appUser) {
        postsSortRef = postsRef
          .where('authorID', '==', appUser.id)
          .orderBy('createdAt', 'desc')
          .startAfter(lastVisibleFeed)
          .limit(feedBatchLimit);
      } else {
        postsSortRef = postsRef
          .orderBy('createdAt', 'desc')
          .startAfter(lastVisibleFeed)
          .limit(feedBatchLimit);
      }

      return {
        success: true,
        posts,
        lastVisibleFeed,
        morePostRef: postsSortRef,
        userPosts,
      };
    } else {
      return { success: true, posts: [], lastVisibleFeed, noMorePosts: true };
    }
  } catch (error) {
    console.log('get post error', error);
    return {
      error: 'Oops! an occurred while trying to get post. Please try again.',
      success: false,
    };
  }
};

export const subscribeNewPost = (users, callback) => {
  return postsRef.orderBy('createdAt', 'desc').onSnapshot((querySnapshot) => {
    const posts = [];
    querySnapshot.forEach((doc) => {
      const post = doc.data();
      post.id = doc.id;
      users.forEach((user) => {
        if (user.id === post.authorID || user.userID === post.authorID) {
          post.profilePictureURL = user.profilePictureURL;
          post.firstName = user.firstName || user.fullname;
          post.lastName = user.lastName || '';
          post.reactionType = 'thumbsupUnfilled';
          const date = new Date();
          const seconds = date.getTime() / 1000;
          const createdAtDate = post.createdAt && post.createdAt.seconds;
          const differenceInMin = (seconds - createdAtDate) / 60;
          if (differenceInMin < 1 && post.createdAt) {
            posts.push(post);
          }
        }
      });
    });
    return callback(posts);
  });
};

export const addPost = async (post, followerIDs, author) => {
  post.createdAt = firebase.firestore.FieldValue.serverTimestamp();
  post.author = author;
  try {
    const ref = await postsRef.add(post);
    const finalPost = { ...post, id: ref.id };
    await postsRef.doc(ref.id).update(finalPost);

    // Update posts count
    const postsForThisAuthor = await postsRef
      .where('authorID', '==', author.id)
      .get();
    const postsCount = postsForThisAuthor.docs
      ? postsForThisAuthor.docs.length
      : 0;
    firebaseUser.updateUserData(author.id, { postsCount: postsCount });

    const userIDFeedsToBeUpdated = [author.id].concat(followerIDs);
    // We update the feed for all the friends / followers
    userIDFeedsToBeUpdated.forEach((userID) => {
      const otherUserMainFeedRef = firebase
        .firestore()
        .collection('social_feeds')
        .doc(userID)
        .collection('main_feed');
      otherUserMainFeedRef.doc(finalPost.id).set(finalPost);
    });

    // update feed in respective hashtag collections
    finalPost.hashtags.forEach((hashtag) => {
      const hashtagRef = firebase
        .firestore()
        .collection('entities')
        .doc('social_feeds_hashtags')
        .collection(hashtag)
        .doc(finalPost.id);
      hashtagRef.set(finalPost);
    });

    return { success: true, id: ref.id };
  } catch (error) {
    return { error, success: false };
  }
};

export const updatePost = async (postId, post, followerIDs) => {
  try {
    await postsRef.doc(postId).update({ ...post });
    followerIDs.forEach((userID) => {
      const otherUserMainFeedRef = firebase
        .firestore()
        .collection('social_feeds')
        .doc(userID)
        .collection('main_feed');
      otherUserMainFeedRef.doc(postId).update({ ...post });
    });
    return { success: true };
  } catch (error) {
    console.log(error);
    return { error, success: false };
  }
};

export const getPost = async (postId) => {
  try {
    const post = await postsRef.doc(postId).get();
    return { data: { ...post.data(), id: post.id }, success: true };
  } catch (error) {
    console.log(error);
    return {
      error: 'Oops! an error occurred. Please try again',
      success: false,
    };
  }
};

export const deletePost = async (post, followEnabled) => {
  try {
    await postsRef.doc(post.id).delete();
    // Update posts count
    const postsForThisAuthor = await postsRef
      .where('authorID', '==', post.authorID)
      .get();
    const postsCount = postsForThisAuthor.docs.length;
    firebaseUser.updateUserData(post.authorID, { postsCount: postsCount });

    if (followEnabled) {
      removePostFromAllTimelines(post);
    } else {
      removePostFromAllFriendsTimelines(post);
    }
    removePostFromAllEntities(post);
    return {
      message: IMLocalized('Post was successfully deleted.'),
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      error: IMLocalized('Oops! an error occurred. Please try again'),
      success: false,
    };
  }
};

const removePostFromAllTimelines = async (post) => {
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
        const feedPostsRef = firebase
          .firestore()
          .collection('social_feeds')
          .doc(userID)
          .collection('main_feed')
          .doc(post.id);
        batch.delete(feedPostsRef);
      });
      // Commit the batch
      batch.commit();
      unsubscribe();
    },
  );
};

const removePostFromAllFriendsTimelines = async (post) => {
  // We fetch all users who follow the author of the post and update their timelines
  const unsubscribeInbound = firebaseFriendship.subscribeToInboundFriendships(
    post.authorID,
    (inboundFriendships) => {
      const unsubscribeOutbound = firebaseFriendship.subscribeToInboundFriendships(
        post.authorID,
        (outboundFriendships) => {
          const inboundUserIDs = inboundFriendships.map(
            (friendship) => friendship.id,
          );
          const outboundUserIDs = outboundFriendships.map(
            (friendship) => friendship.id,
          );
          const allUserIDsToBeUpdated = [post.authorID].concat(
            inboundUserIDs.filter((id) => outboundUserIDs.includes(id)),
          );

          const db = firebase.firestore();
          let batch = db.batch();
          allUserIDsToBeUpdated.forEach((userID) => {
            const feedPostsRef = firebase
              .firestore()
              .collection('social_feeds')
              .doc(userID)
              .collection('main_feed')
              .doc(post.id);
            batch.delete(feedPostsRef);
          });
          // Commit the batch
          batch.commit();
          unsubscribeInbound();
          unsubscribeOutbound();
        },
      );
    },
  );
};

const removePostFromAllEntities = (post) => {
  if (post.hashtags) {
    const db = firebase.firestore();
    const batch = db.batch();

    post.hashtags.forEach((hashtag) => {
      const hashtagRef = db
        .collection('entities')
        .doc('social_feeds_hashtags')
        .collection(hashtag)
        .doc(post.id);

      batch.delete(hashtagRef);
    });

    batch.commit();
  }
};
