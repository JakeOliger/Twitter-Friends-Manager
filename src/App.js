import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Pagination from './components/Pagination';
import Settings from './components/Settings';
import gFriends from './friend-info.json'

function strContains(string, terms) {
  for (let t in terms)
    if (string.toLowerCase().includes(terms[t])) return true;
  return false;
}

class Role extends Component {
  render() {
    let className = "button role " + (this.props.pressed ? "pressed" : "not-pressed");
    return (
      <button
        className={className}
        onClick={() => this.props.onClick(this.props.label)}
        name={this.props.label}>
          {this.props.label}
      </button>
    );
  }
}

class Friend extends Component {
  render() {
    return (
      <div className="friend">
        <img src={"./images/" + this.props.username + ".jpg"} alt={"@" + this.props.username + "'s profile picture"}></img>
        <p>
          <span className="name">{this.props.name}</span>
          <a className="handle" href={"https://twitter.com/" + this.props.username}>{"@" + this.props.username}</a>
        </p>
        <p className="bio">{this.props.bio}</p>
        <br></br>
        <div className="roles">
          {
            this.props.roles.map((role, index) => {
              return (
                <Role
                  pressed={role.value}
                  label={role.name}
                  onClick={(role) => {this.props.onClick(this.props.username, role)}}
                  key={index}
                  />
              );
            })
          }
       </div>
      </div>
    );
  }
}

class Friends extends Component {
  constructor(props) {
    super(props);

    let friendRoles = this.getFriendRoles(this.props.roles);

    this.state = {
      roles: this.props.roles,
      friendRoles: friendRoles,
      index: 0,
      showJSON: false,
      showSettings: false
    };

    this.handleRoleToggle = this.handleRoleToggle.bind(this);
    this.showJSON = this.showJSON.bind(this);
    this.showSettings = this.showSettings.bind(this);
    this.hideModals = this.hideModals.bind(this);
    this.handleSettingsUpdate = this.handleSettingsUpdate.bind(this);
    this.getFriendRoles = this.getFriendRoles.bind(this);
  }

  getFriendRoles(roles) {
    var friendRoles = {};
    
    gFriends.map((friend, index) => {
      friendRoles[friend.username] = [];
      for (let role in roles) {
        if (roles.hasOwnProperty(role)) {
          friendRoles[friend.username].push({
            name: role,
            value: strContains(friend.bio, roles[role])
          });
        }
      }
      return null;
    });

    return friendRoles;
  }

  handleRoleToggle(username, role) {
    var friendRoles = JSON.parse(JSON.stringify(this.state.friendRoles));
    for (let i in friendRoles[username]) {
      if (friendRoles[username][i].name === role) {
        friendRoles[username][i].value = !friendRoles[username][i].value;
        break;
      }
    }
    this.setState({friendRoles: friendRoles});
  }

  paginationCallback(newIndex) {
    this.setState({index: newIndex});
  }

  handleSettingsUpdate(roles) {
    let friendRoles = this.getFriendRoles(roles);
    this.setState({friendRoles: friendRoles, roles: roles});
  }

  showSettings() {
    this.setState({showJSON: false, showSettings: true});
  }

  showJSON() {
    let friendRoles = {};

    for (let f in this.state.friendRoles) {
      for (let r in this.state.friendRoles[f]) {
        if (this.state.friendRoles[f][r].value) {
          if (friendRoles[f] === undefined) {
            friendRoles[f] = [];
          }
          friendRoles[f].push(this.state.friendRoles[f][r]);
        }
      }
    }
    
    this.setState({showJSON: true, showSettings: false});

    let textarea = document.getElementById("json");
    textarea.value = JSON.stringify(friendRoles);
    textarea.select();
    document.execCommand('copy');
  }

  hideModals() {
    this.setState({showJSON: false, showSettings: false});
  }

  render() {
    let friendsToShow = gFriends.slice(
      this.state.index,
      this.state.index + this.props.rows * this.props.cols
    );

    let jsonVisible = this.state.showJSON ? "visible" : "invisible";
    let settingsVisible = this.state.showSettings ? "visible" : "invisible";

    let json = (<div id="json-container" className={"modal " + jsonVisible}>
      <div className="close-button" onClick={this.hideModals}></div>
      <textarea id="json"></textarea>
    </div>);
    let settings = (<Settings
      updateCallback={this.handleSettingsUpdate}
      roles={this.state.roles}
      className={settingsVisible}
      hideModals={this.hideModals} />);

    return (
      <div id="friends-component-container">
        <div className="friends-controls">
          <button
            className="button"
            id="showSettings"
            onClick={this.showSettings}>
              Settings
          </button>
          <button
            className="button"
            id="showJSON"
            onClick={this.showJSON}>
              Show JSON
          </button>
          <div className="horizontal-separator"></div>
          <Pagination
            rows={15}
            cols={3}
            index={this.state.index}
            totalItems={gFriends.length}
            updateCallback={(i) => {this.paginationCallback(i)}}
            />
        </div>
        <div id="friends">
          {
            friendsToShow.map((friend, index) => {
              return (
                <Friend
                  username={friend.username}
                  name={friend.name}
                  bio={friend.bio}
                  roles={this.state.friendRoles[friend.username]}
                  onClick={this.handleRoleToggle}
                  key={friend.username}
                  /> 
              );
            })
          }
        </div>
        <Pagination
          rows={15}
          cols={3}
          block={true}
          index={this.state.index}
          totalItems={gFriends.length}
          updateCallback={(i) => {this.paginationCallback(i)}}
          />
        {json}
        {settings}
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    var roles = {
      "Politician": ['senator', 'representative', 'congressman', 'congresswoman'],
      "Media": ['reporter', 'journalist', 'staff writer', 'editor', 'journo', 'i write', 'columnist', 'contributor', 'correspondent', 'bureau chief', 'panelist', 'tips:', 'opining', 'political analyst', 'blogger', 'writer for', 'writing for'],
      "Celebrity": ['personality', 'comedian', 'tv star'],
      "Academic": ['historian', 'scientist', 'researcher', 'professor', ' prof ', 'philosopher', 'public intellectual']
    };

    return (
      <div>
        <Header />
        <Friends roles={roles} rows={15} cols={3} />
        <ScrollToTop />
        <Footer />
      </div>
    );
  }
}

export default App;
