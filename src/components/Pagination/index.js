import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.css';

class Pagination extends Component {
  constructor(props) {
    super(props);

    this.updateCallback = props.updateCallback;
    this.prevPage = this.prevPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
  }

  prevPage() {
    let newIndex = this.props.index - this.props.cols * this.props.rows;
    if (newIndex < 0) newIndex = 0;
    this.updateCallback(newIndex);
  }
  
  nextPage() {
    let newIndex = this.props.index + this.props.cols * this.props.rows;
    if (newIndex > this.props.totalItems) return;
    this.updateCallback(newIndex);
  }

  render() {
    let itemsPerPage = this.props.rows * this.props.cols;
    let currentPage = this.props.index / itemsPerPage + 1;
    let totalPages = Math.ceil(this.props.totalItems / itemsPerPage);

    let className = "pagination";
    if (this.props.block)
      className += " block";

    return (
      <div className={className}>
        <button className="button" onClick={this.prevPage}>Prev</button>
        {currentPage} / {totalPages}
        <button className="button" onClick={this.nextPage}>Next</button>
      </div>
    );
  }
}

Pagination.propTypes = {
  rows: PropTypes.number.isRequired,
  cols: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  updateCallback: PropTypes.func.isRequired,
  index: PropTypes.number
};

export default Pagination;