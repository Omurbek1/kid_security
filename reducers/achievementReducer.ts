import { AchievementState } from '../store/achievements/types';
import { AchievementActionsTypes } from '../store/achievements/actionTypes';

const initialState: AchievementState = {
  counters: {
    unprocessedDaydreamCount: 0,
    unconfirmedParentTaskCount: 0,
    unconfirmedAllTaskCount: 0,
  },
  error: {
    code: null,
    message: '',
  },
  unconfirmedParentTasksList: [],
  unconfirmedTasksList: [],
  confirmedTasksList: [],
  loading: {
    action: null,
    isLoading: false,
  },
  confirmedDreamsList: [],
  canceledDreamsList: [],
  dreamsList: [],
  newDreamsList: [],
  redemeedDreamList: [],
  fulfilledDreamsList: [],
  childWallet: null,
};

const achievementReducer = (state = initialState, action: AchievementActionsTypes): AchievementState => {
  switch (action.type) {

    case 'FETCH_COUNTERS_REQUESTED':
      return {
        ...state,
        loading: {
          action: action,
          isLoading: true,
        },
      };
    case 'FETCH_COUNTERS_SUCCEEDED':
      return {
        ...state,
        counters: {
          unprocessedDaydreamCount: action.payload.unprocessedDaydreamCount,
          unconfirmedParentTaskCount: action.payload.unconfirmedParentTaskCount,
          unconfirmedAllTaskCount: action.payload.unconfirmedAllTaskCount,
        },
        loading: {
          action: null,
          isLoading: false,
        },
      };
    case 'FETCH_COUNTERS_FAILED':
      return {
        ...state,
        counters: {
          unprocessedDaydreamCount: 0,
          unconfirmedParentTaskCount: 0,
          unconfirmedAllTaskCount: 0,
        },
        loading: {
          action: null,
          isLoading: false,
        },
      };


    case 'FETCH_UNCONFIRMED_PARENT_TASKS_REQUESTED':
      return {
        ...state,
        loading: {
          action: action,
          isLoading: true,
        },
      };
    case 'FETCH_UNCONFIRMED_PARENT_TASKS_SUCCEEDED':
      return {
        ...state,
        unconfirmedParentTasksList: action.payload,
        loading: {
          action: null,
          isLoading: false,
        },
      };
    case 'FETCH_UNCONFIRMED_PARENT_TASKS_FAILED':
      return {
        ...state,
        loading: {
          action: action,
          isLoading: false,
        },
      };


    case 'FETCH_UNCONFIRMED_TASKS_SUCCEEDED':
      return {
        ...state,
        unconfirmedTasksList: action.payload,
      };
    case 'FETCH_UNCONFIRMED_TASKS_FAILED':
      return {
        ...state,
        unconfirmedTasksList: [],
        loading: {
          action: null,
          isLoading: false,
        },
      };


    case 'REMOVE_UNCONFIRMED_PARENT_TASK':
      const removedItemArray = state.unconfirmedParentTasksList.filter((item) => {
        return item.id !== action.payload.taskId;
      });
      return {
        ...state,
        loading: {
          action: null,
          isLoading: false,
        },
        unconfirmedParentTasksList: removedItemArray,
      };

    case 'ADD_UNCONFIRMED_PARENT_TASK_REQUESTED':
      return {
        ...state,
        loading: {
          action: action,
          isLoading: true,
        },
      };
    case 'CONFIRM_CHILD_TASK_SUCCEEDED':
      return {
        ...state,
        loading: {
          action: null,
          isLoading: false,
        },
      };
    case 'CONFIRM_CHILD_DREAM_REQUESTED':
      return {
        ...state,
        loading: {
          action: action,
          isLoading: true,
        },
      };
    case 'DECLINE_CHILD_DREAM_REQUESTED':
      return {
        ...state,
        loading: {
          action: action,
          isLoading: true,
        },
      };
    case 'FULFILL_CHILD_DREAM_REQUESTED':
      return {
        ...state,
        loading: {
          action: action,
          isLoading: true,
        },
      };
    case 'DECLINE_CHILD_TASK_REQUESTED':
      return {
        ...state,
        loading: {
          action: action,
          isLoading: true,
        },
      };
    case 'DECLINE_CHILD_TASK_SUCCEEDED':
      return {
        ...state,
        loading: {
          action: null,
          isLoading: false,
        },
      };
    case 'CANCEL_UNCONFIRMED_PARENT_TASKS_REQUESTED':
      return {
        ...state,
        loading: {
          action: action,
          isLoading: true,
        },
      };
    case 'ADD_UNCONFIRMED_PARENT_TASKS_REQUESTED':
      return {
        ...state,
        loading: {
          action: action,
          isLoading: true,
        },
      };
    case 'ADD_UNCONFIRMED_PARENT_TASK':
      return {
        ...state,
        loading: {
          action: action,
          isLoading: false,
        },
      };

    case 'CONFIRM_CHILD_TASK_REQUESTED':
      return {
        ...state,
        loading: {
          action: action,
          isLoading: true,
        },
      };

    case 'FETCH_UCONFIRMED_TASKS_LIST_REQUESTED':
      return {
        ...state,
        loading: {
          action: action,
          isLoading: true,
        },
      };


    case 'FETCH_CONFIRMED_TASK_LIST_REQUESTED':
      return {
        ...state,
        loading: {
          action: action,
          isLoading: true,
        },
      };
    case 'FETCH_CONFIRMED_TASKS_LIST_SUCCEEDED':
      return {
        ...state,
        confirmedTasksList: action.payload.confirmedTasksList,
        loading: {
          action: null,
          isLoading: false,
        },
      };
    case 'FETCH_CONFIRMED_TASK_LIST_FAILED':
      return {
        ...state,
        loading: {
          action: action,
          isLoading: false,
        },
      };


    case 'CHILD_DREAMS_LIST_REQUESTED':
      return {
        ...state,
        loading: {
          action: action,
          isLoading: true,
        },
      };
    case 'CHILD_DREAMS_LIST_FAILED':
      return {
        ...state,
        loading: {
          action: action,
          isLoading: false,
        },
      };
    case 'FETCH_NEW_DREAMS_LIST_SUCCEDED':
      const dreamsList = action.payload.daydreamList;
      const wallet = action.payload.wallet;
      const redemeedDream = dreamsList.filter((item) => item.confirmed && item.state === 'REDEEMED');
      const pendingDreams = dreamsList.filter((item) => item.state === 'WAIT');
      const canceledDreams = dreamsList.filter((item) => item.state === 'DECLINED');
      const confirmedDreams = dreamsList.filter((item) => item.state === 'CONFIRMED');
      const fulfilledDreams = dreamsList.filter((item) => item.state === 'FULFILLED');
      return {
        ...state,
        dreamsList: [...dreamsList],
        newDreamsList: [...pendingDreams],
        redemeedDreamList: [...redemeedDream],
        canceledDreamsList: [...canceledDreams],
        confirmedDreamsList: [...confirmedDreams],
        fulfilledDreamsList: [...fulfilledDreams],
        loading: {
          action: null,
          isLoading: false,
        },

        childWallet: { ...wallet },
      };
    default:
      break;
  }
  return state;
};

export default achievementReducer;
