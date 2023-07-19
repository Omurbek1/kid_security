import Toast from './Toast';
import { connect } from 'react-redux';

export default class PushNotificationsService {
  static showNotification(title, body, onTap) {
    Toast.getRef().alertWithType('custom', title, body, { onTap });
  }
}
