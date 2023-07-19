import UserPrefs from '../UserPrefs';
import ru from './ru.json';
import en from './en.json';
import kz from './kk.json';
import de from './de.json';
import fr from './fr.json';
import ar from './ar.json';
import es from './es.json';
import he from './he.json';
import it from './it.json';
import ko from './ko.json';
import pl from './pl.json';
import tr from './tr.json';
import uk from './uk.json';
import uz from './uz.json';
import ro from './ro.json';
import hy from './hy.json';
import nl from './nl.json';
import pt from './pt.json';
import ja from './ja.json';
import hr from './hr.json';
import cs from './cs.json';
import el from './el.json';
import hu from './hu.json';
import lv from './lv.json';
import lt from './lt.json';
import sr from './sr.json';
import bg from './bg.json';
import az from './az.json';
import ka from './ka.json';
import hi from './hi.json';
import zh from './zh.json';
import id from './id.json';

import { RusLangDefaultRegions } from './regions';

export const lang = {
  ru,
  en,
  kz,
  de,
  fr,
  ar,
  es,
  he,
  it,
  ko,
  pl,
  tr,
  uk,
  uz,
  ro,
  hy,
  nl,
  pt,
  ja,
  hr,
  cs,
  el,
  hu,
  lv,
  lt,
  sr,
  bg,
  az,
  ka,
  hi,
  zh,
  id,
};

export const getLanguageByLocaleAndRegion = (locale, region) => {
  for (let i in lang) {
    if (locale.indexOf(i) > -1) {
      return i;
    }
  }
  return getLanguageByRegion(region);
};

export const getLanguageByRegion = (region) => {
  const isRusDefaultRegion = RusLangDefaultRegions.find((value) => value === region);

  return isRusDefaultRegion ? 'ru' : 'en';
};

export const L = (key, values) => {
  let trans = lang[UserPrefs.all.language];

  trans = trans ? trans[key] : null;
  // stub: we always use english package as a fallback
  if (!trans) {
    trans = lang['en'][key];
  }

  if (trans) {
    trans += '';
    for (let i in values) {
      let sub = '{' + i + '}';
      trans = trans.replace(sub, values[i]);
    }
    return trans;
  } else {
    return UserPrefs.all.language + '.' + key;
  }
};
