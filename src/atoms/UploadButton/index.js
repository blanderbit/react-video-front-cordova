import React, {Component} from 'react';
import Resumable from 'resumablejs';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import {isNumber} from 'lodash-es';
import {videoDBbaseURL} from '../../stores';

@inject('session')
@observer
export default class UploadButton extends Component {
  constructor(props) {
    super(props);
    this.targetRef = React.createRef();
    this.state = {
      progress: null
    };
  }

  componentDidMount() {
    this.resetResumable();
    this.targetRef.current.children[0].accept = 'video/*';
  }

  setProgress = progress => this.setState({progress})

  resetProgress = () => this.setState({progress: null})

  resetResumable = () => {
    this.resumable = new Resumable({
      target: `${videoDBbaseURL}/video/upload`,
      query: {
        action: 'uploadvideo',
        project_id: this.props.projectId
      },
      headers: {
        Authorization: `Token ${this.props.session.token}`
      }
    });

    this.resumable.assignBrowse(this.targetRef.current);
    this.resumable.on('fileAdded', this.resumable.upload);
    this.resumable.on('fileSuccess', (resumableFile, response) => this.onChange(JSON.parse(response)));
    this.resumable.on('progress', () => this.setProgress(this.resumable.progress() * 100));
  }

  onChange = mediaObj => {
    this.props.onChange(mediaObj);
    this.resumable.cancel();
    this.resetProgress();
  }

  render() {
    const {className} = this.props;
    const {progress} = this.state;
    return (
      <div className={classNames(styles.container, className)}>
        <FontAwesome className={styles.icon} name="plus" />
        {isNumber(progress) && <div className={styles.progress} style={{width: `${progress}%`}}/>}
        <div className={styles.target} ref={this.targetRef} />
      </div>
    );
  }
}
