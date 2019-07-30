import React, {Component} from 'react';
import styles from './styles.scss';
import Swipeable from 'react-swipeable';
import classNames from 'classnames';

export default class SwipeItem extends Component {

  callAction = func => () => {
    func();
    this.props.afterAction && this.props.afterAction();
  }

  getActionsWidth = side => side === this.props.reveal
    ? `${this.props.actions[side].length * 80}px`
    : '0px'

  renderAction = (action, i) => (
    <div key={i} className={styles.action} onClick={this.callAction(action.func)}>
      {action.label}
    </div>
  )

  render() {
    const {onSwipe, actions: {left, right}, children, className} = this.props;
    return (
      <div className={styles.container}>
        {left && <div className={styles.actions} style={{width: this.getActionsWidth('left')}}>
          {left.map(this.renderAction)}
        </div>}
        <Swipeable
          trackMouse
          className={className}
          onSwipedLeft={onSwipe('right')}
          onSwipedRight={onSwipe('left')}
        >
          {children}
        </Swipeable>
        {right && <div className={styles.actions} style={{width: this.getActionsWidth('right')}}>
          {right.map(this.renderAction)}
        </div>}
      </div>

    );
  }
}
