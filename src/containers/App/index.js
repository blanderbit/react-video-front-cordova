import React, {Component} from 'react';
import {Switch, Route, withRouter, Redirect, matchPath} from 'react-router';
import {Header, NavBar, Toolbar, Toast, Overlay} from '../../components';
import routes, {navBarRoutes} from '../../constants/routes';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import classNames from 'classnames';
import {head} from 'lodash-es';

@withRouter
@inject('session')
@observer
class App extends Component {

  componentWillMount() {
    if(!this.props.session.token) {
      this.props.history.replace('/');
    }
  }

  renderRoute = route => <Route
    key={route.path}
    exact
    path={route.path}
    component={() =>
      <route.component className={styles.content} {...route.props} />
    }
    name={route.name}
    exact
  />

  renderAllRoutes = () =>
    <Switch>
      {routes.map(this.renderRoute)}
      <Redirect to="/home" />
    </Switch>

  render() {
    const route = head(
      routes.map(route => matchPath(this.props.location.pathname, {path: route.path, exact: true}) && route)
      .filter(Boolean)
    );
    return (
      <div className={styles.container}>
        <Header className={classNames(styles.header, !route.header && styles.hidden)} routeObj={route}/>
        {this.renderAllRoutes()}
        <NavBar className={classNames(styles.navBar, !route.navBar && styles.hidden)}/>
      </div>
    );
  }
}

export default App;
