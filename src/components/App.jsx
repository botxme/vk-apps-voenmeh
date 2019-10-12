import React, { Component } from 'react';
import connect from '@vkontakte/vk-connect';
import { Epic, Tabbar, TabbarItem, View, Panel, PanelHeader, FormLayout, FormLayoutGroup, Avatar, Select, Div, Button } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
import '../css/main.css';
import '../css/first.css';

import Icon24Newsfeed from '@vkontakte/icons/dist/24/newsfeed';
import Icon16Fire from '@vkontakte/icons/dist/16/fire';
import Icon56EventOutline from '@vkontakte/icons/dist/56/event_outline';
import Icon28ArchiveOutline from '@vkontakte/icons/dist/28/archive_outline';
import Icon28Profile from '@vkontakte/icons/dist/28/profile';


import Schedule from './Schedule.jsx';
import Archive from './Archive.jsx';
import Profile from './Profile.jsx';
import FirstScr from './FirstScr.jsx';
import NewsFeed from './NewsFeed.jsx';
import Deadlines from './Deadlines.jsx';
import Page from './Page.jsx';

// Sends event to client
connect.send('VKWebAppInit');

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: localStorage.group != undefined ? 'schedule' : 'first',
      activePanel: 'feed',
      history: ['feed'],
      data: ''
    };
  }

  changePage(name) {
    this.setState({ activePage: name });
  }

  changePanel(name) {
    this.setState({ activePanel: name });
  }

  updateData(value) {
    this.setState({ data: value });
  };

  componentDidMount() {
    window.addEventListener('popstate', (event) => {
      console.log("назад")
      const his = [...this.state.history];
      his.pop();
      const active = his[his.length - 1];
      if (active === 'feed') {
        connect.send('VKWebAppDisableSwipeBack');
      }
      this.setState({ history: his, activePanel: active });
    }, false);
  }

  goBack() {
    window.history.back();
  }

  // метод добавления перехода из истории аппы
  goForward(activePanel) {
    const history = [...this.state.history];
    history.push(activePanel);
    if (this.state.activePanel === 'feed') {
      connect.send('VKWebAppEnableSwipeBack');
    }
    window.history.pushState({}, '', activePanel)

    this.setState({ history, activePanel });
  }

  render() {
    const tabbar = (
      <Tabbar style={{ position: "sticky" }}>
        <TabbarItem
          onClick={() => this.changePage('feed')}
          selected={this.state.activePage == 'feed'}
        ><Icon24Newsfeed /></TabbarItem>

        <TabbarItem
          onClick={() => this.changePage('time')}
          selected={this.state.activePage == 'time'}
        ><Icon16Fire width={24} height={24} /></TabbarItem>

        <TabbarItem
          onClick={() => this.changePage('schedule')}
          selected={this.state.activePage == 'schedule'}
        ><Icon56EventOutline width={28} height={28} /></TabbarItem>

        <TabbarItem
          onClick={() => this.changePage('archive')}
          selected={this.state.activePage == 'archive'}
        ><Icon28ArchiveOutline /></TabbarItem>

        <TabbarItem
          onClick={() => this.changePage('profile')}
          selected={this.state.activePage == 'profile'}
        ><Icon28Profile /></TabbarItem>
      </Tabbar>
    );

    return (
      <Epic activeStory={this.state.activePage} tabbar={(this.state.activePage != "first") ? tabbar : false}>
        <View
          id="feed"
          activePanel={this.state.activePanel}
          history={this.state.history}
          onSwipeBack={this.goBack} // для свайпа на iOS
        >
          <NewsFeed id="feed" variable={this} updateData={this} />
          <Page id="page" variable={this} data={this.state.data} />
        </View>

        <View id="time" activePanel="time">
          <Deadlines id="time" />
        </View>

        <View id="schedule" activePanel="schedule">
          <Schedule id="schedule" />
        </View>

        <View id="archive" activePanel="archive">
          <Archive id="archive" />
        </View>

        <View id="profile" activePanel="profile">
          <Profile id="profile" />
        </View>

        <View id="first" activePanel="first">
          <FirstScr id="first" variable={this} />
        </View>
      </Epic >
    );
  }
}

export default App;
