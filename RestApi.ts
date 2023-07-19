import { getRestApiTokenData, getRestApiTokenDataDev, getUseDevHost } from './UserPrefs';
import Const from './Const';

class RestAPI {
    tokenData = '';
    baseHeader = null;
    useDevHost = false;

    constructor() {
        this.initialize();
    }

    initialize() {
        Promise.all([getRestApiTokenData(), getRestApiTokenDataDev(), getUseDevHost()]).then((data) => {
            this.useDevHost = data[2];
            this.tokenData = (this.useDevHost ? JSON.parse(data[1]) : JSON.parse(data[0])) || 'token';
            this.baseHeader = {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
            };
        });
    }

    baseClient(endpoint: string, customConfig: any) {
        const config = {
            ...customConfig,
            headers: { ...this.baseHeader },
        };

        return fetch(`${Const.REST_API_AUTH_URL}${endpoint}`, config)
            .then(async (response) => {
                const data = await response.json();

                if (response.ok) {
                    return data;
                } else {
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                console.log(`Rest API error [${endpoint}]`, error, config);
            });
    }

    baseClientWithAuth(endpoint: string, customConfig: any) {
        const config = {
            ...customConfig,
            headers: {
                ...this.baseHeader,
                Authorization: `Bearer ${this.tokenData.token}`,
            },
        };

        return fetch(`${Const.REST_API_PARENT_URL}${endpoint}`, config)
            .then(async (response) => {
                const data = await response.json();

                if (response.ok) {
                    return data;
                } else {
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                console.log(`Rest API error [${endpoint}]`, error, config);
            });
    }

    register = () => {
        const config = {
            method: 'POST',
        };

        return this.baseClient('register', config);
    };

    login = (username: string, password: string) => {
        const config = {
            method: 'POST',
            body: JSON.stringify({
                username,
                password,
            }),
        };

        return this.baseClient('login', config);
    };

    getObjectMap = () => {
        const config = {
            method: 'GET',
        };

        return this.baseClientWithAuth('objectmap', config);
    };

    clarify = (oid: number) => {
        const config = {
            method: 'POST',
        };

        return this.baseClientWithAuth(`clarify/${oid}`, config);
    };

    getChildCode = () => {
        const config = {
            method: 'POST',
        };

        return this.baseClientWithAuth('parent-code', config);
    };

    checkChildCode = (code: number) => {
        const config = {
            method: 'GET',
        };

        return this.baseClientWithAuth(`parent-code/${code}`, config);
    };

    uploadChildPhoto = (oid: number, uri: string) => {
        const uriParts = uri.split('.');
        const fileType = uriParts[uriParts.length - 1];

        let formData = new FormData();
        formData.append('file', {
            uri,
            name: `photo.${fileType}`,
            type: `image/${fileType}`,
        });

        const config = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.tokenData.token}`,
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'Cache-Control': 'no-store',
            },
            body: formData,
        };
        const endpoint = `photo/${oid}`;

        return fetch(`${Const.REST_API_PARENT_URL}${endpoint}`, config)
            .then((response) => {
                if (response.ok) {
                    return Promise.resolve();
                } else {
                    return Promise.reject();
                }
            })
            .catch((error) => {
                console.log(`Rest API error [${endpoint}]`, error, config);
                return Promise.reject();
            });
    };

    changeObjectCard = (oid: number, name: string) => {
        const config = {
            method: 'POST',
            headers: {
                ...this.baseHeader,
                Authorization: `Bearer ${this.tokenData.token}`,
            },
            body: JSON.stringify({
                name,
            }),
        };
        const endpoint = `object-card/${oid}`;

        return fetch(`${Const.REST_API_PARENT_URL}${endpoint}`, config)
            .then(async (response) => {
                if (response.ok) {
                    return Promise.resolve();
                } else {
                    return Promise.reject();
                }
            })
            .catch((error) => {
                console.log(`Rest API error [${endpoint}]`, error, config);
                return Promise.reject();
            });
    };
}

export const RestAPIService = new RestAPI();
export default RestAPI;
