import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.css';

class CategoryRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      label: this.props.label,
      keywords: this.props.keywords.join(','),
      alive: true
    };

    this.handleLabelEdit = this.handleLabelEdit.bind(this);
    this.handleKeywordsEdit = this.handleKeywordsEdit.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.die = this.die.bind(this);
  }

  handleLabelEdit(e) {
    this.setState({label: e.target.value});
  }

  handleKeywordsEdit(e) {
    this.setState({keywords: e.target.value}, () => {
      this.handleInput();
    });
  }

  handleInput() {
    this.props.updateCallback(this.props.label, this.state.label, this.state.keywords);
  }

  die() {
    this.setState({alive: false});
    this.props.killCallback();
  }

  render() {
    if (!this.state.alive) return null;
    return (
      <div className="category-row">
        <div className="close-button" onClick={this.die}></div>
        <input onChange={this.handleLabelEdit} type="text" name="label" defaultValue={this.state.label}></input>
        <input onChange={this.handleKeywordsEdit} type="text" name="keywords" defaultValue={this.state.keywords}></input>
      </div>
    );
  }
}

CategoryRow.propTypes = {
  label: PropTypes.string.isRequired,
  keywords: PropTypes.arrayOf(PropTypes.string).isRequired,
  killCallback: PropTypes.func.isRequired,
  updateCallback: PropTypes.func.isRequired,
};

class Settings extends Component {
  constructor(props) {
    super(props);

    let roles = this.props.roles;
    let rolesArray = [];

    this.roles = JSON.parse(JSON.stringify(this.props.roles));

    for (let role in roles) {
      if (roles.hasOwnProperty(role)) {
        rolesArray.push({
          label: role,
          keywords: roles[role]
        });
      }
    }
    
    this.state = {
      roles: rolesArray
    };
    
    this.applyChanges = this.applyChanges.bind(this);
    this.updateRoles = this.updateRoles.bind(this);
    this.addCategory = this.addCategory.bind(this);
  }

  removeRole(index) {
    let roles = this.state.roles.slice();
    let removedRole = roles.splice(index, 1)[0];
    delete this.roles[removedRole.label];
  }

  updateRoles(oldLabel, newLabel, keywords) {
    if (newLabel !== oldLabel)
      delete this.roles[oldLabel];
    if (typeof keywords === 'string')
      keywords = keywords.split(',');
    this.roles[newLabel] = keywords;
  }

  applyChanges() {
    this.props.updateCallback(this.roles);
  }

  addCategory() {
    let roles = this.state.roles.slice();
    roles.push({
      label: "",
      keywords: [],
    });
    console.log(roles);
    this.setState({roles: roles});
  }

  render() {
    return (
      <div id="settings-container" className={"modal " + this.props.className}>
        <div className="close-button" onClick={this.props.hideModals}></div>
        {
          this.state.roles.map((role, index) => {
            return (
              <CategoryRow
                label={role.label}
                keywords={role.keywords}
                killCallback={() => {this.removeRole(index)}}
                updateCallback={this.updateRoles}
                key={index}
                />
            );
          })
        }
        <div className="form-controls">
          <button className="button" onClick={this.addCategory}>Add Category</button>
          <button className="button" onClick={this.applyChanges}>Apply Changes</button>
        </div>
      </div>
    );
  }
}

Settings.propTypes = {
  roles: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
  hideModals: PropTypes.func.isRequired,
  updateCallback: PropTypes.func.isRequired,
};

export default Settings;