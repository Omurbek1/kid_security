import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View, ScrollView } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators as controlMiddlewareActionCreators } from '../wire/ControlMiddleware';
import NavigationService from '../navigation/NavigationService';
import { CustomProgressBar } from '../Utils';
import { L } from '../lang/Lang';
import UserPrefs from '../UserPrefs';
import KsListItem from '../components/atom/KsListItem';
import { getHeader } from '../shared/getHeader';

let list = [];

function initList() {
  list = [
    {
      name: L('lang_ru'),
      lang: 'ru',
    },
    {
      name: L('lang_kz'),
      lang: 'kz',
    },
    {
      name: L('lang_en'),
      lang: 'en',
    },
    {
      name: L('lang_de'),
      lang: 'de',
    },
    {
      name: L('lang_fr'),
      lang: 'fr',
    },
    {
      name: L('lang_it'),
      lang: 'it',
    },
    {
      name: L('lang_uk'),
      lang: 'uk',
    },
    {
      name: L('lang_he'),
      lang: 'he',
    },
    {
      name: L('lang_ar'),
      lang: 'ar',
    },
    {
      name: L('lang_pl'),
      lang: 'pl',
    },
    {
      name: L('lang_tr'),
      lang: 'tr',
    },
    {
      name: L('lang_ko'),
      lang: 'ko',
    },
    {
      name: L('lang_es'),
      lang: 'es',
    },
    {
      name: L('lang_uz'),
      lang: 'uz',
    },
    {
      name: L('romanian'),
      lang: 'ro',
    },
    {
      name: L('armenian'),
      lang: 'hy',
    },
    {
      name: L('Dutch'),
      lang: 'nl',
    },
    {
      name: L('Portuguese'),
      lang: 'pt',
    },
    {
      name: L('Japanese'),
      lang: 'ja',
    },
    {
      name: L('croatian'),
      lang: 'hr',
    },
    {
      name: L('czech'),
      lang: 'cs',
    },
    {
      name: L('greek'),
      lang: 'el',
    },
    {
      name: L('hungarian'),
      lang: 'hu',
    },
    {
      name: L('latvian'),
      lang: 'lv',
    },
    {
      name: L('lithuanian'),
      lang: 'lt',
    },
    {
      name: L('serbian'),
      lang: 'sr',
    },
    {
      name: L('bulgarian'),
      lang: 'bg',
    },
    {
      name: L('azerbaijani'),
      lang: 'az',
    },
    {
      name: L('georgian'),
      lang: 'ka',
    },
    {
      name: L('hindi'),
      lang: 'hi',
    },
    {
      name: L('Chinese'),
      lang: 'zh',
    },
    {
      name: L('indonesian'),
      lang: 'id',
    },
  ];
}

class LanguagePage extends React.Component {
  static _onSave = null;

  static navigationOptions = () => {
    return {
      ...getHeader({ title: L('menu_language') }),
      headerRight: (
        <TouchableOpacity onPress={() => _onSave()}>
          <Text style={styles.btnSave}>{L('done')}</Text>
        </TouchableOpacity>
      ),
    };
  };

  state = {
    isProgress: false,
    progressTitle: null,
    lang: UserPrefs.all.language,
  };

  async UNSAFE_componentWillMount() {
    _onSave = this.onSave.bind(this);
    initList();
  }

  onSave() {
    const { setUserLanguage } = this.props;
    NavigationService.back();

    setTimeout(() => NavigationService.forceReplace('Main'), 0);

    UserPrefs.setLanguage(this.state.lang);
    setUserLanguage(this.state.lang);
  }

  openProgressbar = (title) => {
    this.setState({ isProgress: true, progressTitle: title });
  };

  hideProgressbar = () => {
    this.setState({ isProgress: false });
  };

  onItemPress(item) {
    const lang = item.lang;
    this.setState({ lang });
  }

  render() {
    const { authorized } = this.props;

    return (
      <ScrollView style={{ backgroundColor: 'white', padding: 0, margin: 0 }}>
        {list.map((item) => {
          return (
            <KsListItem
              title={item.name}
              key={item.name}
              onPress={() => this.onItemPress(item)}
              icon={{
                name: 'check',
                type: 'material-community',
                color: item.lang === this.state.lang ? '#FF666F' : '#00000000',
              }}></KsListItem>
          );
        })}
      </ScrollView>
    );
  }
}

// <List containerStyle={[styles.listContainer, { padding: 0, margin: 0 }]}>
//           {list.map((item) => {
//             return (
//               <ListItem
//                 containerStyle={styles.itemContainer}
//                 title={item.name}
//                 key={item.name}
//                 onPress={() => this.onItemPress(item)}
//                 leftIcon={{
//                   name: 'done',
//                   color: item.lang === this.state.lang ? '#FF666F' : '#00000000',
//                 }}
//                 hideChevron={true}
//               />
//             );
//           })}
//         </List>

const mapStateToProps = (state) => {
  const { objects, activeOid } = state.controlReducer;

  return {
    objects,
    activeOid,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserLanguage: bindActionCreators(controlMiddlewareActionCreators.setUserLanguage, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LanguagePage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column',
  },
  logo: {
    marginTop: 25,
    marginBottom: 10,
    width: 120,
    height: 120,
  },
  listContainer: {
    width: '100%',
  },
  itemContainer: {},
  bottomLink: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  backend: {
    opacity: 0.5,
    marginTop: 15,
    fontSize: 10,
  },
  btnSave: {
    paddingRight: 10,
    color: 'white',
  },
});
