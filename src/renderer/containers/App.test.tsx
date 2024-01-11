import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import App from '../containers/App';
import Api from '../api/Api';
import Socket from '../api/Socket';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  }),
) as jest.Mock;

describe('App', () => {
  const audio = {
    dir: '',
    mp3s: [],
  };

  const address = '127.0.0.1';

  const api = Api(address);
  const ws = Socket({ ws: address });

  it('should render', async () => {
    await waitFor(() => {
      expect(render(<App api={api} socket={ws} audio={audio} />)).toBeTruthy();
    });
  });
});
