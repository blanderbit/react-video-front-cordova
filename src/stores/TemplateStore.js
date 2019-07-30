import {observable, action} from 'mobx';
import {php} from '.';
import {isEmpty, flatten} from 'lodash-es';
import {vlogEditorStore as editor} from '../';
import {history} from '../constants/routes';

export class TemplateStore {

  @observable fields = []
  @observable projectId = null;
  @observable activeTemplate = null

  getProjectId = () => php.get('/vlog/new')
  .then(({project_id}) => project_id)

  setProjectId = id => this.projectId = id

  setTemplate = id => php.get(`/templates/${id}`)
  .then(template => this.fields = template.fields)

  setProjectId = id => this.projectId = id

  @action insertMedia = (mediaObj, i) => {
    this.media[i] = mediaObj;
  }

  deleteTemplate = id => php.delete(`/templates/${id}`)
  .then(this.loadTemplates)

  @action updateField = (index, changes) => {
    this.fields = this.fields.map((field, i) => i === index ? {...field, ...changes} : field);
  }

  @action addContent = (fieldIndex, content) => this.updateField(fieldIndex, {
    contents: [
      ...this.fields[fieldIndex].contents.toJS(),
      content
    ]
  })

  @action deleteContent = (fieldIndex, contentIndex) => () => this.updateField(fieldIndex, {
    contents: this.fields[fieldIndex].contents.filter((content, i) => i !== contentIndex)
  })

  @action replaceContent = (fieldIndex, contentIndex) => newContent => this.updateField(fieldIndex, {
    contents: this.fields[fieldIndex].contents.map((content, i) => i === contentIndex ? newContent : content)
  })

  @action splitContent = (fieldIndex, contentIndex) => splitPoint => {
    const original = this.fields[fieldIndex].contents[contentIndex];
    const newContent = [
      {...original, outpoint: splitPoint},
      {...original, inpoint: splitPoint}
    ];
    this.fields = this.fields.map((field, fIndex) => fIndex === fieldIndex
      ? {
        ...field,
        contents: flatten(field.contents.map((content, cIndex) =>
          cIndex === contentIndex
            ? newContent
            : content
        ))
      }
      : field);
  }

  @action rearrangeContents = fieldIndex => newOrder => {
    this.fields = this.fields.map((field, i) => i === fieldIndex ? {...field, contents: newOrder} : field);
  }

  isValid = () => this.fields.every(field => !isEmpty(field.contents))

  next = () => {
    const flatMedia = flatten(this.fields.toJS().map(field => field.contents.toJS()));
    php.post(`/vlog/${this.projectId}`, {
      media: JSON.stringify(flatMedia)
    })
    .then(() => {
      editor.setMedia(flatMedia);
      history.push(`/configure-vlog/${this.projectId}`);
    });
  }
}

export default TemplateStore;
