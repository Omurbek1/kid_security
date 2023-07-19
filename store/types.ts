import { AchievementState } from './achievements/types';
export interface KidSecurityState {
  achievementReducer: AchievementState;
  authReducer: any;
  controlReducer: any;
  mapReducer: any;
}
