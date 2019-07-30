import React, {Component} from 'react';
import {Button, Toggle, Segment} from '../../atoms';
import {Preview} from '../../components';
import FontAwesome from 'react-fontawesome';
import styles from './styles.scss';
import {inject, observer} from 'mobx-react';

@inject('vlogEditor')
@observer
export default class RenderVlog extends Component {

  options = [
    // {
    //   text: 'Share on Twitter',
    //   func: this.props.vlogRender.shareTwitter
    // },
    // {
    //   text: 'Share on Facebook',
    //   func: this.props.vlogRender.shareFacebook
    // },
    // {
    //   text: 'Share on Instagram',
    //   func: this.props.vlogRender.shareInstagram
    // },
    // {
    //   text: <a href={this.props.vlogConfig.renderUrl} target="_blank" download>Download Video</a>,
    //   func: this.props.vlogRender.download
    // },
    // {
    //   text: 'Email Video',
    //   func: this.props.vlogRender.email
    // },
  ].map(({text, func}) => (
    <div className={styles.option} onClick={func}>
      <div>{text}</div>
      <FontAwesome className={styles.icon} name="chevron-right"/>
    </div>
  ))

  render() {
    const {renderUrl} = this.props.vlogConfig;
    return (
      <div className={styles.container}>
        <Preview className={styles.preview} src={renderUrl}/>
        <Segment title="Share">
          {[this.options]}
        </Segment>
      </div>
    );
  }
}
