import React, {Component} from 'react';
import {Segment, SwipeItem, Icon, Spinner} from '../../atoms';
import classNames from 'classnames';
import styles from './styles.scss';
import {withRouter} from 'react-router';
import {php} from '../../stores';
import {isEmpty} from 'lodash-es';

@withRouter
export default class TemplateManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pending: true,
      templates: [],
      revealIndex: null,
      revealSide: null
    };
  }

  loadTemplates = () => php.get('/templates')
  .then(({templates}) => this.setState({templates, pending: false}));

  componentDidMount() {
    this.loadTemplates();
  }

  getSwipeActions = id => ({
    right: [
      {
        label: (
          <div className={styles.icon}>
            <Icon name="trash"/>
            <div>Delete</div>
          </div>
        ),
        func: this.deleteTemplate(id)
      }
    ]
  })

  setReveal = i => side => () => this.setState({revealIndex: i, revealSide: side})

  resetReveal = () => this.setState({revealIndex: null, revealSide: null})

  goToEditor = () => this.props.history.push('/template-editor')

  deleteTemplate = id => () => php.delete(`/templates/${id}`)
  .then(this.loadTemplates)

  renderHeader = () => (
    <div className={styles.header}>
      <div>Your Templates</div>
      <div className={styles.add} onClick={this.goToEditor}>+ Add</div>
    </div>
  )

  renderTemplate = (template, i) => (
    <SwipeItem
      key={template.id}
      className={styles.template}
      reveal={this.state.revealIndex === i && this.state.revealSide}
      onSwipe={this.setReveal(i)}
      actions={this.getSwipeActions(template.id)}
      afterAction={this.resetReveal}
    >
      <div>{template.title}</div>
      <div>{`Created by: ${template.owner.first_name} ${template.owner.last_name}`}</div>
    </SwipeItem>
  )

  render() {
    const {className} = this.props;
    const {pending, templates} = this.state;
    return pending ? <Spinner/> : (
      <div className={classNames(styles.container, className)}>
        <Segment elementClassName={styles.element} title={this.renderHeader()}>
          {templates.map(this.renderTemplate)}
        </Segment>
        {isEmpty(templates) && <div className={styles.empty}>No templates found.</div>}
      </div>
    );
  }
}
