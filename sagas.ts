import { all } from 'redux-saga/effects';
import { childAchievementsCounterWatcher } from './components/organisms/AchievementMenuList/sagas';
import { fetchConfirmedListWatcher } from './components/organisms/ChildTasksHistory/sagas';
import {
  declineChildDreamWatcher,
  fullfillChildDreamWatcher,
} from './components/organisms/ChildCompletedDreamsList/sagas';
import {
  fetchChildDreamsWatcher,
  confirmChildDreamWatcher,
} from './components/organisms/ChildCompletedDreamsList/sagas';
import {
  confirmChildTaskWatcher,
  unconfirmedChildTasksWatcher,
  declineChildTaskWatcher,
} from './components/organisms/ChildTaskList/sagas';
import {
  childUnconfirmedParentTasksWatcher,
  addChildUnconfirmedTasksWatcher,
  cancelChildUnconfirmedTaskWatcher,
} from './components/organisms/ChildUnconfirmedTaskList/sagas';

export default function* rootSaga() {
  yield all([
    childAchievementsCounterWatcher(),
    childUnconfirmedParentTasksWatcher(),
    addChildUnconfirmedTasksWatcher(),
    cancelChildUnconfirmedTaskWatcher(),
    fetchConfirmedListWatcher(),
    confirmChildTaskWatcher(),
    unconfirmedChildTasksWatcher(),
    declineChildTaskWatcher(),
    fetchChildDreamsWatcher(),
    confirmChildDreamWatcher(),
    declineChildDreamWatcher(),
    fullfillChildDreamWatcher(),
  ]);
}
