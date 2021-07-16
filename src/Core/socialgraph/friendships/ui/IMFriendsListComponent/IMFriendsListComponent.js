import React from 'react';
import { FlatList, View } from 'react-native';

import PropTypes from 'prop-types';
import { IMFriendItem } from '../..';
import { IMUserSearchModal } from '../..';
import { SearchBarAlternate } from '../../../..';
import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';
import { IMLocalized } from '../../../../localization/IMLocalization';
import {
  TNEmptyStateView,
  TNActivityIndicator,
} from '../../../../truly-native';

function IMFriendsListComponent(props) {
  const {
    containerStyle,
    onFriendAction,
    friendsData,
    onFriendItemPress,
    displayActions,
    appStyles,
    isLoading,
    followEnabled,
    viewer,
    searchBar,
    onSearchBarPress,
    emptyStateConfig,
  } = props;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);
  const renderItem = ({ item }) => (
    <IMFriendItem
      onFriendItemPress={onFriendItemPress}
      item={item}
      onFriendAction={onFriendAction}
      displayActions={displayActions && item.user.id != viewer.id}
      appStyles={appStyles}
      followEnabled={followEnabled}
    />
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {searchBar && (
        <SearchBarAlternate
          onPress={onSearchBarPress}
          placeholderTitle={IMLocalized('Search for friends')}
          appStyles={appStyles}
        />
      )}
      {friendsData && friendsData.length > 0 && (
        <FlatList
          data={friendsData}
          renderItem={renderItem}
          keyExtractor={(item) => item.user.id}
        />
      )}
      {!friendsData ||
        (friendsData.length <= 0 && (
          <View style={styles.emptyViewContainer}>
            <TNEmptyStateView
              emptyStateConfig={emptyStateConfig}
              appStyles={appStyles}
            />
          </View>
        ))}
      {(isLoading || friendsData == null) && (
        <TNActivityIndicator appStyles={appStyles} />
      )}
    </View>
  );
}

IMFriendsListComponent.propTypes = {
  onCommentPress: PropTypes.func,
  onFriendItemPress: PropTypes.func,
  actionIcon: PropTypes.bool,
  searchBar: PropTypes.bool,
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  friendsData: PropTypes.array,
  onSearchBarPress: PropTypes.func,
  searchData: PropTypes.array,
  onSearchTextChange: PropTypes.func,
  isSearchModalOpen: PropTypes.bool,
  onSearchModalClose: PropTypes.func,
  onSearchClear: PropTypes.func,
};

export default IMFriendsListComponent;
