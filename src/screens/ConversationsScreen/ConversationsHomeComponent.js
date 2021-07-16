import React from 'react';
import { ScrollView, View } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import { IMConversationListView } from '../../Core/chat';
import dynamicStyles from './styles';

function ConversationsHomeComponent(props) {
  const { navigation, appStyles, emptyStateConfig } = props;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme, appStyles);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.chatsChannelContainer}>
          <IMConversationListView
            navigation={navigation}
            appStyles={appStyles}
            emptyStateConfig={emptyStateConfig}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default ConversationsHomeComponent;
