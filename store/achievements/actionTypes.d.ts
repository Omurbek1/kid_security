import { Counters, ParentTask, ConfirmedTask, UnconfirmedTask, ChildDream, ChildWallet } from './types';

export const FETCH_COUNTERS_SUCCEDED = 'FETCH_COUNTERS_SUCCEEDED';
export const FETCH_COUNTERS_FAILED = 'FETCH_COUNTERS_FAILED';
export const FETCH_UNCONFIRMED_PARENT_TASKS_SUCCEEDED = 'FETCH_UNCONFIRMED_PARENT_TASKS_SUCCEEDED';
export const FETCH_UNCONFIRMED_PARENT_TASKS_FAILED = 'FETCH_UNCONFIRMED_PARENT_TASKS_FAILED';
export const REMOVE_UNCONFIRMED_PARENT_TASK = 'REMOVE_UNCONFIRMED_PARENT_TASK';
export const ADD_UNCONFIRMED_PARENT_TASK = 'ADD_UNCONFIRMED_PARENT_TASK';
export const FETCH_CONFIRMED_TASKS_LIST_SUCCEEDED = 'FETCH_CONFIRMED_TASKS_LIST_SUCCEEDED';
export const FETCH_UNCONFIRMED_TASKS_SUCCEEDED = 'FETCH_UNCONFIRMED_TASKS_SUCCEEDED';
export const CHILD_DREAMS_LIST_REQUESTED = 'CHILD_DREAMS_LIST_REQUESTED';
export const FETCH_NEW_DREAMS_LIST_SUCCEDED = 'FETCH_NEW_DREAMS_LIST_SUCCEDED';
export const ADD_UNCONFIRMED_PARENT_TASK_REQUESTED = 'ADD_UNCONFIRMED_PARENT_TASK_REQUESTED';
export const DECLINE_CHILD_TASK_REQUESTED = 'DECLINE_CHILD_TASK_REQUESTED';
export const CONFIRM_CHILD_TASK_REQUESTED = 'CONFIRM_CHILD_TASK_REQUESTED';
export const FETCH_UCONFIRMED_TASKS_LIST_REQUESTED = 'FETCH_UCONFIRMED_TASKS_LIST_REQUESTED';
export const FETCH_UNCONFIRMED_PARENT_TASKS_REQUESTED = 'FETCH_UNCONFIRMED_PARENT_TASKS_REQUESTED';
export const CANCEL_UNCONFIRMED_PARENT_TASKS_REQUESTED = 'CANCEL_UNCONFIRMED_PARENT_TASKS_REQUESTED';
export const ADD_UNCONFIRMED_PARENT_TASKS_REQUESTED = 'ADD_UNCONFIRMED_PARENT_TASKS_REQUESTED';
export const CANCEL_UNCONFIRMED_PARENT_TASKS_SUCCEDED = 'CANCEL_UNCONFIRMED_PARENT_TASKS_SUCCEDED';
export const FULFILL_CHILD_DREAM_REQUESTED = 'FULFILL_CHILD_DREAM_REQUESTED';
export const DECLINE_CHILD_DREAM_REQUESTED = 'DECLINE_CHILD_DREAM_REQUESTED';
export const CONFIRM_CHILD_DREAM_REQUESTED = 'CONFIRM_CHILD_DREAM_REQUESTED';

export interface FetchCountersAction {
  type: typeof FETCH_COUNTERS_SUCCEDED;
  payload: Counters;
}

export interface FetchUnconfirmedParentTask {
  type: typeof FETCH_UNCONFIRMED_PARENT_TASKS_SUCCEEDED;
  payload: ParentTask[];
}

export interface RemoveUnconfirmedParentTask {
  type: typeof REMOVE_UNCONFIRMED_PARENT_TASK;
  payload: {
    taskId: number;
  };
}

export interface AddUnconfirmedParentTask {
  type: typeof ADD_UNCONFIRMED_PARENT_TASK;
}

export interface FetchConfirmedTask {
  type: typeof FETCH_CONFIRMED_TASKS_LIST_SUCCEEDED;
  payload: {
    confirmedTasksList: ConfirmedTask[];
  };
}

export interface FetchUnconfirmedTask {
  type: typeof FETCH_UNCONFIRMED_TASKS_SUCCEEDED;
  payload: UnconfirmedTask[];
}

export interface ChildDreamListRequested {
  type: typeof CHILD_DREAMS_LIST_REQUESTED;
}

export interface FetchNewDreamLsit {
  type: typeof FETCH_NEW_DREAMS_LIST_SUCCEDED;
  payload: {
    daydreamList: ChildDream[];
    wallet: ChildWallet;
  };
}

export interface AddUnconfirmedTaskRequested {
  type: typeof ADD_UNCONFIRMED_PARENT_TASK_REQUESTED;
}

export interface DeclineChildTaskRequested {
  type: typeof DECLINE_CHILD_TASK_REQUESTED;
  payload: {
    finishedTaskId: number;
  };
}

export interface ConfirmChildTaskRequested {
  type: typeof CONFIRM_CHILD_TASK_REQUESTED;
  payload: {
    finishedTaskId: number;
    praiseComment: string;
    reward: number;
  };
}

export interface FetchUnconfirmedTasksRequested {
  type: typeof FETCH_UCONFIRMED_TASKS_LIST_REQUESTED;
}

export interface FetchUnconfirmedParentTasksRequested {
  type: typeof FETCH_UNCONFIRMED_PARENT_TASKS_REQUESTED;
}

export interface CancelUnconfirmedParentTasksRequested {
  type: typeof CANCEL_UNCONFIRMED_PARENT_TASKS_REQUESTED;
  payload: {
    taskId: number;
  };
}

export interface AddUnconfirmedParentTasksRequested {
  type: typeof ADD_UNCONFIRMED_PARENT_TASKS_REQUESTED;
}

export interface FulfillChildDreamRequested {
  type: typeof FULFILL_CHILD_DREAM_REQUESTED;
  payload: {
    id: number;
  };
}

export interface ConfirmChildDreamRequested {
  type: typeof CONFIRM_CHILD_DREAM_REQUESTED;
  payload: {
    id: number;
    price: number;
  };
}

export interface DeclineChildDreamRequested {
  type: typeof DECLINE_CHILD_DREAM_REQUESTED;
  payload: {
    id: number;
  };
}

export type AchievementActionsTypes =
  | FetchCountersAction
  | FetchUnconfirmedParentTask
  | RemoveUnconfirmedParentTask
  | AddUnconfirmedParentTask
  | FetchConfirmedTask
  | FetchUnconfirmedTask
  | ChildDreamListRequested
  | FetchNewDreamLsit
  | AddUnconfirmedTaskRequested
  | DeclineChildTaskRequested
  | ConfirmChildTaskRequested
  | FetchUnconfirmedTasksRequested
  | FetchUnconfirmedParentTasksRequested
  | CancelUnconfirmedParentTasksRequested
  | AddUnconfirmedParentTasksRequested
  | FulfillChildDreamRequested
  | ConfirmChildDreamRequested
  | DeclineChildDreamRequested;
