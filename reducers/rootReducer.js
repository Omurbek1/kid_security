import { authReducer } from './authRedux';
import { controlReducer } from './controlRedux';
import { mapReducer } from './mapRedux';
import { popupReducer } from './popupRedux';
import { introReducer } from './introReducer';
import achievementReducer from './achievementReducer';
import { firebaseReduser } from './firebaseRedux';

import { combineReducers } from 'redux';

export default makeRootReducer = () => {
  return combineReducers({
    achievementReducer,
    authReducer,
    controlReducer,
    mapReducer,
    popupReducer,
    introReducer,
    firebaseReduser,
  });
};
