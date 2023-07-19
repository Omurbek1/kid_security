import { APIService } from '../../../Api';
import { select, put, call, takeEvery } from 'redux-saga/effects';

function* unconfirmedParentTasksWorker() {
  try {
    const activeOid = yield select((state) => state.controlReducer.activeOid);
    const res = yield call(APIService.fetchUnconfirmedParentTasks, activeOid);
    yield put({ type: 'FETCH_UNCONFIRMED_PARENT_TASKS_SUCCEEDED', payload: res.unconfirmedList });
  } catch (error) {
    console.log('FETCH_UNCONFIRMED_PARENT_TASKS_FAILED', error);
    yield put({ type: 'FETCH_UNCONFIRMED_PARENT_TASKS_FAILED', });
  }
}

function* cancelUnconfirmedParentTaskWorker(action) {
  try {
    const res = yield call(APIService.cancelUnconfirmedParentTask, action.payload.taskId);
    yield put({ type: 'REMOVE_UNCONFIRMED_PARENT_TASK', payload: { taskId: action.payload.taskId } });
  } catch (error) {
    console.log(error);
  }
}

function* addUnconfirmedParentTasksWorker(action) {
  try {
    const activeOid = yield select((state) => state.controlReducer.activeOid);
    const res = yield call(
      APIService.addNewUnconfirmedParentTask,
      activeOid,
      action.payload.title,
      action.payload.reward
    );
    yield put({ type: 'ADD_UNCONFIRMED_PARENT_TASK', payload: { item: res.task } });
    yield put({ type: 'FETCH_UNCONFIRMED_PARENT_TASKS_REQUESTED' });
  } catch (error) {
    console.log(error);
  }
}

export function* addChildUnconfirmedTasksWatcher() {
  yield takeEvery('ADD_UNCONFIRMED_PARENT_TASKS_REQUESTED', addUnconfirmedParentTasksWorker);
}

export function* childUnconfirmedParentTasksWatcher() {
  yield takeEvery('FETCH_UNCONFIRMED_PARENT_TASKS_REQUESTED', unconfirmedParentTasksWorker);
}

export function* cancelChildUnconfirmedTaskWatcher() {
  yield takeEvery('CANCEL_UNCONFIRMED_PARENT_TASKS_REQUESTED', cancelUnconfirmedParentTaskWorker);
}
