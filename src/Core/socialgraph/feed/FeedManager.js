import {
  setMainFeedPosts,
  setDiscoverFeedPosts,
  setFeedPostReactions,
  setMainStories,
  setCurrentUserFeedPosts,
  setFeedListenerDidSubscribe,
} from './redux';
import * as firebasePost from './firebase/post';
import * as firebaseStory from './firebase/story';
import * as firebaseComment from './firebase/comment';
import { setBannedUserIDs } from '../../user-reporting/redux';
import { reportingManager } from '../../user-reporting';

export default class FeedManager {
  constructor(reduxStore, currentUserID) {
    this.reduxStore = reduxStore;
    this.currentUserID = currentUserID;
    this.reduxStore.subscribe(this.syncTrackerToStore);
  }

  syncTrackerToStore = () => {
    // const state = this.reduxStore.getState();
    // const reactionsInRedux = state.feed.feedPostReactions;
    // if (reactionsInRedux
    //   && this.reactions != reactionsInRedux) {
    //   this.reactions = reactionsInRedux;
    //   this.hydratePostsIfNeeded(true);
    // }
  };

  subscribeUserFeedRelatedActions = () => {
    this.abusesUnsubscribe = reportingManager.unsubscribeAbuseDB(
      this.currentUserID,
      this.onAbusesUpdate,
    );

    this.reactionsUnsubscribe = firebaseComment.subscribeToUserReactions(
      this.currentUserID,
      this.onReactionsUpdate,
    );
  };

  subscribeIfNeeded = () => {
    const state = this.reduxStore.getState();
    if (!state.feed.didSubscribeToMainFeed) {
      this.reduxStore.dispatch(setFeedListenerDidSubscribe());
      this.feedUnsubscribe = firebasePost.subscribeToMainFeedPosts(
        this.currentUserID,
        this.onFeedPostsUpdate,
      );
      this.storiesUnsubscribe = firebaseStory.subscribeToStoriesFeed(
        this.currentUserID,
        this.onStoriesUpdate,
      );

      this.subscribeUserFeedRelatedActions();

      this.discoverUnsubscribe = firebasePost.subscribeToDiscoverFeedPosts(
        this.onDiscoverPostsUpdate,
      );
      this.currentProfileFeedUnsubscribe = firebasePost.subscribeToProfileFeedPosts(
        this.currentUserID,
        this.onProfileFeedUpdate,
      );
    }
  };

  subscribeHashtagFeedPosts = (hashtag, callback) => {
    this.hashtagFeedUnsubscribe = firebasePost.subscribeToHashtagFeedPosts(
      hashtag,
      (posts) => this.onHashtagFeedPostsUpdate(posts, callback),
    );
  };

  unsubscribeHashtagFeedPosts = () => {
    if (this.hashtagFeedUnsubscribe) {
      this.hashtagFeedUnsubscribe();
    }
  };

  unsubscribe = () => {
    if (this.feedUnsubscribe) {
      this.feedUnsubscribe();
    }
    if (this.discoverUnsubscribe) {
      this.discoverUnsubscribe();
    }
    if (this.reactionsUnsubscribe) {
      this.reactionsUnsubscribe();
    }
    if (this.storiesUnsubscribe) {
      this.storiesUnsubscribe();
    }
    if (this.currentProfileFeedUnsubscribe) {
      this.currentProfileFeedUnsubscribe();
    }
  };

