import Const from './Const';
import * as Utils from './Utils';
import UserPrefs from './UserPrefs';

function Rest() {
  var userSession;
  var expiresAt = new Date(0);
  var self = this;
  var email;
  var password;
  var userId = 0;

  var execUnauth = function (command, data, done, fail, always, tries) {
    var headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    };
    var connectTries = tries || 1;

    let status;
    fetch(Utils.getApiUrl() + command, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (always) {
          always();
        }
        status = response.status;
        return response.json();
      })
      .then((responseJson) => {
        if (200 !== status) {
          if (fail) {
            fail(responseJson);
          }
          return;
        }
        if (done) {
          done(responseJson);
        }
      })
      .catch((d) => {
        if (401 == d.status && command !== 'auth/') {
          userSession = null;
        }

        if ((d + '').indexOf('Unexpected EOF') > -1) {
          if (fail) {
            fail(d);
          }
          return;
        }

        connectTries--;
        if (connectTries > 0) {
          let usingAltBackend = UserPrefs.switchUsingAltBackend();
          console.log(
            ' ===== PROXY-REST: switching to ' +
              (usingAltBackend ? 'ALT backend' : 'DEFAULT backend') +
              ', tries: ' +
              connectTries
          );
          setTimeout(() => {
            execUnauth(command, data, done, fail, always, connectTries);
          }, 100);
        } else {
          if (fail) {
            fail(d);
          }
        }
      });
  };

  var execInternal = function (command, data, done, fail, always, tries) {
    var headers = {};
    headers['Authorization'] = 'Bearer ' + userSession;
    var connectTries = tries || 1;

    $.ajax({
      type: 'POST',
      crossDomain: true,
      url: Utils.getApiUrl() + command,
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: headers,
    })
      .done(done)
      .fail(function (d) {
        if (401 == d.status && command !== 'auth/') {
          userSession = null;
        }
        connectTries--;
        if (connectTries > 0) {
          let usingAltBackend = UserPrefs.switchUsingAltBackend();
          console.log(
            ' ===== PROXY-REST: switching to ' +
              (usingAltBackend ? 'ALT backend' : 'DEFAULT backend') +
              ', tries: ' +
              connectTries
          );
          setTimeout(() => {
            execUnauth(command, data, done, fail, always, connectTries);
          }, 100);
        } else {
          if (fail) {
            fail(d);
          }
        }
      })
      .always(always);
  };

  var exec = function (command, data, done, fail, always) {
    if (userSession) {
      execInternal(command, data, done, fail, always);
    } else {
      self.login(
        {
          email: email,
          password: password,
        },
        function (dt) {
          expiresAt = new Date(dt.expiresAt);
          userSession = dt.basic;
          execInternal(command, data, done, fail, always);
        },
        fail,
        always
      );
    }
  };

  this.init = function (_email, _password, _userId) {
    email = _email;
    password = _password;
    userId = _userId;
  };

  this.registerNewUser = function (userPhone, lang, done, fail, always) {
    var data = {
      userPhone: userPhone,
      language: lang,
    };
    execUnauth('registration/new/', data, done, fail, always);
  };

  this.recoverUserPassword = function (userPhone, lang, done, fail, always) {
    var data = {
      userPhone: userPhone,
      language: lang,
    };
    execUnauth('registration/recover/', data, done, fail, always);
  };

  this.login = function (data, done, fail, always) {
    execUnauth('auth/', data, done, fail, always);
  };

  this.logout = function (done, fail, always) {
    document.cookie = 'user_session=; path=/; expires=-1';
    execInternal('auth/logout/', null, done, fail, always);
  };

  this.addObject = function (data, done, fail, always) {
    exec('objects/create/', data, done, fail, always);
  };

  this.deleteObject = function (data, done, fail, always) {
    exec('objects/delete/', data, done, fail, always);
  };

  var debugQueue = [];
  var debugLaunched = false;

  var executeDebug = () => {
    if (0 === debugQueue.length) {
      debugLaunched = false;
      return;
    }
    const data = debugQueue.shift();
    execUnauth('debugdata/' + userId, data, null, null, executeDebug);
  };

  this.debug = function (data) {
    if (0 === userId) {
      return false;
    }

    debugQueue.push(data);
    if (!debugLaunched) {
      debugLaunched = true;
      executeDebug();
    }
    return true;
  };
}

Rest.get = function () {
  if (!Rest.instance) Rest.instance = new Rest();
  return Rest.instance;
};

export default Rest;
