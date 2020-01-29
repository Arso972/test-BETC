import React, { Component } from 'react';
import './card.scss';
import Parser from 'html-react-parser';

class Card extends Component {
    
    render(){
        return (
          <div className="card">
              <img className="card__img"  src={ this.props.icon } alt={this.props.title}/>
              <h4 className="card__title">{ this.props.data } { this.props.unity}</h4>
              <p className="card__text">{ Parser(this.props.title) }</p>
          </div>
        );
    }
}

export default Card;
