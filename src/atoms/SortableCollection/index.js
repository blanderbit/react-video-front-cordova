import React, {Component} from 'react';
import classNames from 'classnames';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';
import FontAwesome from 'react-fontawesome';
import styles from './styles.scss';

const SortableItem = SortableElement(({value}) =>
  <div className={styles.SortableItem}>
    {value}
  </div>
);

const SortableList = SortableContainer(({items, className}) => (
  <div className={className}>
    {items.map((value, index) => (
      <SortableItem key={`item-${index}`} index={index} value={value} />
    ))}
  </div>
));

export default class SortableCollection extends Component {

  onChange = ({oldIndex, newIndex}) => this.props.onChange(arrayMove(this.props.items, oldIndex, newIndex))

  render() {
    const {items, renderFunc, className} = this.props;
    return (
      <SortableList className={classNames(styles.container, className)} items={items.map(renderFunc)} onSortEnd={this.onChange} useDragHandle/>
    );
  }
}
