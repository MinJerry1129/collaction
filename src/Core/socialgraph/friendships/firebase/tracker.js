import {
  setFriendsListenerDidSubscribe,
  setFriends,
  setFriendships,
} from '../redux';
import { setUserData } from '../../../onboarding/redux/auth';
import { setBannedUserIDs } from '../../../user-reporting/redux';
import * as firebaseFriendship from './friendship';
import { firebaseUser } from './../../../firebase';
import { FriendshipConstants } from '../constants';
import { reportingManager } from '../../../user-reporting';

export default class FriendshipTracker {
  constructor(
    reduxStore,
    userID,
    persistFriendshipsCounts = false,
    extendFollowers = false,
    enableFeedUpdates = false,
  ) {
    this.reduxStore = reduxStore;
    this.userID = userID;
    this.extendFollowers = extendFollowers; // if this is true, we extend friends to non-mutual follow statuses
    this.persistFriendshipsCounts = persistFriendshipsCounts; // if this is true, we persist the inbound and outbound counts in the users table
    this.enableFeedUpdates = enableFeedUpdates; // if this is true, we make extra hydrations & clean ups for stories & feed posts in social networks
  }

  subscribeIfNeeded = () => {
    const userId = this.userID;
    const state = this.reduxStore.getState();
    if (!state.friends.didSubscribeToFriendships) {
      this.reduxStore.dispatch(setFriendsListenerDidSubscribe());
      this.currentUserUnsubscribe = firebaseUser.subscribeCurrentUser(
        userId,
        this.onCurrentUserUpdate,
      );
      this.abusesUnsubscribe = reportingManager.unsubscribeAbuseDB(
        userId,
        this.onAbusesUpdate,
      );
      this.inboundFriendshipsUnsubscribe = firebaseFriendship.subscribeToInboundFriendships(
        userId,
        this.onInboundFriendshipsUpdate,
      );
      this.outboundFriendshipsUnsubscribe = firebaseFriendship.subscribeToOutboundFriendships(
        userId,
        this.onOutboundFriendshipsUpdate,
      );
    }
  };

  unsubscribe = () => {
    if (this.currentUserUnsubscribe) {
      this.currentUserUnsubscribe();
    }
    if (this.inboundFriendshipsUnsubscribe) {
      this.inboundFriendshipsUnsubscribe();
    }
    if (this.outboundFriendshipsUnsubscribe) {
      this.outboundFriendshipsUnsubscribe();
    }
    if (this.abusesUnsubscribe) {
      this.abusesUnsubscribe();
    }
  };

  addFriendRequest = (fromUser, toUser, callback) => {
    if (fromUser.id == toUser.id) {
      callback(null);
      return;
    }

    const state = this.reduxStore.getState();
    const friendships = state.friends.friendships;
    const detectedFriendship = friendships.find(
      (friendship) => friendship.user.id == toUser.id,
    );
    if (
      detectedFriendship &&
      detectedFriendship.type != FriendshipConstants.FriendshipType.inbound
    ) {
      // invalid state - current user already requested a friendship from toUser
      callback(null);
      return;
    }

    firebaseFriendship.addFriendRequest(
      fromUser,
      toUser,
      this.persistFriendshipsCounts,
      this.extendFollowers,
      this.enableFeedUpdates,
      (response) => {
        if (this.extendFollowers == false) {
          // We added someone as a friend, so we populate both timelines if the users just became friends
          const friendships = state.friends.friendships;
          const detectedFriendship = friendships.find(
            (friendship) =>
              friendship.user.id == toUser.id &&
              friendship.type == FriendshipConstants.FriendshipType.inbound,
          );
          if (detectedFriendship) {
            firebaseFriendship.updateFeedsForNewFriends(fromUser.id, toUser.id);
          }
        }
        callback(response);
      },
    );
  };

  unfriend = (outBound, toUser, callback) => {
    if (outBound.id == toUser.id) {
      callback(null);
      return;
    }

    firebaseFriendship.unfriend(
      outBound.id || outBound.userID,
      toUser.id || outBound.userID,
      this.persistFriendshipsCounts,
      this.enableFeedUpdates,
      callback,
    );
  };

