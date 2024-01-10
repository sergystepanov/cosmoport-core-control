import { createRoot } from 'react-dom/client';
import App from './containers/App';
import Api from './api/Api';
import Socket from './api/Socket';
import { AppResourcesType } from './types/Types';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

window.electron.ipcRenderer.sendMessage('resources');
window.electron.ipcRenderer.on('resources', (resources) => {
  const { audio, config } = resources as AppResourcesType;
  const { ssl, server, ws } = config.address;
  const address = `http${ssl === 'true' ? 's' : ''}://${server}`;

  const api = Api(address);
  const socket = Socket({ ws: ws + '/events?id=control', ssl });

  root.render(<App api={api} socket={socket} audio={audio} />);
});
