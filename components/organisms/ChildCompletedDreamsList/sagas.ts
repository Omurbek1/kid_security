import { APIService } from '../../../Api';
import { call, select, takeEvery, put } from 'redux-saga/effects';

function* declineChildDreamWorker(action) {
  try {
    yield call(APIService.declineChildDream, action.payload.id);
    yield put({ type: 'CHILD_DREAMS_LIST_REQUESTED' });
    yield put({ type: 'FETCH_COUNTERS_REQUESTED' });
  } catch (error) { }
}

function* confirmChildDreamWorker(action) {
  try {
    yield call(APIService.confirmChildDream, action.payload.id, action.payload.price);
    yield put({ type: 'CHILD_DREAMS_LIST_REQUESTED' });
    yield put({ type: 'FETCH_COUNTERS_REQUESTED' });
  } catch (error) { }
}

function* fetchChildDreamsWorker() {
  try {

    const activeOid = yield select((state) => state.controlReducer.activeOid);
    const res = yield call(APIService.fetchChildDreams, activeOid);
    yield put({
      type: 'FETCH_NEW_DREAMS_LIST_SUCCEDED',
      payload: {
        daydreamList: res.daydreamList,
        wallet: res.wallet,
      },
    });
  } catch (error) {

    yield put({
      type: 'CHILD_DREAMS_LIST_FAILED',
    });
  }
}

function* fullfillChildDreamWorker(action) {
  try {
    yield call(APIService.fulfillChildDream, action.payload.id);
    yield put({ type: 'CHILD_DREAMS_LIST_REQUESTED' });
    yield put({ type: 'FETCH_COUNTERS_REQUESTED' });
  } catch (error) { }
}

export function* fetchChildDreamsWatcher() {
  yield takeEvery('CHILD_DREAMS_LIST_REQUESTED', fetchChildDreamsWorker);
}
export function* confirmChildDreamWatcher() {
  yield takeEvery('CONFIRM_CHILD_DREAM_REQUESTED', confirmChildDreamWorker);
}
export function* declineChildDreamWatcher() {
  yield takeEvery('DECLINE_CHILD_DREAM_REQUESTED', declineChildDreamWorker);
}
export function* fullfillChildDreamWatcher() {
  yield takeEvery('FULFILL_CHILD_DREAM_REQUESTED', fullfillChildDreamWorker);
}
