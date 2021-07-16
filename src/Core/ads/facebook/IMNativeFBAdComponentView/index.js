import React, { useState } from 'react';
import * as FacebookAds from 'expo-ads-facebook';
const { AdIconView, AdMediaView, AdTriggerView } = FacebookAds;
import TruncateText from 'react-native-view-more-text';
import { Image, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

function IMNativeFBAdComponentView(props) {
  const { nativeAd } = props;
  /*
    The nativeAd object can contain the following properties:
        // advertiserName - The name of the Facebook Page or mobile app that represents the business running each ad.
        // headline - The headline that the advertiser entered when they created their ad. This is usually the ad's main title.
        // linkDescription - Additional information that the advertiser may have entered.
        // adTranslation - The word 'ad', translated into the language based upon Facebook app language setting.
        // promotedTranslation - The word 'promoted', translated into the language based upon Facebook app language setting.
        // sponsoredTranslation - The word 'sponsored', translated into the language based upon Facebook app language setting.
        // bodyText - Ad body
        // callToActionText - Call to action phrase, e.g. - "Install Now"
        // socialContext - social context for the Ad, for example "Over half a million users"
    */

  return (
    <View style={styles.container}>
      <AdTriggerView style={styles.adTriggerView}>
        <View style={styles.headerContainer}>
          <View style={styles.adIconViewContainer}>
            <AdIconView style={styles.adIconView} />
          </View>
          <Text>{nativeAd.advertiserName}</Text>
        </View>

        {nativeAd.bodyText && (
          <View style={styles.textContainer}>
            <TruncateText numberOfLines={2} textStyle={styles.body}>
              <Text>{nativeAd.bodyText}</Text>
            </TruncateText>
          </View>
        )}

        <AdMediaView style={styles.mediaView} />
      </AdTriggerView>
    </View>
  );
}

export default FacebookAds.withNativeAd(IMNativeFBAdComponentView);
