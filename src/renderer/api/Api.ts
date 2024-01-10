import { Api as Client } from 'cosmoport-core-api-client';
import ApiError from '../components/indicators/ApiError';

export class Api extends Client {
  _onServerUnavailable = () => {};

  constructor(data: {
    url: any;
    request?: (uri: string, options: object) => Promise<any>;
  }) {
    // @ts-ignore
    super(data);
  }

  set onServerUnavailable(cb: () => void) {
    this._onServerUnavailable = cb;
  }
}

const api = (address: string): Api => {
  const base = new Api({ url: address });

  base.request = (uri, options) =>
    new Promise((resolve, reject) => {
      fetch(address + uri, { ...options, mode: 'cors' })
        .then(
          (response) =>
            new Promise((resolve) =>
              response
                .json()
                .then((json) =>
                  resolve({
                    status: response.status,
                    ok: response.ok,
                    json,
                  }),
                )
                .catch(() => {
                  if (response.status === 504) {
                    base.onServerUnavailable();
                  }
                }),
            ),
        )
        .then((resp) => {
          const { ok = false, json = {} } = resp as { ok?: boolean; json: any };
          if (ok) {
            resolve(json);
          } else {
            return Promise.reject(json);
          }
        })
        .catch((error) => {
          ApiError(error);
          reject({ code: error.code, message: error.message });
        });
    });

  return base;
};

export default api;
