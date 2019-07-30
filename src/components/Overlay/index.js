import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';

@inject('overlay')
@observer
export default class Overlay extends Component {

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  onClose = () => this.props.overlay.closeOverlay()

  handleClick = e => e.target.isEqualNode(this.ref.current) && this.onClose()

  renderContent = (content, i) => (
    <div ref={this.ref} className={classNames(styles.content)}>
      {content}
    </div>
  )

  render() {
    const {className} = this.props;
    const children = this.props.overlay.overlayContent;
    const length = React.Children.count(children);
    const active = length > 0;
    return (
      <div className={classNames(styles.container, !active && styles.closed, className)}
        onClick={this.handleClick}
      >
        <div
          className={styles.contents}
          style={{transform: `translateY(-${(length - 1) * 100}vh)`}}
        >
          {React.Children.map(children, this.renderContent)}
        </div>
        <div className={styles.close} onClick={this.onClose}>
          <FontAwesome name="times" />
        </div>
      </div>
    );
  }
}
