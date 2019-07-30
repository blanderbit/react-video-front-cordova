import React, {Component} from 'react';
import {Icon, SwipeItem} from '../../atoms';
import FontAwesome from 'react-fontawesome';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import {MediaObject, TrimmerSplitter, Configure, EditSound} from '../';

@inject('overlay')
@inject('vlogEditor')
@observer
export default class Arranger extends Component {

  constructor(props) {
    super(props);
    this.state = {
      revealIndex: null,
      revealSide: null,
    };
  }

  renderActionLabel = (label, icon, fa) => (
    <div className={styles.action}>
      {fa ? <FontAwesome name={icon} /> : <Icon name={icon} />}
      <div>{label}</div>
    </div>
  )

  getAction = (mediaObj, i) => actionKey => {
    const partialProps = {video: mediaObj};
    const {saveMedia, saveAllMedia, deleteMedia, splitVideo} = this.props.vlogEditor;
    return {
      trimSplit: {
        label: this.renderActionLabel('Trim / Split', 'trim'),
        func: this.props.overlay.openOverlay(TrimmerSplitter)({...partialProps, onTrim: saveMedia(i), onSplit: splitVideo(i)})
      },
      configure: {
        label: this.renderActionLabel('More...', 'fade'),
        func: this.props.overlay.openOverlay(Configure)({...partialProps, onSave: saveMedia(i), onSaveAll: saveAllMedia})
      },
      sound: {
        label: this.renderActionLabel('Sound', 'music', true),
        func: this.props.overlay.openOverlay(EditSound)({...partialProps, onSave: saveMedia(i), onSaveAll: saveAllMedia})
      },
      delete: {
        label: this.renderActionLabel('Delete', 'trash'),
        func: () => {
          deleteMedia(i);
          this.resetReveal();
        }
      }
    }[actionKey];
  }
  generateActions = (mediaObj, i) => {
    const action = this.getAction(mediaObj, i);
    const actions = {
      video: [
        action('trimSplit'),
        action('configure')
      ],
      fadein: [],
      fadeout: [],
      fadeoutin: [],
      crossfade: [],
      title: [action('sound')],
      asset: [action('sound')]
    }[mediaObj.mediatype];
    if (actions) {
      return actions;
    }
    throw new Error(`Tried to render media with mediatype ${mediaObj.mediatype}, must be one of ${Object.keys(actions)}`);
  }

  DragHandle = SortableHandle(() => <div className={styles.handle}><FontAwesome name="bars" /></div>);

  SortableItem = SortableElement(({value, revealIndex}) => (
    <SwipeItem
      actions={{left: this.generateActions(value, revealIndex), right: [this.getAction(value, revealIndex)('delete')]}}
      afterAction={this.resetReveal}
      onSwipe={this.setReveal(revealIndex)}
      reveal={revealIndex === this.state.revealIndex && this.state.revealSide}
      className={styles.item}
    >
      <MediaObject
        value={value}
        onChange={this.props.vlogEditor.saveMedia(revealIndex)}
        chronoIndex={value.mediatype === 'video' && this.props.vlogEditor.getChronoIndex(value)}
      />
    </SwipeItem>
  ));

  SortableList = SortableContainer(({items}) => (
    <div className={styles.list}>
      {items.map((value, index) => (
        <this.SortableItem
          key={`item-${index}`}
          index={index}
          revealIndex={index}
          value={value} />
      ))}
    </div>
  ));

  setReveal = index => side => () => {
    this.state.revealSide
      ? this.resetReveal()
      : this.setState({
        revealIndex: index,
        revealSide: side
      });
  }

  resetReveal = () => {
    this.setState({
      revealIndex: null,
      revealSide: null
    });
  }

  handleAction = (action, itemIndex) => () => {
    action.func(itemIndex);
    this.resetReveal();
  }

  render() {
    const {media, onSortEnd} = this.props.vlogEditor;
    return (
      <this.SortableList
        items={media}
        onSortEnd={onSortEnd}
        onSortStart={this.resetReveal}
        useDragHandle
        lockAxis="y"
      />
    );
  }
}
