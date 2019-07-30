import axios from 'axios';
import encode from 'object-to-formdata';
import {history} from '../constants/routes';
import {sessionStore} from '..';
export {AssetsStore} from './AssetsStore';
export {OverlayStore} from './OverlayStore';
export {ProfileStore} from './ProfileStore';
export {ProjectStore} from './ProjectStore';
export {SessionStore} from './SessionStore';
export {SettingsStore} from './SettingsStore';
export {TemplateStore} from './TemplateStore';
export {TemplateEditorStore} from './TemplateEditorStore';
export {VlogEditorStore} from './VlogEditorStore';

export const videoDBbaseURL = process.env.videodb;

export const php = axios.create({
  baseURL: videoDBbaseURL,
});

php.interceptors.request.use(
  config => ({...config, data: encode(config.data)}),
  error => error
);

php.interceptors.response.use(
  response => {
    if (response.data && response.data.error) {
      sessionStore.showError(response.data.error);
    }
    return response.data;
  }
);

export const userDBbaseURL = process.env.userdb;

export const userDB = axios.create({
  baseURL: userDBbaseURL,
});

userDB.interceptors.response.use(
  response => response.data
);