  applyReaction = (reaction, item, followEnabled = true) => {
    const state = this.reduxStore.getState();
    const reactions = state.feed.feedPostReactions;
    const existingReaction = reactions.find(
      (reaction) => reaction.postID == item.id,
    );
    var newReactions;
    if (followEnabled) {
      if (existingReaction) {
        // like => unlike
        newReactions = reactions.filter(
          (reaction) => reaction.postID != item.id,
        );
      } else {
        // like
        newReactions = reactions.concat([
          {
            postID: item.id,
            reaction: reaction,
          },
        ]);
      }
    } else {
      if (existingReaction) {
        if (reaction == null) {
          // undo previous reaction e.g. angry => null
          newReactions = reactions.filter(
            (reaction) => reaction.postID != item.id,
          );
        } else {
          // replace previous reaction
          newReactions = reactions.filter(
            (reaction) => reaction.postID != item.id,
          ); // remove previous reaction
          newReactions = newReactions.concat([
            // add new different reaction
            {
              postID: item.id,
              reaction: reaction,
            },
          ]);
        }
      } else {
        // got a reaction, with no previous reaction. Add it
        if (reaction != null) {
          newReactions = reactions.concat([
            // add brand new reaction
            {
              postID: item.id,
              reaction: reaction,
            },
          ]);
        }
      }
    }
    this.reactions = newReactions;
    this.hydratePostsIfNeeded();
  };

  hydratePostsWithReduxReactions = (posts) => {
    const state = this.reduxStore.getState();
    const reactions = state.feed.feedPostReactions;
    const bannedUserIDs = state.userReports.bannedUserIDs;
    return this.hydratedPostsWithReactions(posts, reactions, bannedUserIDs);
  };

  onFeedPostsUpdate = (posts) => {
    this.posts = posts;
    this.hydratePostsIfNeeded();
  };

  onDiscoverPostsUpdate = (posts) => {
    this.discoverPosts = posts;
    this.hydratePostsIfNeeded();
  };

  onHashtagFeedPostsUpdate = (posts, callback) => {
    this.hashtagPosts = this.hydratedPostsWithReactions(
      posts,
      this.reactions,
      this.bannedUserIDs,
    );
    callback(this.hashtagPosts);
  };

  onStoriesUpdate = (stories) => {
    this.reduxStore.dispatch(setMainStories(stories));
  };

  onReactionsUpdate = (reactions) => {
    this.reactions = reactions;
    this.hydratePostsIfNeeded();
  };

  onProfileFeedUpdate = (posts) => {
    this.reduxStore.dispatch(setCurrentUserFeedPosts(posts));
  };

  onAbusesUpdate = (abuses) => {
    var bannedUserIDs = [];
    abuses.forEach((abuse) => bannedUserIDs.push(abuse.dest));
    this.reduxStore.dispatch(setBannedUserIDs(bannedUserIDs));
    this.bannedUserIDs = bannedUserIDs;
    this.hydratePostsIfNeeded();
  };

  hydratePostsIfNeeded = (skipReactionReduxUpdate = false) => {
    if (!this.bannedUserIDs) {
      // we are still waiting to fetch banned users
      return;
    }
    // main feed
    if (this.reactions && this.posts) {
      const hydratedPosts = this.hydratedPostsWithReactions(
        this.posts,
        this.reactions,
        this.bannedUserIDs,
      );
      this.reduxStore.dispatch(setMainFeedPosts(hydratedPosts));
      if (!skipReactionReduxUpdate) {
        this.reduxStore.dispatch(setFeedPostReactions(this.reactions));
      }
    }
    // discover feed
    if (this.reactions && this.discoverPosts) {
      this.reduxStore.dispatch(
        setDiscoverFeedPosts(
          this.hydratedPostsWithReactions(
            this.discoverPosts,
            this.reactions,
            this.bannedUserIDs,
          ),
        ),
      );
    }
  };

  hydratedPostsWithReactions = (posts, reactions, bannedUserIDs) => {
    if (reactions && posts) {
      const hydratedPosts = posts
        .map((post) => {
          const reaction = reactions.find(
            (reaction) => reaction.postID == post.id,
          );
          if (reaction) {
            return {
              ...post,
              myReaction: reaction.reaction,
            };
          }
          return {
            ...post,
            myReaction: null, // we need to explicitly remove any previous reaction
          };
        })
        .filter(
          (post) => !bannedUserIDs || !bannedUserIDs.includes(post.authorID),
        );
      return hydratedPosts;
    }
    return posts;
  };
}
