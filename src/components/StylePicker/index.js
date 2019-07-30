import React, {Component} from 'react';
import {Dropdown} from '../../atoms';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import classNames from 'classnames';
import {head, isEmpty} from 'lodash-es';

@inject('assets')
@observer
export default class StylePicker extends Component {

  componentWillMount() {
    if(!this.props.selected) {
      this.props.assets.loadStyles()
      .then(() => this.props.onSelect(head(this.props.assets.styleList)));
    } else {
      this.props.assets.loadStyles();
    }
  }

  setSelected = style => () => {
    this.props.onSelect(style);
  }

  renderSelected = style => (
    <div className={styles.style}>
      <div className={styles.styleMeta}>
        <div className={styles.styleName} style={{fontFamily: style.font}}>{style.name}</div>
        <div className={styles.fontName}>{style.font}</div>
      </div>
      <div className={styles.colorGroup}>
        <div className={styles.color} style={{background: style.textcolor}} />
        <div className={styles.color} style={{background: style.backgroundcolor}} />
      </div>
    </div>
  )

  renderStyle = (style, i) => (
    <div key={`${style.name}-${i}`} className={styles.style} onClick={this.setSelected(style)}>
      <div className={styles.styleMeta}>
        <div className={styles.styleName} style={{fontFamily: style.font}}>{style.name}</div>
        <div className={styles.fontName}>{style.font}</div>
      </div>
      <div className={styles.colorGroup}>
        <div className={styles.color} style={{background: style.textcolor}} />
        <div className={styles.color} style={{background: style.backgroundcolor}} />
      </div>
    </div>
  )

  render() {
    const {selected, className} = this.props;
    const {styleList} = this.props.assets;
    return !isEmpty(styleList) ? (
      <Dropdown
        className={classNames(styles.dropdown, className)}
        selected={selected && this.renderSelected(selected)}
      >
        {styleList.map(this.renderStyle)}
      </Dropdown>
    ) : (
      <div className={styles.empty}>
        <div>No styles found.</div>
        <div>Create styles easily through the "Customize" panel!</div>
      </div>
    );
  }
}
