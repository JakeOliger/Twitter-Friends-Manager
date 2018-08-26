import React, { Component } from 'react';
import './style.css';

class ScrollToTop extends Component {
    constructor(props) {
      super(props);
      this.state = {isVisible: false};
      this.updateVisibility = this.updateVisibility.bind(this);
      this.scrollToTop = this.scrollToTop.bind(this);
    }
  
    componentDidMount() {
      window.addEventListener('scroll', this.updateVisibility);
    }
  
    render() {
      var className = this.state.isVisible ? "visible" : "invisible";
      return (
        <div id="scrollToTop" className={className} onClick={this.scrollToTop}></div>
      );
    }
  
    scrollToTop() {
      if (this.state.isVisible) window.scrollTo(0, 0);
    }
  
    updateVisibility() {
      var doc = document.documentElement;
      var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
      let newVisibility = top > 200;
      if (newVisibility !== this.state.isVisible)
        this.setState({isVisible: newVisibility});
    }
  }

export default ScrollToTop;