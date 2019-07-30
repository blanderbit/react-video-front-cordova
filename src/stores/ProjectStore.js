import {observable} from 'mobx';
import {php} from '.';
import {vlogEditorStore as editor, templateStore as templates} from '../';
import {pick} from 'lodash-es';

export class ProjectStore {

  @observable projectId = null;
  @observable title = null;
  @observable description = null;
  @observable access = null;
  @observable status = null;
  @observable renders = null;
  @observable options = {};
  @observable song = null;

  setProperty = (property, value) => this[property] = value;

  setOption = (option, value) => () => this.options = {...this.options, [option]: value}

  toggleOption = option => () => this.options = {...this.options, [option]: !this.options[option]}

  clearProject = () => {
    this.projectId = null;
    this.title = null;
    this.description = null;
    this.access = null;
    this.status = null;
    this.renders = null;
    this.song = null;
    this.options = null;

    editor.setMedia([]);
    editor.setProjectId(null);
  }

  setProject = id =>
    php.get(`/vlog/${id}`).then(project => {
      this.projectId = project.id;
      this.title = project.title;
      this.description = project.description;
      this.access = project.access;
      this.status = project.status;
      this.renders = project.renders;
      this.song = project.song;
      this.options = project.options;

      editor.setMedia(project.video);
      editor.setProjectId(this.projectId);
    });

  createProject = professional => php.get(`/vlog/new${professional ? '?professional=true' : ''}`)
  .then(res => res.project_id)

  reduceMediaObj = mediaObj => {
    if (mediaObj.mediatype === 'video') {
      const properties = ['duration', 'inpoint', 'outpoint', 'mediatype',
        'overlay', 'seconds', 'src', 'thumb', 'video_id', 'videoname', 'sound'];
      return pick(mediaObj, properties);
    }
    return mediaObj;
  }

  saveProject = () => php.post(`/vlog/${this.projectId}`, {
    title: this.title,
    description: this.description,
    access: this.access,
    options: JSON.stringify(this.options),
    song: this.song,
    media: JSON.stringify(editor.media.toJS().map(this.reduceMediaObj))
  })

  updateProject = changes => php.post(`/vlog/${this.projectId}`, changes)

  deleteProject = () => php.delete(`/vlog/${this.projectId}`).then(this.clearProject)

  renderProject = orientation => php.post(`/vlog/render/${this.projectId}`, {orientation})

  shareWithTeam = () => this.access !== 'team'
    && this.updateProject({access: 'team'})
    .then(() => this.access = 'team')

  updateTitle = () => this.updateProject({title: this.title})

  updateDescription = () => this.updateProject({description: this.description})

  download = () => window.open(`https://vdb.vlogahead.cloud/vlog/download/${this.projectId}`)

  sendDownload = () => php.get(`/vlog/mail/${this.projectId}`)

  setSong = song => this.updateProject({song: JSON.stringify(song)}).then(() => this.song = song);

}

export default ProjectStore;
