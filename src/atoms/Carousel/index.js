import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
import {isEmpty} from 'lodash-es';
import styles from './styles.scss';
import classNames from 'classnames';

export default class Carousel extends Component {

  constructor(props) {
    super(props);
    this.carouselRef = React.createRef();
  }

  scroll = direction => () => {
    this.timer = setInterval(() => this.carouselRef.current.scrollLeft += direction * 2, 1);
  }

  stopScrolling = () => clearInterval(this.timer);

  render() {
    const {items, renderFunction, className} = this.props;
    const empty = isEmpty(items);
    const hasTouch = 'ontouchstart' in document.documentElement;
    const renderNavKeys = !empty && !hasTouch;

    if(empty) {
      return null;
    }

    return (
      <div className={classNames(styles.container, className)}>
        <div className={styles.header}>{this.props.title}</div>
        {renderNavKeys && <div className={styles.left} onMouseEnter={this.scroll(-1)} onMouseLeave={this.stopScrolling}>
          <FontAwesome name="chevron-left"/>
        </div>}
        {<div ref={this.carouselRef} className={styles.items}>
          {items.map(renderFunction)}
        </div>}
        {renderNavKeys && <div className={styles.right} onMouseEnter={this.scroll(1)} onMouseLeave={this.stopScrolling}>
          <FontAwesome name="chevron-right"/>
        </div>}
      </div>

    );
  }
}
