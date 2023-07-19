export namespace AchievementsTypes {
  export interface TaskType {
    reward: number;
    origin: string;
    name: string;
    limit: number;
    completions: any[];
    id: number;
    category: string;
    launchTs: any;
    playerId: number;
  }
}
// "reward": 666,
//       "origin": "PARENT",
//       "name": "test",
//       "limit": 1,
//       "completions": [],
//       "id": 14,
//       "category": "HOUSEHOLD_CHORES",
//       "launchTs": 1585205134000,
//       "playerId": 5

export namespace ChildDataTypes {
  export interface AllowedActions {
    HUB_SHARE_OBJECTS: number;
    OBJECT_CARD_EDIT: number;
    OBJECT_CLEAR_ALARM: number;
    OBJECT_GET_ALARMS: number;
    OBJECT_GET_EVENTS: number;
    OBJECT_GET_PARAMS: number;
    OBJECT_GET_TRACK: number;
    OBJECT_PHOTOS: number;
    OBJECT_REMOTE_CONTROL: number;
    OBJECT_TAKE_PHOTO: number;
    PUSH: number;
  }

  export interface Areas {}

  export interface Outs {}

  export interface Owner {
    id: number;
  }

  export interface Props {
    buzzerEnabled: string;
    checkinPeriod: string;
    enableEcoMode: string;
    enableGeozoneEnterAlert: string;
    enableGeozoneLeaveAlert: string;
    enableLowBatteryAlert: string;
    enableRemovalSensor: string;
    enableSmsAlert: string;
    enableStepCounter: string;
    imei: string;
    language: string;
    photo: string;
    timezone: string;
  }

  export interface States {
    adminDisabledAlert: string;
    backgroundModeAlert: string;
    buzzerRcvdTs: string;
    coordTs: number;
    dndEnabled: string;
    firmware: string;
    gpsEnabled: string;
    gpsPermissionAlert: string;
    micPermissionAlert: string;
    mobileDataAlert: string;
    offlineAlert: string;
    powersavingAlert: string;
    removedAlarm: string;
  }

  export interface ChildData {
    accuracy: number;
    allowedActions: AllowedActions;
    alt: number;
    areas: Areas;
    batteryLevel: number;
    customCode: number;
    deviceSubtype: number;
    deviceType: number;
    deviceTypeId: number;
    ignitionOn: boolean;
    lat: number;
    lon: number;
    myOwn: boolean;
    name: string;
    oid: number;
    online: boolean;
    outs: Outs;
    owners: Owner[];
    photoUrl: string;
    props: Props;
    reservePowerOn: boolean;
    speed: number;
    states: States;
    trail: any[];
    ts: number;
    voltage: number;
    voltageLevel: number;
  }
}
