import { APIService } from '../../../Api';
import { select, put, call, takeEvery } from 'redux-saga/effects';

function* fetchConfirmedListWorker() {
  try {
    const activeOid = yield select((state) => state.controlReducer.activeOid);
    const res = yield call(APIService.fetchConfirmedTasks, activeOid);
    yield put({
      type: 'FETCH_CONFIRMED_TASKS_LIST_SUCCEEDED',
      payload: { confirmedTasksList: res.confirmedList },
    });
  } catch (error) {
    console.log('FETCH_CONFIRMED_TASK_LIST_REQUESTED', error);
    yield put({
      type: 'FETCH_CONFIRMED_TASK_LIST_FAILED',
    });
  }
}

export function* fetchConfirmedListWatcher() {
  yield takeEvery('FETCH_CONFIRMED_TASK_LIST_REQUESTED', fetchConfirmedListWorker);
}
