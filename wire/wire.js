import WireError from './wire-errors'

function SafeJSON(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
    }
}

function Wire() {
    this.connected = false;
    this.connecting = false;
    this.linkup = false;
    this.skipOnDisconnect = false;
    this.pendingRequests = {};
    this.callbacks = {};
    this.uid = 0;
 
    var ws = null;
    var lastSendTs = new Date();

    this.supported = function () {
        try {
            var sup = ("WebSocket" in window);
            return sup;
        } catch (e) {
            return false;
        }
    };

    this.getUID = function () {
        this.uid++;
        return this.uid;
    };

    this.makePacket = function (command, data, uid) {
        return {
            'cmd': command,
            'uid': uid.toString(),
            'data': data
        };
    };

    this.makeAuthPacket = function (username, password, socialAuth) {
        var data = {
            'username': username,
            'password': password,
            'web': false
        };
        if (socialAuth) {
            data.appId = socialAuth.appId;
            data.socialDomain = socialAuth.domain;
            data.data = socialAuth.data;
        }
        return this.makePacket("auth", data, this.getUID());
    };

    // =============================================
    //  public
    // =============================================

    this.connect = function (url, username, password, onConnect, onFail, onDisconnect, socialAuth) {
        if (this.ws || this.connected || this.connecting) {
            if (this.ws) {
                this.ws.onmessage = null;
                this.ws.onclose = null;
                this.ws.onerror = null;
                this.disconnect();
                this.ws = null;
            }
        }

        this.connected = false;
        this.connecting = false;
        this.linkup = false;

        //var url = UserPrefs.isChinaMode() ? Setup.ws_url_china : Setup.ws_url;
        //var url = "ws://control.ionsat.ru";
        //url = "ws://192.168.13.37:8080/tracking-web/control";
        //var url = "ws://control.watchful.az";

        this.ws = new WebSocket(url);
        var ws = this.ws;

        this.connecting = true;
        this.pendingRequests = {};
        this.uid = 0;
        this.skipOnDisconnect = false;

        var self = this;
        this.authTimer = setTimeout(function () {
            // unable to connect or no answer from server during auth process
            clearTimeout(self.authTimer);
            self.authTimer = null;

            self.skipOnDisconnect = true;
            self.linkup = false;
            if (self.connected || self.connecting) {
                try {
                    self.ws.close();
                } catch (e) {
                }
            }
            self.connected = false;
            self.connecting = false;
            self.linkup = false;

            onFail(WireError.INTERNAL_SERVER_ERROR);
        }, 20000);

        ws.onopen = function () {
            self.lastSendTs = new Date();
            self.connected = true;
            self.connecting = true;
            self.linkup = true;

            self.sendPacket(self.makeAuthPacket(username, password, socialAuth),
                function (pr, packet) {
                    clearTimeout(self.authTimer);
                    self.authTimer = null;

                    if (packet.invalid) {
                        // it seems that something goes wrong during auth process
                        self.skipOnDisconnect = true;
                        onFail(WireError.INTERNAL_SERVER_ERROR);
                        return;
                    }
                    if (0 == packet.data.result) {
                        onConnect(pr, packet);
                    } else {
                        onFail(packet.data.error);
                    }
                });
        };
        ws.onclose = function (message) {
            if (self.authTimer) {
                clearTimeout(self.authTimer);
                self.authTimer = null;
            }

            var wasLinked = self.linkup;
            self.connected = false;
            self.connecting = false;
            self.linkup = false;
            switch (message.code) {
                case WireError.AUTH_FAILED:
                    onFail(message.code);
                    break;
                default:
                    {
                        if (wasLinked) {
                            self.killPendingRequests();
                            if (!self.skipOnDisconnect) {
                                onDisconnect(message.code);
                            }
                        } else {
                            onFail(message.code);
                        }
                    }
            }
        };
        ws.onmessage = function (message) {
            if ('' === message.data) {
                message.code = WireError.INTERNAL_SERVER_ERROR;
                ws.onclose(message);
                return;
            }

            var packet = SafeJSON(message.data);
            if (!packet)
                return;
            //console.log(message.data);
            if ("disconnect" === packet.cmd) {
                ws.close();
                return;
            }

            //console.log(packet.cmd);
            //console.log(packet);

            if (!packet.uid) {
                var cb = self.callbacks[packet.cmd];
                if (cb) {
                    setTimeout(function () {
                        cb(packet);
                    }, 10);
                }
            } else {
                var pr = self.pendingRequests[packet.uid];
                delete self.pendingRequests[packet.uid];
                setTimeout(function () {
                    pr.callback(pr, packet);
                }, 10);
            }
        };
        ws.error = function () {
        };

        return this;
    };

    this.registerCallback = function (command, callback) {
        this.callbacks[command] = callback;
    };

    this.disconnect = function () {
        if (this.ws) {
            this.ws.close();
        }
    };

    this.makeResponsivePacket = function (command, data) {
        return this.makePacket(command, data, this.getUID());
    };

    this.sendPacket = function (packet, callback) {
        lastSendTs = new Date();
        if (!this.ws || !this.connected) {
            if (callback) {
                var pr = {
                    'packet': packet,
                    'callback': callback,
                    'created': new Date()
                };
                callback(pr, { invalid: true, data: { result: 1, error: 1 } });
            }
            return false;
        }

        if (callback) {
            var pr = {
                'packet': packet,
                'callback': callback,
                'created': new Date()
            };
            if (!packet.uid)
                throw "uid not set for packet's callback: " + packet.toString();
            this.pendingRequests[packet.uid] = pr;
        } else {
            if (packet.uid && !callback)
                throw "callback not set for packet's uid: " + packet.toString();
        }

        /*console.log(JSON.stringify(packet, function (key, value) {
            if (null === value) {
                return undefined;
            }
            return value;
        }));*/
        this.ws.send(JSON.stringify(packet, function (key, value) {
            if (null === value) {
                return undefined;
            }
            return value;
        }));
        return true;
    };

    this.killPendingRequests = function () {
        for (var i in this.pendingRequests) {
            var pr = this.pendingRequests[i];
            pr.callback(pr, { invalid: true, data: { result: 1, error: 1 } });
        }
    };

    var self = this;
    /*setInterval(function () {
        if (!self.connected) {
            return;
        }

        var diff = ((new Date().getTime()) - lastSendTs) / 1000;
        if (diff > 30) {
            self.sendPacket({});
        }
    }, 15000);*/
}

export default Wire;