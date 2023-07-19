import { APIService } from '../../../Api';
import { select, put, call, takeEvery } from 'redux-saga/effects';

function* unconfirmedChildTasksWorker() {
  try {
    const activeOid = yield select((state) => state.controlReducer.activeOid);
    const res = yield call(APIService.fetchUnconfirmedTasks, activeOid);
    yield put({
      type: 'FETCH_UNCONFIRMED_TASKS_SUCCEEDED',
      payload: res.unconfirmedList,
    });
  } catch (error) {
    console.log('FETCH_UNCONFIRMED_TASKS_FAILED', error)
    yield put({
      type: 'FETCH_UNCONFIRMED_TASKS_FAILED',
    });
  }
}

function* confirmChildTaskWorker(action) {
  try {
    yield console.log('finished task id saga:', action.payload.finishedTaskId);
    yield call(
      APIService.confirmChildTask,
      action.payload.finishedTaskId,
      action.payload.praiseComment,
      action.payload.reward
    );
    yield put({
      type: 'CONFIRM_CHILD_TASK_SUCCEEDED',
    });
    yield put({ type: 'FETCH_UNCONFIRMED_PARENT_TASKS_REQUESTED' });
    yield put({ type: 'FETCH_UCONFIRMED_TASKS_LIST_REQUESTED' });
    yield put({ type: 'FETCH_COUNTERS_REQUESTED' });
  } catch (error) {
    console.log(error);
  }
}

function* declineChildTaskWoker(action) {
  try {
    yield call(APIService.declineChildTask, action.payload.finishedTaskId);
    yield put({ type: 'DECLINE_CHILD_TASK_SUCCEEDED' });
    yield put({ type: 'FETCH_UNCONFIRMED_PARENT_TASKS_REQUESTED' });
    yield put({ type: 'FETCH_UCONFIRMED_TASKS_LIST_REQUESTED' });

    yield put({ type: 'FETCH_COUNTERS_REQUESTED' });
  } catch (error) { }
}

export function* unconfirmedChildTasksWatcher() {
  yield takeEvery('FETCH_UCONFIRMED_TASKS_LIST_REQUESTED', unconfirmedChildTasksWorker);
}

export function* declineChildTaskWatcher() {
  yield takeEvery('DECLINE_CHILD_TASK_REQUESTED', declineChildTaskWoker);
}

export function* confirmChildTaskWatcher() {
  yield takeEvery('CONFIRM_CHILD_TASK_REQUESTED', confirmChildTaskWorker);
}
