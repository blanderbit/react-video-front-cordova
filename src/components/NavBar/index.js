import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {NavLink} from 'react-router-dom';
import {Icon} from '../../atoms';
import {ConfirmProfessional} from '../';
import {inject, observer} from 'mobx-react';
import styles from './styles.scss';
import FontAwesome from 'react-fontawesome';
import {isEmpty} from 'lodash-es';
import {php} from '../../stores';
import classNames from 'classnames';

const renderSpinner = () => (
  <div className={styles.option}>
    <FontAwesome className={styles.spinner} name="spinner" />
  </div>
);

class VlogTypePicker extends Component {

  render() {
    const {onSelect, onClose} = this.props;
    return (
      <div className={styles.options}>
        <div className={styles.optionsGroup}>
          <div className={styles.optionsHeader}>Create Vlog</div>
          <div className={styles.option} onClick={onSelect('template')}>From template</div>
          <div className={styles.option} onClick={onSelect('scratch')}>From scratch</div>
          <div className={styles.option} onClick={onSelect('professional')}>
            <div className={styles.prof}>Professional Vlog</div>
          </div>
        </div>
        <div className={styles.optionsGroup}>
          <div className={styles.option} onClick={onClose}>Cancel</div>
        </div>
      </div>
    );
  }
}

class TemplatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pending: true,
      templates: []
    };
  }

  componentWillMount() {
    php.get('/templates')
    .then(res => this.setState({pending: false, templates: res.templates}));
  }

  onSelect = template => () => this.props.onSelect(template)

  renderTemplate = (template, i) => (
    <div
      key={`${template.title}-${i}`}
      className={styles.option}
      onClick={this.onSelect(template)}
    >
      {template.title}
    </div>
  );

  render() {
    const {onClose} = this.props;
    const {pending, templates} = this.state;
    return (
      <div className={styles.options}>
        <div className={styles.optionsGroup}>
          <div className={styles.optionsHeader}>
            {isEmpty(templates) ? 'No templates available' : 'Choose template'}
          </div>
          {pending
            ? renderSpinner()
            : templates.map(this.renderTemplate)
          }
        </div>
        <div className={styles.optionsGroup}>
          <div className={styles.option} onClick={onClose}>Cancel</div>
        </div>
      </div>
    );
  }
}

@withRouter
@inject('overlay')
@inject('project')
@observer
export default class NavBar extends Component {

  start = selection => template => {
    ({
      scratch: () => this.props.history.push('/edit-vlog?professional=false'),
      template: () => this.props.history.push(`/template/${template.id}`),
      professional: () => this.props.history.push('/edit-vlog?professional=true')
    })[selection]();
    this.props.overlay.closeOverlay();
  }

  handleSelection = selection => () => {
    if (selection === 'scratch') {
      this.start('scratch')();
    } else {
      this.props.overlay.closeOverlay();
      this.props.overlay.openOverlay({
        template: TemplatePicker,
        professional: ConfirmProfessional
      }[selection])({onSelect: this.start(selection)})();
    }
  }

  routes = [
    {
      name: 'Home',
      icon: <Icon className={styles.icon} name="home"/>,
      path: '/home'
    },
    {
      name: 'Add Vlog',
      icon: <Icon className={styles.icon} name="camcorder"/>,
      onClick: this.props.overlay.openOverlay(VlogTypePicker)({onSelect: this.handleSelection})
    },
    {
      name: 'Profile',
      icon: <Icon className={styles.icon} name="profile"/>,
      path: '/profile'
    },
  ]

  renderRoute = ({name, icon, path, onClick}) => path
    ? (
      <NavLink key={name} to={path} className={styles.route} activeClassName={styles.active}>
        {icon}
        <div className={styles.routeName}>{name}</div>
      </NavLink>
    )

    : (
      <div key={name} className={styles.route} onClick={onClick}>
        {icon}
        <div className={styles.routeName}>{name}</div>
      </div>
    )

  render() {
    const {className} = this.props;
    return (
      <div className={classNames(styles.container, className)}>
        {this.routes.map(this.renderRoute)}
      </div>
    );
  }
}
