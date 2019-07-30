import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
import {php} from '../../stores';
import {isEqual} from 'lodash-es';
import classNames from 'classnames';
import styles from './styles.scss';

export default class SelectSong extends Component {
  constructor(props) {
    super(props);
    this.audioRef = React.createRef();
    this.state = {
      pending: true,
      musicList: [],
      listOpen: false
    };
  }

  componentWillMount() {
    php.get('/music')
    .then(res => this.setState({musicList: res, pending: false}));
  }

  componentDidUpdate(prevProps) {
    if (this.props.shouldPlay) {
      !isEqual(prevProps.selected, this.props.selected) && this.play();
    } else {
      this.pause();
    }
  }

  pause = e => {
    e && e.stopPropagation();
    this.audioRef.current.pause();
  }

  play = e => {
    e && e.stopPropagation();
    this.audioRef.current.play();
  }

  toggleList = () => this.setState(({listOpen: !this.state.listOpen}))

  onSelect = song => () => this.props.onChange(song);

  renderSong = song => {
    const {id, title, artist, duration, style} = song;
    const selected = this.props.selected && (this.props.selected.id === id);
    return (
      <div className={classNames(styles.song, selected && styles.selected)} onClick={this.onSelect(song)}>
        <div className={styles.title}>{title}</div>
        <div className={styles.artist}>{artist}</div>
        <div className={styles.duration}>{`${duration} - ${style}`}</div>
      </div>
    );
  }

  render() {
    const {selected} = this.props;
    const {musicList, listOpen, pending} = this.state;
    return (
      <div className={styles.container}>
        <audio src={selected && selected.src} ref={this.audioRef} />
        <div className={styles.listToggle} onClick={this.toggleList}>
          <FontAwesome className={classNames(styles.icon, styles.expand)} name={listOpen ? 'minus' : 'plus'} />
          <div className={classNames(styles.label, selected && styles.active)}>
            {selected
              ? selected.title
              : pending
                ? 'Loading Library...'
                : 'Select Music...'}
          </div>
          <FontAwesome className={styles.icon} name="pause" onClick={this.pause} />
          <FontAwesome className={styles.icon} name="play" onClick={this.play} />
        </div>
        <div className={classNames(styles.musicList, !listOpen && styles.closed)}>
          {musicList.map(this.renderSong)}
        </div>
      </div>
    );
  }
}
