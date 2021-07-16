import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Text, View, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import { useColorScheme } from 'react-native-appearance';
import ActionSheet from 'react-native-actionsheet';
import TruncateText from 'react-native-view-more-text';
import { Viewport } from '@skele/components';
import { TNStoryItem, TNTouchableIcon } from '../../Core/truly-native';
import { IMRichTextView } from '../../Core/mentions';
import FeedMedia from './FeedMedia';
import dynamicStyles from './styles';
import AppStyles from '../../AppStyles';
import { timeFormat } from '../../Core/';
import { IMLocalized } from '../../Core/localization/IMLocalization';

const ViewportAwareSwiper = Viewport.Aware(Swiper);
// const mediaHeight = 0;
const mediaHeight = AppStyles.WINDOW_HEIGHT * 0.3;

function FeedItem(props) {
  const {
    feedIndex,
    item,
    isLastItem,
    onCommentPress,
    containerStyle,
    onUserItemPress,
    onMediaPress,
    shouldReSizeMedia,
    onReaction,
    onSharePost,
    onDeletePost,
    onUserReport,
    user,
    willBlur,
    shouldDisplayViewAllComments,
    onTextFieldUserPress,
    onTextFieldHashTagPress,
  } = props;

  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);
  let defaultReaction = 'heartUnfilled';

  const [postMediaIndex, setPostMediaIndex] = useState(0);
  const [inViewPort, setInViewPort] = useState(false);

  const [calcMediaHeight, setCalcMediaHeight] = useState(mediaHeight);
  const moreRef = useRef();
  const lastPress = useRef(0);

  // inline actions & counts
  const [reactionCount, setReactionCount] = useState(item.reactionsCount);
  const [selectedIcon, setSelectedIcon] = useState(
    item.myReaction ? 'filledHeart' : defaultReaction,
  );

  useEffect(() => {
    setSelectedIcon(item.myReaction ? 'filledHeart' : defaultReaction);
  }, [item?.myReaction]);

  useEffect(() => {
    setReactionCount(item.reactionsCount);
  }, [item?.reactionsCount]);

  const onReactionPress = async () => {
    // Optimistically update the UI right away for perceived performance reasons
    if (item.myReaction) {
      setSelectedIcon('heartUnfilled');
      if (reactionCount > 0) {
        setReactionCount(reactionCount - 1);
      }
    } else {
      setSelectedIcon('filledHeart');
      setReactionCount(reactionCount + 1);
    }
    onReaction('like', item);
  };

  const onMorePress = () => {
    moreRef.current.show();
  };

  const didPressComment = () => {
    onCommentPress(item, feedIndex);
  };

  const didPressMedia = async (filteredImages, index) => {
    const time = new Date().getTime();
    const delta = time - lastPress.current;
    const DOUBLE_PRESS_DELAY = 400;

    if (delta < DOUBLE_PRESS_DELAY && selectedIcon !== 'filledHeart') {
      const reationCountToUpdate = item.reactions['like'];
      setSelectedIcon('filledHeart');
      setReactionCount(reactionCount + 1);
      onReaction('like', item);
    }
    lastPress.current = time;

    // onMediaPress(filteredImages, index)
  };

  const moreArray = [IMLocalized('Share Post')];

  if (item.authorID === user.id) {
    moreArray.push(IMLocalized('Delete Post'));
  } else {
    moreArray.push(IMLocalized('Block User'));
    moreArray.push(IMLocalized('Report Post'));
  }

  moreArray.push(IMLocalized('Cancel'));

  const onMoreDialogDone = (index) => {
    if (index === moreArray.indexOf(IMLocalized('Share Post'))) {
      onSharePost(item);
    }

    if (
      index === moreArray.indexOf(IMLocalized('Report Post')) ||
      index === moreArray.indexOf(IMLocalized('Block User'))
    ) {
      onUserReport(item, moreArray[index]);
    }

    if (index === moreArray.indexOf(IMLocalized('Delete Post'))) {
      onDeletePost(item);
    }
  };

  const inactiveDot = () => <View style={styles.inactiveDot} />;

  const activeDot = () => <View style={styles.activeDot} />;

  const renderViewMore = (onPress) => {
    return (
      <Text onPress={onPress} style={styles.moreText}>
        {'more'}
      </Text>
    );
  };

  const renderViewLess = (onPress) => {
    return (
      <Text onPress={onPress} style={styles.moreText}>
        {'less'}
      </Text>
    );
  };

  const onMediaResize = ({ height }) => {
    const maxMediaHeight = Math.floor(AppStyles.WINDOW_HEIGHT * 10);
    if (shouldReSizeMedia && height) {
      setCalcMediaHeight(height > maxMediaHeight ? maxMediaHeight : height);
    }
  };

  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.9}
      onPress={didPressComment}
      style={[styles.container, containerStyle]}>
      <View style={styles.headerContainer}>
        <TNStoryItem
          imageStyle={styles.userImage}
          imageContainerStyle={styles.userImageContainer}
          containerStyle={styles.userImageMainContainer}
          item={item.author}
          onPress={onUserItemPress}
          appStyles={AppStyles}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {item.author.username ? item.author.username : item.author.firstName} 
          </Text>
          <View style={styles.mainSubtitleContainer}>
            <View style={[styles.subtitleContainer, { flex: 2 }]}>
              <Text style={styles.subtitle}>{item.location.substring(0,4) === 'null' ? null : item.location}</Text>
            </View>
          </View>
        </View>
        <TNTouchableIcon
          onPress={onMorePress}
          imageStyle={styles.moreIcon}
          containerStyle={styles.moreIconContainer}
          iconSource={AppStyles.iconSet.more}
          appStyles={AppStyles}
        />
      </View>
      {item.postMedia && item.postMedia.length > 0 && (
        <View style={styles.feedImage}>
          <ViewportAwareSwiper
            removeClippedSubviews={false}
            style={styles.feedImage}
            dot={inactiveDot()}
            activeDot={activeDot()}
            paginationStyle={{
              bottom: 20,
            }}
            onIndexChanged={(swiperIndex) => setPostMediaIndex(swiperIndex)}
            loop={false}
            onViewportEnter={() => setInViewPort(true)}
            onViewportLeave={() => setInViewPort(false)}
            preTriggerRatio={-0.6}>
            {item.postMedia.map((media, index) => (
              <FeedMedia
                key={index + ''}
                inViewPort={inViewPort}
                index={index}
                postMediaIndex={postMediaIndex}
                media={media}
                item={item}
                isLastItem={isLastItem}
                onMediaResize={onMediaResize}
                onMediaPress={didPressMedia}
                dynamicStyles={styles}
                willBlur={willBlur}
              />
            ))}
          </ViewportAwareSwiper>
        </View>
      )}

      <View style={styles.footerContainer}>
        <TNTouchableIcon
          containerStyle={styles.footerIconContainer}
          iconSource={AppStyles.iconSet[selectedIcon]}
          imageStyle={[
            styles.footerIcon,
            selectedIcon === 'heartUnfilled' && styles.tintColor,
          ]}
          renderTitle={true}
          onPress={onReactionPress}
          appStyles={AppStyles}
        />
        {reactionCount > 0 && (
          <Text style={[styles.footerText]}>
            {reactionCount === 1
              ? `${reactionCount}`
              : `${reactionCount}`}
          </Text>
        )}
        <TNTouchableIcon
          containerStyle={styles.footerIconContainer}
          iconSource={AppStyles.iconSet.commentUnfilled}
          imageStyle={[styles.footerIcon, styles.tintColor]}
          renderTitle={true}
          onPress={didPressComment}
          appStyles={AppStyles}
        />
        {shouldDisplayViewAllComments && item.commentCount > 0 && (
          <TouchableOpacity activeOpacity={1} onPress={didPressComment} style={{marginTop: '4%'}}>
            <Text style={[styles.footerText]}>
              {item.commentCount === 1
                ? `${item.commentCount}`
                : `${item.commentCount}`}
            </Text>
          </TouchableOpacity>
        )}
        <Text style={[styles.footerSubText, {marginLeft: '55%'}]}>{timeFormat(item.createdAt)} </Text>
      </View>
      <TruncateText
        numberOfLines={2}
        renderViewMore={renderViewMore}
        renderViewLess={renderViewLess}
        textStyle={styles.body}>
        <IMRichTextView
          defaultTextStyle={styles.body}
          onUserPress={onTextFieldUserPress}
          onHashTagPress={onTextFieldHashTagPress}>
          <Text style={styles.title}>{item.firstName}</Text> {item.postText}
        </IMRichTextView>
      </TruncateText>

      <ActionSheet
        ref={moreRef}
        title={'More'}
        options={moreArray}
        destructiveButtonIndex={moreArray.indexOf('Delete Post')}
        cancelButtonIndex={moreArray.length - 1}
        onPress={onMoreDialogDone}
      />
    </TouchableOpacity>
  );
}

FeedItem.propTypes = {
  onPress: PropTypes.func,
  onOtherReaction: PropTypes.func,
  onLikeReaction: PropTypes.func,
  onUserItemPress: PropTypes.func,
  onCommentPress: PropTypes.func,
  onMediaPress: PropTypes.func,
  item: PropTypes.object,
  shouldUpdate: PropTypes.bool,
  iReact: PropTypes.bool,
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default FeedItem;
