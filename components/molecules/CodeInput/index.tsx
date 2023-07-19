import React, { Component } from 'react';
import {
  I18nManager,
  KeyboardTypeOptions,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

interface IProps extends TextInputProps {
  value?: string;
  codeLength?: number;
  cellSize?: number;
  cellSpacing?: number;

  placeholder?: any;
  mask?: any;
  maskDelay?: number;
  password?: boolean;

  autoFocus?: boolean;

  restrictToNumbers?: boolean;

  containerStyle?: StyleProp<ViewStyle>;

  cellStyle?: StyleProp<ViewStyle>;
  cellStyleFocused?: StyleProp<ViewStyle>;
  cellStyleFilled?: StyleProp<ViewStyle>;

  textStyle?: StyleProp<TextStyle>;
  textStyleFocused?: StyleProp<TextStyle>;

  animationFocused?: any;

  onFulfill: () => void;
  onChangeText: () => void;
  onBackspace: () => void;

  keyboardType: KeyboardTypeOptions;
  editable: boolean;
  inputProps?: any;
}

const styles = StyleSheet.create({
  containerDefault: {},
  cellDefault: {
    borderWidth: 1,
  },
  cellFocusedDefault: {
    borderColor: 'black',
    borderWidth: 2,
  },
  textStyleDefault: {
    color: '#D4D4D4',
    fontSize: 24,
  },
  textStyleFocusedDefault: {
    color: 'black',
  },
});

class CodeInput extends Component<IProps> {
  static defaultProps = {
    value: '',
    codeLength: 6,
    cellSize: 48,
    cellSpacing: 4,
    placeholder: '',
    password: false,
    mask: '*',
    maskDelay: 200,
    keyboardType: 'numeric',
    autoFocus: false,
    restrictToNumbers: false,
    containerStyle: styles.containerDefault,
    cellStyle: styles.cellDefault,
    cellStyleFocused: styles.cellFocusedDefault,
    textStyle: styles.textStyleDefault,
    textStyleFocused: styles.textStyleFocusedDefault,
    animationFocused: 'pulse',
    editable: true,
    inputProps: {},
  };

  state = {
    maskDelay: false,
    focused: false,
  };

  ref = React.createRef();
  inputRef = React.createRef();

  shake = () => this.ref.current.shake(650);

  focus = () => this.inputRef.current.focus();

  blur = () => this.inputRef.current.blur();

  _inputCode = (code) => {
    const { password, codeLength = 6, onTextChange, onFulfill } = this.props;

    if (this.props.restrictToNumbers) {
      code = (code.match(/[0-9]/g) || []).join('');
    }

    if (onTextChange) {
      onTextChange(code);
    }
    if (code.length === codeLength && onFulfill) {
      onFulfill(code);
    }

    const maskDelay = password && code.length > this.props.value.length;

    this.setState({ maskDelay });

    if (maskDelay) {
      const maskTimeout = setTimeout(() => {
        this.setState({ maskDelay: false });
        clearTimeout(maskTimeout);
      }, this.props.maskDelay);
    }
  };

  _keyPress = (event) => {
    if (event.nativeEvent.key === 'Backspace') {
      const { value, onBackspace } = this.props;

      if (value === '' && onBackspace) {
        onBackspace();
      }
    }
  };

  _onFocused = (focused) => {
    this.setState({ focused });
  };

  render() {
    const {
      value,
      codeLength,
      cellSize,
      cellSpacing,
      placeholder,
      password,
      mask,
      autoFocus,
      containerStyle,
      cellStyle,
      cellStyleFocused,
      cellStyleFilled,
      textStyle,
      textStyleFocused,
      keyboardType,
      animationFocused,
      testID,
      editable,
      inputProps,
    } = this.props;
    const { maskDelay, focused } = this.state;

    return (
      <Animatable.View
        ref={this.ref}
        style={[
          {
            alignItems: 'stretch',
            flexDirection: 'row',
            justifyContent: 'center',
            position: 'relative',
            width: cellSize * codeLength + cellSpacing * (codeLength - 1),
            height: cellSize,
          },
          containerStyle,
        ]}>
        <View
          style={{
            position: 'absolute',
            margin: 0,
            height: '100%',
            flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
          }}>
          {/* eslint-disable-next-line */}
          {Array.apply(null, Array(codeLength)).map((_, idx) => {
            const cellFocused = focused && idx === value.length;
            const filled = idx < value.length;
            const last = idx === value.length - 1;
            const showMask = filled && password && (!maskDelay || !last);
            const isPlaceholderText = typeof placeholder === 'string';
            const isMaskText = typeof mask === 'string';
            const pinCodeChar = value.charAt(idx);

            let cellText = null;

            if (filled || !isPlaceholderText) {
              cellText = showMask && isMaskText ? mask : pinCodeChar;
            } else {
              cellText = placeholder;
            }

            const placeholderComponent = !isPlaceholderText && placeholder;
            const maskComponent = showMask && !isMaskText && mask;
            const isCellText = typeof cellText === 'string';

            return (
              <Animatable.View
                key={`${toString(idx)} ${Math.random() * 100}`}
                style={[
                  {
                    width: cellSize,
                    height: cellSize,
                    marginLeft: cellSpacing / 2,
                    marginRight: cellSpacing / 2,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  cellStyle,
                  cellFocused ? cellStyleFocused : {},
                  filled ? cellStyleFilled : {},
                  showMask ? { borderColor: '#ef4c77' } : { borderColor: '#D4d4d4' },
                ]}
                animation={idx === value.length && focused ? animationFocused : null}
                iterationCount="infinite"
                duration={500}>
                {isCellText && !maskComponent && (
                  <Text style={[textStyle, cellFocused ? textStyleFocused : {}, showMask ? { color: 'black' } : {}]}>
                    {cellText}
                  </Text>
                )}

                {isCellText ? maskComponent : placeholderComponent}
              </Animatable.View>
            );
          })}
        </View>
        <TextInput
          value={value}
          ref={this.inputRef}
          onChangeText={this._inputCode}
          onKeyPress={this._keyPress}
          onFocus={() => this._onFocused(true)}
          onBlur={() => this._onFocused(false)}
          spellCheck={false}
          autoFocus={autoFocus}
          keyboardType={keyboardType}
          numberOfLines={1}
          caretHidden
          maxLength={codeLength}
          selection={{
            start: value.length,
            end: value.length,
          }}
          style={{
            flex: 1,
            opacity: 0,
            textAlign: 'center',
          }}
          testID={testID || undefined}
          editable={editable}
          {...inputProps}
        />
      </Animatable.View>
    );
  }
}

export default CodeInput;
