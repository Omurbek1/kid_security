import { Dimensions, GestureResponderEvent } from 'react-native';

import { TSildeDirection } from '@analytics';

const { width, height } = Dimensions.get('window');

type TUseSwipeProp = {
  onSwipeLeft?: (a: TSildeDirection) => void;
  onSwipeRight?: (a: TSildeDirection) => void;
  onSwipeUp?: (a: TSildeDirection) => void;
  onSwipeDown?: (a: TSildeDirection) => void;
};
type TUseSwipe = (
  swipeHandlers: TUseSwipeProp,
  SWIPE_THRESHOLD?: number
) => { onTouchStart: (e: GestureResponderEvent) => void; onTouchEnd: (e: GestureResponderEvent) => void };

const useSwipe: TUseSwipe = ({ onSwipeLeft, onSwipeDown, onSwipeRight, onSwipeUp }, SWIPE_THRESHOLD = 4) => {
  let firstTouchX = 0;
  let firstTouchY = 0;

  function onTouchStart(e: GestureResponderEvent) {
    firstTouchX = e.nativeEvent.pageX;
    firstTouchY = e.nativeEvent.pageY;
  }

  function onTouchEnd(e: GestureResponderEvent) {
    const positionX = e.nativeEvent.pageX;
    const positionY = e.nativeEvent.pageY;

    const rangeX = width / SWIPE_THRESHOLD;
    const rangeY = height / SWIPE_THRESHOLD;

    if (positionX - firstTouchX > rangeX) {
      onSwipeRight && onSwipeRight('right');
    } else if (firstTouchX - positionX > rangeX) {
      onSwipeLeft && onSwipeLeft('left');
    } else if (positionY - firstTouchY > rangeY) {
      onSwipeDown && onSwipeDown('down');
    } else if (firstTouchY - positionY > rangeY) {
      onSwipeUp && onSwipeUp('up');
    }
  }

  return { onTouchStart, onTouchEnd };
};

export default useSwipe;
