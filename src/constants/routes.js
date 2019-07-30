import React from 'react';
import {NavLink} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory'; 
import createHashHistory from 'history/createHashHistory';
import FontAwesome from 'react-fontawesome';
import {Home, Login, Profile, Settings, VlogEditor, ConfigureVlog, RenderVlog, NotFound, Logout, VlogDetails, Template, Customize, Share, TemplateManager, TemplateEditor, FAQ, About, Contact} from '../containers';
import styles from './styles.scss';
import classNames from 'classnames';
import logo from '../../assets/logo-transparent.png';
export const history = createHashHistory(); //cordova only

const backButton = <FontAwesome className={classNames(styles.icon, styles.backButton)} name="angle-left" onClick={history.goBack}/>;

const notFound = {
  name: 'Not Found',
  path: '/not-found',
  component: NotFound,
  header: true
};

const login = {
  name: 'Login',
  icon: 'sign-in-alt',
  path: '/',
  component: Login,
  fullscreen: true
};

const logout = {
  name: 'Logout',
  path: '/logout',
  component: Logout
};

const home = {
  name: 'Home',
  icon: 'home',
  path: '/home',
  component: Home,
  header: {
    center: <img className={styles.logo} src={logo}/>
  },
  navBar: true
};

const createVlog = {
  name: 'Vlog Editor',
  path: '/edit-vlog',
  component: VlogEditor,
  header: {
    left: backButton
  }
};

const editVlog = {
  name: 'Vlog Editor',
  path: '/edit-vlog/:id',
  component: VlogEditor,
  header: {
    left: backButton
  }
};

const settings = {
  name: 'Settings',
  path: '/settings',
  component: Settings,
  header: {
    left: backButton
  },
  navBar: true
};

const profile = {
  name: 'Profile',
  icon: 'profile',
  path: '/profile',
  component: Profile,
  header: {
    left: <NavLink to="/settings"><FontAwesome className={styles.icon} name="cog"/></NavLink>,
    right: <NavLink to="/logout"><FontAwesome className={styles.icon} name="sign-out"/></NavLink>
  },
  navBar: true
};

const configureVlog = {
  name: 'Configure Vlog',
  path: '/configure-vlog/:id',
  component: ConfigureVlog,
  header: {
    left: backButton
  }
};

const renderVlog = {
  name: 'Render Vlog',
  path: '/render-vlog/:id',
  component: RenderVlog,
  header: {
    left: backButton
  },
  navBar: true
};

const vlogDetails = {
  name: 'Vlog details',
  path: '/vlog-details/:id',
  component: VlogDetails,
  header: {
    left: backButton,
  }
};

const partialTemplate = {
  name: 'Template',
  path: '/template/:templateId',
  component: Template,
  header: {
    left: backButton
  }
};

const template = {
  name: 'Template',
  path: '/template/:templateId/:projectId',
  component: Template,
  header: {
    left: backButton
  },
};

const customize = {
  name: 'Customize',
  path: '/customize',
  component: Customize,
  header: {
    left: backButton
  },
  navBar: true
};

const share = {
  name: 'Share',
  path: '/share/:id',
  component: Share,
  header: {
    left: backButton
  }
};

const templateManager = {
  name: 'Template Manager',
  path: '/template-manager',
  component: TemplateManager,
  header: {
    left: backButton
  }
};

const templateEditor = {
  name: 'Template Editor',
  path: '/template-editor',
  component: TemplateEditor,
  header: {
    left: backButton
  }
};

const faq = {
  name: 'FAQ',
  path: '/faq',
  component: FAQ,
  header: {
    left: backButton
  }
};

const about = {
  name: 'About Us',
  path: '/about',
  component: About,
  header: {
    left: backButton
  }
};

const contact = {
  name: 'Contact Us',
  path: '/contact',
  component: Contact,
  header: {
    left: backButton
  }
};

export const navBarRoutes = [home, editVlog, profile];

const allRoutes = [notFound, login, logout, home, editVlog, settings, profile, createVlog, editVlog, configureVlog, renderVlog, vlogDetails, partialTemplate, template, customize, share, templateManager, templateEditor, faq, about, contact];

export default allRoutes;
