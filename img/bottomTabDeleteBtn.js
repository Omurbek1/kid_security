import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function BottomTabDeleteBtn(props) {
  return (
    <Svg width={23} height={23} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path
        d="M11.5 22.993c6.351 0 11.5-5.146 11.5-11.493S17.851.008 11.5.008 0 5.153 0 11.5c0 6.347 5.149 11.493 11.5 11.493z"
        fill="#E04F5F"
      />
      <Path d="M15.149 16.925l1.778-1.778-9.074-9.074L6.074 7.85l9.075 9.074z" fill="#fff" />
      <Path d="M7.853 16.928l9.074-9.075-1.778-1.778-9.074 9.074 1.778 1.779z" fill="#fff" />
    </Svg>
  );
}

export default BottomTabDeleteBtn;
