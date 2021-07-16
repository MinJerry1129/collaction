import IMFeedActionsConstants from './types';

export const setMainFeedPosts = (data) => ({
  type: IMFeedActionsConstants.SET_MAIN_FEED_POSTS,
  data,
});

export const setCurrentUserFeedPosts = (data) => ({
  type: IMFeedActionsConstants.SET_CURRENT_USER_FEED_POSTS,
  data,
});

export const setDiscoverFeedPosts = (data) => ({
  type: IMFeedActionsConstants.SET_DISCOVER_FEED_POSTS,
  data,
});

export const setFeedPostReactions = (data) => ({
  type: IMFeedActionsConstants.SET_MAIN_FEED_POST_REACTIONS,
  data,
});

export const setMainStories = (data) => ({
  type: IMFeedActionsConstants.SET_MAIN_STORIES,
  data,
});

export const setFeedListenerDidSubscribe = () => ({
  type: IMFeedActionsConstants.DID_SUBSCRIBE,
});
