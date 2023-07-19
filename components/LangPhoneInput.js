import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { controlActionCreators } from '../reducers/controlRedux';
import { StyleSheet, Linking } from 'react-native';
import * as Utils from '../Utils';
import { L } from '@lang';

import { connectActionSheet } from '@expo/react-native-action-sheet';
import UserPrefs from '../UserPrefs';
import { Ionicons } from '@expo/vector-icons/';

const LANG = [
  {
    title: 'RU',
    name: 'ru',
    localized: 'lang_ru',
    img: require('../img/ic_lang_ru.png'),
  },
  {
    title: 'KZ',
    name: 'kz',
    localized: 'lang_kz',
    img: require('../img/ic_lang_kz.png'),
  },
  {
    title: 'EN',
    name: 'en',
    localized: 'lang_en',
    img: require('../img/ic_lang_en.png'),
  },
  {
    title: 'DE',
    name: 'de',
    localized: 'lang_de',
    img: require('../img/ic_lang_de.png'),
  },
  {
    title: 'FR',
    name: 'fr',
    localized: 'lang_fr',
    img: require('../img/ic_lang_fr.png'),
  },
  {
    title: 'IT',
    name: 'it',
    localized: 'lang_it',
    img: require('../img/ic_lang_it.png'),
  },
  {
    title: 'UK',
    name: 'uk',
    localized: 'lang_uk',
    img: require('../img/ic_lang_uk.png'),
  },
  {
    title: 'HE',
    name: 'he',
    localized: 'lang_he',
    img: require('../img/ic_lang_he.png'),
  },
  {
    title: 'AR',
    name: 'ar',
    localized: 'lang_ar',
    img: require('../img/ic_lang_ar.png'),
  },
  {
    title: 'PL',
    name: 'pl',
    localized: 'lang_pl',
    img: require('../img/ic_lang_pl.png'),
  },
  {
    title: 'TR',
    name: 'tr',
    localized: 'lang_tr',
    img: require('../img/ic_lang_tr.png'),
  },
  {
    title: 'KO',
    name: 'ko',
    localized: 'lang_ko',
    img: require('../img/ic_lang_ko.png'),
  },
  {
    title: 'ES',
    name: 'es',
    localized: 'lang_es',
    img: require('../img/ic_lang_es.png'),
  },
  {
    title: 'UZ',
    name: 'uz',
    localized: 'lang_uz',
    img: require('../img/ic_lang_uz.png'),
  },
  {
    title: 'RO',
    name: 'ro',
    localized: 'romanian',
  },
  {
    title: 'HY',
    name: 'hy',
    localized: 'armenian',
  },
  {
    title: 'NL',
    name: 'nl',
    localized: 'Dutch',
  },
  {
    title: 'PT',
    name: 'pt',
    localized: 'Portuguese',
  },
  {
    title: 'JA',
    name: 'ja',
    localized: 'Japanese',
  },
  {
    title: 'HR',
    name: 'hr',
    localized: 'croatian',
  },
  {
    title: 'CS',
    name: 'cs',
    localized: 'czech',
  },
  {
    title: 'EL',
    name: 'el',
    localized: 'greek',
  },
  {
    title: 'HU',
    name: 'hu',
    localized: 'hungarian',
  },
  {
    title: 'LV',
    name: 'lv',
    localized: 'latvian',
  },
  {
    title: 'LT',
    name: 'lt',
    localized: 'lithuanian',
  },
  {
    title: 'SR',
    name: 'sr',
    localized: 'serbian',
  },
  {
    title: 'BG',
    name: 'bg',
    localized: 'bulgarian',
  },
  {
    title: 'AZ',
    name: 'az',
    localized: 'azerbaijani',
  },
  {
    title: 'KA',
    name: 'ka',
    localized: 'georgian',
  },
  {
    title: 'HI',
    name: 'hi',
    localized: 'hindi',
  },
  {
    title: 'ZH',
    name: 'zh',
    localized: 'Chinese',
  },
  {
    title: 'ID',
    name: 'id',
    localized: 'indonesian',
  },
];

const defaultProps = {
  lang: 'ru',
};

@connectActionSheet
class LangPhoneInput extends Component {
  constructor(props) {
    // Required step: always call the parent class' constructor
    super(props);
    const p = { ...defaultProps, ...props };
    p.lang = UserPrefs.all.language;
    this.state = {
      lang: p.lang,
    };
  }

  onLangPress() {
    const props = { ...defaultProps, ...this.props };
    const options = [];
    Object.values(LANG).map((o) => {
      options.push(L(o.localized));
    });
    options.push(L('cancel'));
    const cancelButtonIndex = options.length - 1;

    const _this = this;
    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex != cancelButtonIndex) {
          const lang = LANG[buttonIndex];
          _this.setState({ lang: lang.name });
          if (props) {
            props.onSelect(lang.name);
          }
        }
      }
    );
  }

  onPhoneChange(phone) {
    const {
      onPhoneChanged,
      setAcceptTermsPhone,
    } = this.props;

    const acceptTermsPhone = Utils.extractPhone(phone);
    setAcceptTermsPhone({ acceptTermsPhone });

    if (onPhoneChanged) {
      onPhoneChanged(acceptTermsPhone);
    }
  }

  render() {
    const { lang } = this.state;
    const {
      acceptTermsPhone,
      acceptTermsPhoneReadonly,
    } = this.props;

    let curLang = LANG[0];
    for (i in LANG) {
      if (lang === LANG[i].name) {
        curLang = LANG[i];
        break;
      }
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.lang_outer} onPress={this.onLangPress.bind(this)}>
          {/* <Image style={styles.lang_img} source={curLang.img} /> */}
          <Text style={styles.lang_title}>{curLang.title}</Text>
          <Ionicons name="md-caret-down-sharp" color="black" size={14} />
        </TouchableOpacity>
        <View style={styles.vline} />
        <View style={styles.phone_outer}>
          <TextInput
            editable={true !== acceptTermsPhoneReadonly}
            style={[styles.phone_input, true === acceptTermsPhoneReadonly ? styles.phone_readonly : {}]}
            value={acceptTermsPhone}
            returnKeyType="done"
            underlineColorAndroid="transparent"
            keyboardType="phone-pad"
            onChangeText={this.onPhoneChange.bind(this)}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    acceptTermsPhone,
    acceptTermsPhoneReadonly,
  } = state.controlReducer;
  return {
    acceptTermsPhone,
    acceptTermsPhoneReadonly,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAcceptTermsPhone: bindActionCreators(controlActionCreators.setAcceptTermsPhone, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LangPhoneInput);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    borderColor: '#FF666F',
    borderWidth: 2,
    height: 50,
  },
  lang_outer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 7,
  },
  phone_outer: {
    flex: 1,
    padding: 7,
  },
  lang_img: {
    width: 24,
    height: 24,
  },
  lang_title: {
    fontSize: 11,
    paddingLeft: 5,
    paddingRight: 2,
    color: '#000',
  },
  phone_input: {
    height: 50,
  },
  phone_readonly: {
    color: '#bebebe',
  },
  vline: {
    width: 5,
    height: '100%',
    borderLeftColor: '#FF666F',
    borderLeftWidth: 2,
  },
});
