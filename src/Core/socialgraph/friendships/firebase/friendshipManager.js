import * as firebaseFriendship from './friendship';

/*
 ** This object is in charge of fetching and hydrating inbound, outbound and reciprocal friendships.
 ** The user hydration data comes from the users array, passed in the constructor
 */
export default class FriendshipManager {
  constructor(extendFollowers, callback) {
    this.extendFollowers = extendFollowers; // if this is true, we extend friends to non-mutual follow statuses
    this.callback = callback;
  }

  fetchFriendships = (userID) => {
    this.inboundFriendshipsUnsubscribe = firebaseFriendship.subscribeToInboundFriendships(
      userID,
      this.onInboundFriendshipsUpdate,
    );
    this.outboundFriendshipsUnsubscribe = firebaseFriendship.subscribeToOutboundFriendships(
      userID,
      this.onOutboundFriendshipsUpdate,
    );
  };

  unsubscribe = () => {
    if (this.inboundFriendshipsUnsubscribe) {
      this.inboundFriendshipsUnsubscribe();
    }
    if (this.outboundFriendshipsUnsubscribe) {
      this.outboundFriendshipsUnsubscribe();
    }
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
    if (inboundFriendships && outboundFriendships) {
      // we received all the data we need - users, inbound requests, outbound requests
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

      const hydratedFriends = inboundFriendships.filter(
        (user) => outboundFriendsIDs[user.id] == true,
      ); // reciprocal friendship (Facebook style)
      const friendshipsFromFriends = hydratedFriends.map((friend) => {
        return {
          user: friend,
          type: 'reciprocal',
        };
      });

      const friendshipsFromInbound = inboundFriendships.map((user) => {
        return {
          user: user,
          type: 'inbound',
        };
      });

      const friendshipsFromOutbound = outboundFriendships.map((user) => {
        return {
          user: user,
          type: 'outbound',
        };
      });

      if (this.callback) {
        this.callback(
          friendshipsFromFriends,
          friendshipsFromInbound,
          friendshipsFromOutbound,
        );
      }
    }
  }
}
