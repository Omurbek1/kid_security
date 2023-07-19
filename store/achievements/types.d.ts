import { AchievementActionsTypes } from './actionTypes';
export interface Counters {
  unprocessedDaydreamCount: number;
  unconfirmedParentTaskCount: number;
  unconfirmedAllTaskCount: number;
}

export interface Error {
  code: number;
  message: string;
}

export interface LoadingObject {
  action: AchievementActionsTypes | null;
  isLoading: boolean;
}

export interface Completion {
  finishedTaskId: number;
  finishTs: number;
  confirmed: boolean;
}
export type TaskOrigin = 'DEVELOPER' | 'PARENT' | 'CHILD';

export interface ParentTask {
  id: number;
  name: string;
  reward: number;
  origin: TaskOrigin;
  category: string;
  limit: number;
  completions: Completion[];
}

export interface UnconfirmedTask {
  reward: number;
  origin: TaskOrigin;
  name: string;
  limit: number;
  finishTs: number;
  id: number;
  category: string;
  confirmed: boolean;
  taskId: number;
}

export interface ConfirmedTask {
  reward: number;
  origin: TaskOrigin;
  name: string;
  limit: number;
  finishTs: number;
  id: number;
  category: string;
  confirmed: boolean;
  confirmTs: number;
  taskId: number;
}

export interface ChildWallet {
  parentScore: number;
  dailyScore: number;
}

export type DreamState = 'CONFIRMED' | 'REDEEMED' | 'FULFILLED' | 'DECLINED' | 'WAIT';

export interface ChildDream {
  declined: boolean;
  redeemed: boolean;
  price: number;
  name: string;
  fulfilled: boolean;
  id: number;
  state: DreamState;
  confirmed: boolean;
  confirmTs: number;
  playerId: number;
}

export interface AchievementState {
  counters: Counters;
  error: Error;
  unconfirmedParentTasksList: ParentTask[];
  unconfirmedTasksList: UnconfirmedTask[];
  confirmedTasksList: ConfirmedTask[];
  loading: LoadingObject;
  confirmedDreamsList: ChildDream[];
  canceledDreamsList: ChildDream[];
  dreamsList: ChildDream[];
  newDreamsList: ChildDream[];
  redemeedDreamList: ChildDream[];
  fulfilledDreamsList: ChildDream[];
  childWallet: ChildWallet;
}
