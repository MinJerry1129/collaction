import { FriendshipConstants } from './constants';

export const followerIDs = (friendships, friends, followEnabled) => {
  if (!followEnabled) {
    return friends.map((friend) => friend.id);
  }
  return friendships
    .filter(
      (friendship) =>
        friendship.type == FriendshipConstants.FriendshipType.inbound ||
        friendship.type == FriendshipConstants.FriendshipType.reciprocal,
    )
    .map((friendship) => friendship.user.id);
};
