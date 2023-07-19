import { call, put, select, takeEvery } from 'redux-saga/effects';
import { APIService } from '../../../Api';

function* countersWorker() {
  try {
    const activeOid = yield select((state) => state.controlReducer.activeOid);
    const res = yield call(APIService.fetchCounters, activeOid);
    yield put({ type: 'FETCH_COUNTERS_SUCCEEDED', payload: { ...res.counters } });
  } catch (error) {
    console.log('FETCH_COUNTERS_FAILED', error);
    yield put({ type: 'FETCH_COUNTERS_FAILED' });
  }
}

export function* childAchievementsCounterWatcher() {
  yield takeEvery('FETCH_COUNTERS_REQUESTED', countersWorker);
}
