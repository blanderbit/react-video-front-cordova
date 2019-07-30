import {observable, action} from 'mobx';
import {omit, isEmpty} from 'lodash-es';
import {php, userDB} from '.';

export class TemplateEditorStore {
  @observable template = []

  @action addField = field => this.template = [...this.template.toJS(), {...field, name: ''}]

  @action updateField = (index, changes) => {
    this.template = this.template.map((field, i) => i === index ? {...field, ...changes} : field);
  }

  @action deleteField = index => () => this.template = this.template.filter((field, i) => i !== index)

  @action addContent = (fieldIndex, content) => this.updateField(fieldIndex, {
    contents: [
      ...this.template[fieldIndex].contents.toJS(),
      content
    ]
  })

  @action rearrangeFields = newOrder => this.template = newOrder;

  @action deleteContent = (fieldIndex, contentIndex) => () => this.updateField(fieldIndex, {
    contents: this.template[fieldIndex].contents.filter((content, i) => i !== contentIndex)
  })

  @action replaceContent = (fieldIndex, contentIndex) => newContent => this.updateField(fieldIndex, {
    contents: this.template[fieldIndex].contents.map((content, i) => i === contentIndex ? newContent : content)
  })

  @action rearrangeContents = fieldIndex => newOrder => {
    this.template = this.template.map((field, i) => i === fieldIndex ? {...field, contents: newOrder} : field);
  }

  saveTemplate = async meta => {
    const me = await userDB.get('/auth/user/');
    const {title} = meta;
    const template = {
      title,
      owner: JSON.stringify(me),
      fields: JSON.stringify(this.template.toJS().map(field => omit(field, ['icon']))),
    };
    return php.post('/templates', template).then(res => res.template_id);
  }

  getErrors = () => {
    const template = this.template.toJS();

    if (template.some(field => !field.name)) {
      return 'All fields should have a name.';
    }

    if(template.some(field => field.fixed && isEmpty(field.contents))) {
      return 'Fields without content may not be fixed, as this would make the field useless.';
    }

    return null;
  }

}

export default TemplateEditorStore;
