import React, { Component } from 'react';

export default class UserMicroscriptionListDisplay extends React.Component {

    constructor(props) {
        super(props);
        this.state = { userId: this.props.userId, userMicroscriptionList: this.props.userMicroscriptionList };
      }

    render() {

        return(
        <div className="userMicroscriptionList">
            {this.state.userMicroscriptionList.map((microscription, index) => (
              <p key={index}>{microscription.microscriptionName}   ${microscription.microscriptionCost}</p>
            ))}

          </div>)
    }
}