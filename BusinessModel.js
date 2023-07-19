const ALLOWED_EVENTS = {
    '120.1': {
      text: 'event_sos',
      backgroundColor: '#ff7b7b',
      img: require('./img/ic_bell_w.png'),
    },
    '302.1': {
      text: 'event_battery',
      backgroundColor: '#ffb95f',
      img: require('./img/ic_battery_alert_w.png'),
    },
    '1601.1': {
      text: 'event_removal',
      backgroundColor: '#a76ee6',
      img: require('./img/ic_watch_w.png'),
    },
    '1701.1': {
      text: 'event_enter_geozone',
      backgroundColor: '#4fc4ca',
      img: require('./img/ic_geozone_visit_w.png'),
    },
    '1701.3': {
      text: 'event_leave_geozone',
      backgroundColor: '#d859c3',
      img: require('./img/ic_geozone_leave_w.png'),
    },
    '1901.1': {
      text: 'event_service_message',
      backgroundColor: '#3cce41',
      img: require('./img/ic_message_alert_w.png'),
    }
  };

export default BusinessModel = {
    getAllowedEvent: (ev) => {
        return ALLOWED_EVENTS[ev.code + '.' + ev.q];
    },

};