  cancelFriendRequest = (outBound, toUser, callback) => {
    if (outBound.id == toUser.id) {
      callback(null);
      return;
    }
    firebaseFriendship.cancelFriendRequest(
      outBound.id || outBound.userID,
      toUser.id || outBound.userID,
      this.persistFriendshipsCounts,
      this.enableFeedUpdates,
      callback,
    );
  };

  onCurrentUserUpdate = (user) => {
    this.reduxStore.dispatch(setUserData({ user }));
  };

  onAbusesUpdate = (abuses) => {
    var bannedUserIDs = [];
    abuses.forEach((abuse) => bannedUserIDs.push(abuse.dest));
    this.reduxStore.dispatch(setBannedUserIDs(bannedUserIDs));
    this.bannedUserIDs = bannedUserIDs;
    this.hydrateFriendships();
  };

  onInboundFriendshipsUpdate = (inboundFriendships) => {
    this.inboundFriendships = inboundFriendships;
    this.hydrateFriendships();
  };

  onOutboundFriendshipsUpdate = (outboundFriendships) => {
    this.outboundFriendships = outboundFriendships;
    this.hydrateFriendships();
  };

  hydrateFriendships() {
    const inboundFriendships = this.inboundFriendships;
    const outboundFriendships = this.outboundFriendships;
    const bannedUserIDs = this.bannedUserIDs;
    if (inboundFriendships && outboundFriendships && bannedUserIDs) {
      // we received all the data we need - inbound requests, outbound requests, and user reports
      const outboundFriendsIDs = {};
      outboundFriendships.forEach((friendship) => {
        outboundFriendsIDs[friendship.id] = true;
      });
      const inboundFriendsIDs = {};
      inboundFriendships.forEach((friendship) => {
        inboundFriendsIDs[friendship.id] = true;
      });
      const reciprocalfriendships = inboundFriendships.filter(
        (inboundFriendship) => outboundFriendsIDs[inboundFriendship.id] == true,
      ); // reciprocal
      const friendsIDs = reciprocalfriendships.map(
        (inboundFriendship) => inboundFriendship.id,
      );
      const friendsIDsHash = {};
      friendsIDs.forEach((friendID) => {
        friendsIDsHash[friendID] = true;
      });

      const hydratedFriends = inboundFriendships.filter(
        (user) => outboundFriendsIDs[user.id] == true,
      ); // reciprocal friendship (Facebook style)
      const friendshipsFromFriends = hydratedFriends.map((friend) => {
        return {
          user: friend,
          type: 'reciprocal',
        };
      });

      const friendshipsFromInbound = inboundFriendships
        .filter((friendship) => friendsIDsHash[friendship.id] != true)
        .map((friendship) => {
          return {
            user: friendship,
            type: 'inbound',
          };
        });

      const friendshipsFromOutbound = outboundFriendships
        .filter((friendship) => friendsIDsHash[friendship.id] != true)
        .map((friendship) => {
          return {
            user: friendship,
            type: 'outbound',
          };
        });
      // We remove all friends and friendships from banned users
      var finalFriendships = [
        ...friendshipsFromInbound,
        ...friendshipsFromFriends,
        ...friendshipsFromOutbound,
      ].filter((friendship) => !bannedUserIDs.includes(friendship.user.id));
      // we need to dedup, since outbound and mutual relationships both show up as friends
      var dedupedFriendships = [];
      var tempHash = {};
      finalFriendships.forEach((friendship) => {
        if (tempHash[friendship.user.id] != true) {
          dedupedFriendships.push(friendship);
          tempHash[friendship.user.id] = true;
        }
      });
      finalFriendships = dedupedFriendships;
      this.reduxStore.dispatch(setFriendships(finalFriendships));

      const finalFriends = hydratedFriends.filter(
        (friend) => !bannedUserIDs.includes(friend.id),
      );
      this.reduxStore.dispatch(setFriends(finalFriends));
    }
  }
}
