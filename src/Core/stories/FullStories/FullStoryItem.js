import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { observer } from 'mobx-react';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import CircleSnail from 'react-native-progress/CircleSnail';
import TNVideo from '../../truly-native/TNVideo/TNVideo';
import TNImage from '../../truly-native/TNImage/TNImage';
import store from './Store';
import Indicator from './Indicator';

const circleSnailProps = { thickness: 1, color: '#ddd', size: 80 };

const { width, height } = Dimensions.get('window');
const closeButtonSize = Math.floor(height * 0.032);

@observer
export default class FullStoryItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      calcImgHeight: height * 0.4,
    };

    this.onPressActive = false;
    this.onPressOutActive = false;
    this.onLongPressActive = false;

    this.imageLoading = false;
    this.imageDoneLoading = false;

    this.videoLoading = true;
    this.videoRef = React.createRef();
  }

  handleBackOnPress = () => {
    this.onPressActive = true;
    store.onPrevItem();
  };

  handleOnLongPress = async () => {
    this.onLongPressActive = true;
    store.pause();
    await this.videoRef.current.pauseAsync();
  };

  handleOnPressOut = async () => {
    if (this.onLongPressActive) {
      store.onNextItem();
      if (this.videoRef.current) {
        await this.videoRef.current.playAsync();
      }
    }

    this.onPressActive = false;
    this.onPressOutActive = false;
    this.onLongPressActive = false;
  };

  handleNextOnPress = () => {
    this.onPressActive = true;
    store.onNextItem();
  };

  // onVideoBuffer = () => {
  //   this.videoBuffering = true;
  //   store.pause();
  // };

  onVideoLoadStart = async () => {
    this.videoLoading = true;
  };

  onVideoLoad = async (payload) => {
    this.videoLoading = false;
    await store.setAnimDuration(payload.durationMillis);
    await store.animateIndicator(false);

    if (this.videoRef.current) {
      this.videoRef.current.playAsync(true);
    }
  };

  onImageLoad = (evt) => {
    const ImageHeight = evt.nativeEvent?.source?.height;
    const ImageWidth = evt.nativeEvent?.source?.width;

    const newHeight = Math.floor((ImageHeight / ImageWidth) * width);

    if (newHeight) {
      this.setState(
        {
          calcImgHeight: newHeight,
        },
        async () => {
          await store.setAnimDuration(5000);
          await store.animateIndicator(false);
        },
      );
    }
  };

  renderCloseButton() {
    return (
      <TouchableWithoutFeedback onPress={store.dismissCarousel}>
        <View style={styles.closeButton}>
          <View
            style={[styles.closeCross, { transform: [{ rotate: '45deg' }] }]}
          />
          <View
            style={[styles.closeCross, { transform: [{ rotate: '-45deg' }] }]}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderIndicators() {
    const { story, currentDeck } = this.props;

    return (
      <View style={styles.indicatorWrap}>
        <View style={styles.indicators}>
          {story.items.map((item, i) => (
            <Indicator
              key={i}
              i={i}
              animate={currentDeck && story.idx == i}
              story={story}
            />
          ))}
        </View>
      </View>
    );
  }

  renderBackButton() {
    return (
      <TouchableWithoutFeedback
        onPress={this.handleBackOnPress}
        onLongPress={this.handleOnLongPress}
        onPressOut={this.handleOnPressOut}>
        <View
          style={[
            styles.back,
            {
              opacity: store.backOpacity,
            },
          ]}
        />
      </TouchableWithoutFeedback>
    );
  }

  renderNextButton() {
    return (
      <TouchableWithoutFeedback
        onPress={this.handleNextOnPress}
        onLongPress={this.handleOnLongPress}
        onPressOut={this.handleOnPressOut}>
        <View
          style={[
            styles.next,
            {
              opacity: store.backOpacity,
            },
          ]}
        />
      </TouchableWithoutFeedback>
    );
  }

  renderMedia() {
    const { story, currentDeck } = this.props;
    const { calcImgHeight } = this.state;

    if (story.items[story.idx].type.startsWith('image')) {
      if (currentDeck) {
        return (
          <TNImage
            source={{
              uri: story.items[story.idx] && story.items[story.idx].src,
            }}
            style={[styles.deck, { height: calcImgHeight }]}
            resizeMode={'contain'}
            onLoad={this.onImageLoad}
            onError={async () => {
              await store.pause();
            }}
          />
        );
      } else {
        return null;
      }
    } else {
      if (currentDeck) {
        return (
          <View style={[{ flex: 1 }, styles.centerItem]}>
            {this.videoLoading && (
              <View
                style={[
                  styles.deck,
                  {
                    backgroundColor: 'transparent',
                    height: calcImgHeight,
                  },
                  styles.centerItem,
                ]}>
                <CircleSnail {...circleSnailProps} />
              </View>
            )}
            <TNVideo
              videoRef={this.videoRef}
              // uri={story.items[story.idx] && story.items[story.idx].src}
              source={{
                uri: story.items[story.idx] && story.items[story.idx].src,
              }}
              onLoad={this.onVideoLoad}
              resizeMode={'contain'}
              onLoadStart={this.onVideoLoadStart}
              style={styles.mediaVideo}
              onError={async () => {
                await store.pause();
              }}
            />
          </View>
        );
      } else {
        return null;
      }
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={store.onNextItem}
        delayPressIn={200}
        onPressIn={store.pause}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          {this.renderMedia()}
          {this.renderIndicators()}
          {this.renderCloseButton()}
          {this.renderBackButton()}
          {this.renderNextButton()}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  deck: {
    width,
    backgroundColor: 'black',
  },

  progressIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },

  indicatorWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  indicators: {
    height: 30,
    ...ifIphoneX(
      {
        marginTop: 20,
      },
      {
        marginTop: 2,
      },
    ),
    alignItems: 'center',
    paddingHorizontal: 8,
    flexDirection: 'row',
  },
  indicatorBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
  },

  back: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 110,
  },
  next: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 160,
  },

  closeButton: {
    position: 'absolute',
    ...ifIphoneX(
      {
        top: 45,
      },
      {
        top: 25,
      },
    ),
    right: 10,
    height: closeButtonSize,
    width: closeButtonSize,
    borderRadius: Math.floor(closeButtonSize / 2),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c4c5c4',
    opacity: 0.7,
    zIndex: 2,
  },
  closeCross: {
    width: '68%',
    height: 1,
    backgroundColor: 'black',
  },
  mediaVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  centerItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
