import { store } from './Store';
import NavigationService from './navigation/NavigationService';

export const NotificationKinds = {
  GAME_NEW_DREAM: 'GAME_NEW_DAYDREAM',
  GAME_TASK_FINISHED: 'GAME_TASK_FINISHED',
  GAME_DAYDREAM_REDEEMED: 'GAME_DAYDREAM_REDEEMED',
};

export const getOnTapActionByNotificationKind = (notification) => {
  switch (notification.kind) {
    case NotificationKinds.GAME_NEW_DREAM:
      return () => {
        NavigationService.navigate('ChildDreams');
      };
    case NotificationKinds.GAME_DAYDREAM_REDEEMED:
      return () => {
        NavigationService.navigate('ChildDreams');
      };
    case NotificationKinds.GAME_TASK_FINISHED:
      const { origin } = notification.finishedTask;
      if (origin === 'DEVELOPER' || origin === 'CHILD') {
        return () => {
          NavigationService.navigate('ChildAchievements');
        };
      }
      if (origin === 'PARENT') {
        return () => {
          NavigationService.navigate('ChildParentTasks');
        };
      }
      return console.log('error:', notification);
    default:
      return console.log('ahtung!!:', notification);
  }
};

export const getOnNotificationAction = (notification) => {
  switch (notification.kind) {
    case NotificationKinds.GAME_NEW_DREAM:
      return () => {
        store.dispatch({ type: 'FETCH_COUNTERS_REQUESTED' });

        store.dispatch({ type: 'CHILD_DREAMS_LIST_REQUESTED' });
      };
    case NotificationKinds.GAME_DAYDREAM_REDEEMED:
      return () => {
        store.dispatch({ type: 'FETCH_COUNTERS_REQUESTED' });

        store.dispatch({ type: 'CHILD_DREAMS_LIST_REQUESTED' });
      };
    case NotificationKinds.GAME_TASK_FINISHED:
      const { origin } = notification.finishedTask;
      if (origin === 'DEVELOPER' || origin === 'CHILD') {
        return () => {
          store.dispatch({ type: 'FETCH_COUNTERS_REQUESTED' });

          store.dispatch({ type: 'FETCH_UCONFIRMED_TASKS_LIST_REQUESTED' });
        };
      }
      if (origin === 'PARENT') {
        return () => {
          store.dispatch({ type: 'FETCH_COUNTERS_REQUESTED' });

          store.dispatch({ type: 'FETCH_UNCONFIRMED_PARENT_TASKS_REQUESTED' });
        };
      }
      return console.log('error:', notification);
    default:
      return console.log('ahtung!!:', notification);
  }
};
