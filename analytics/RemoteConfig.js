import remoteConfig from '@react-native-firebase/remote-config';
import UserPrefs from '../UserPrefs';
import * as Metrica from './Analytics';
import Rest from '../Rest';
import { firebaseAnalitycsLogEvent } from './firebase/firebase';
import { firebase } from '@react-native-firebase/analytics';

let initialized = false;

const newUserLogic = async () => {
  let username = await UserPrefs.getUsername();
  let isNotSendedAnaitycsForFirstOpen = await UserPrefs.getIsNotSendedAnaitycsForFirstOpen();
  console.log('newUser', username, isNotSendedAnaitycsForFirstOpen);
  if (username === null) {
    if (isNotSendedAnaitycsForFirstOpen) {
      firebaseAnalitycsLogEvent('first_open', { reinstall: false }, true);
      await UserPrefs.setIsNotSendedAnaitycsForFirstOpen();
    }
    await firebase.analytics().setUserProperties({ first_open_app: 'true' });
  } else {
    if (isNotSendedAnaitycsForFirstOpen) {
      firebaseAnalitycsLogEvent('first_open', { reinstall: true }, true);
      await UserPrefs.setIsNotSendedAnaitycsForFirstOpen();
    }
    await firebase.analytics().setUserProperties({ first_open_app: 'false' });
  }
  isNotSendedAnaitycsForFirstOpen = await UserPrefs.getIsNotSendedAnaitycsForFirstOpen();
  console.log('newUser2', username, isNotSendedAnaitycsForFirstOpen);
};

export const init = async () => {
  if (initialized) {
    return;
  }
  initialized = true;
  await newUserLogic();
  return remoteConfig()
    .setDefaults({
      onCodeTapAction: '',
    })
    .then(() => {
      remoteConfig().setConfigSettings({
        minimumFetchIntervalMillis: 0,
      });
    })
    .then(() => remoteConfig().fetchAndActivate())
    .then((fetchedRemotely) => {
      if (fetchedRemotely) {
        console.log(' == REMOTE_CONFIG: fetched from cloud');
        const parameters = remoteConfig().getAll();
        const data = {};
        Object.entries(parameters).forEach(($) => {
          const [key, entry] = $;
          data[key] = {
            value: entry.asString(),
            src: entry.getSource(),
          };
        });
        Rest.get().debug({ REMOTE_CONFIG: 'fetched from cloud', data: parameters });
        console.log('remote_result:', parameters);
        /*Object.entries(parameters).forEach($ => {
                    const [key, entry] = $
                    console.log('Key: ' + key + ' = ' + entry.asString() + ' [' + entry.getSource() + ']')
                })*/
      } else {
        console.log(' == REMOTE_CONFIG: No configs were fetched!');
        Rest.get().debug({ REMOTE_CONFIG: 'No configs were fetched!' });
        /*const parameters = remoteConfig().getAll()

                Object.entries(parameters).forEach($ => {
                    const [key, entry] = $
                    console.log('Key: ' + key + ' = ' + entry.asString() + ' [' + entry.getSource() + ']')
                })*/
      }
    });
};

export const stringValue = (key) => {
  return remoteConfig().getString(key);
};

// returns experiment variant if applicable
export const logExperimentStarted = async (experiment_id, variantVariableName) => {
  const variantVal = remoteConfig().getValue(variantVariableName);
  if ('remote' !== variantVal.getSource()) {
    console.log(
      ' === EXP: ' +
        experiment_id +
        ' disabled or user is outside [' +
        variantVariableName +
        ', src: ' +
        variantVal.getSource() +
        ']'
    );
    Rest.get().debug({
      EXP: experiment_id,
      variantVariableName,
      src: variantVal.getSource(),
      msg: 'outside of experiment',
    });
    return null;
  }

  const variant_id = variantVal.asString();

  const firstTimeStored = await UserPrefs.storeExperimentName(experiment_id);
  if (firstTimeStored) {
    Metrica.event('experiment_set', { experiment_id, variant_id });
    Rest.get().debug({ EXP: experiment_id, variant_id, src: variantVal.getSource(), firstSet: true });
  } else {
    Rest.get().debug({ EXP: experiment_id, alreadySet: true });
  }
  return variant_id;
};
