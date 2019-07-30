import {observable} from 'mobx';
import {php, videoDBbaseURL} from '.';
import Resumable from 'resumablejs';
import {sessionStore} from '../';
import {isEmpty} from 'lodash-es';

export class AssetsStore {

  @observable assetList = []
  @observable uploading = false;
  @observable progress = 0;
  @observable styleList = [];

  loadStyles = () => php.get('/styles')
  .then(res => {
    this.styleList = !isEmpty(res.styles) ? res.styles : [];
  });

  uploadStyle = (access, style) => php.post('/styles', {...style, access})

  deleteStyle = id => php.delete(`/styles/${id}`)

  loadAssets = () => php.get('/assets')
  .then(res => this.assetList = res.asset);

  deleteAsset = id => php.delete(`/assets/${id}`)

  initResumables = (includeTeam = true) => {

    includeTeam && (() => {
      this.teamResumable = new Resumable({
        target: `${videoDBbaseURL}/video/upload`,
        query: {
          action: 'uploadasset',
          access: 'team'
        },
        headers: {
          Authorization: `Token ${sessionStore.token}`
        },
        filetype: ['mp4']
      });

      this.teamResumable.assignBrowse(document.getElementById('teamupload'));

      this.teamResumable.on('fileAdded', () => {
        this.teamResumable.upload();
        this.uploading = true;
      });

      this.teamResumable.on('fileSuccess', () => {
        this.uploading = false;
        this.loadAssets();
        this.teamResumable.cancel();
        this.progress = 0;
      });

      this.teamResumable.on('progress', () => this.progress = this.teamResumable.progress() * 100);
    })();

    this.personalResumable = new Resumable({
      target: `${videoDBbaseURL}/video/upload`,
      query: {
        action: 'uploadasset',
        access: 'personal'
      },
      headers: {
        Authorization: `Token ${sessionStore.token}`
      },
      filetype: ['mp4']
    });

    this.personalResumable.assignBrowse(document.getElementById('personalupload'));

    this.personalResumable.on('fileAdded', () => {
      this.personalResumable.upload();
      this.uploading = true;
    });

    this.personalResumable.on('fileSuccess', () => {
      this.uploading = false;
      this.loadAssets();
      this.personalResumable.cancel();
      this.progress = 0;
    });

    this.personalResumable.on('progress', () => this.progress = this.personalResumable.progress() * 100);
  }

  cancelUpload = () => {
    this.uploading = false;
    this.personalResumable.cancel();
    this.teamResumable && this.teamResumable.cancel();
    this.progress = 0;
  }

}

export default AssetsStore;
