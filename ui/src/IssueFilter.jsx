import React from 'react';
/* eslint "react/prefer-stateless-function": "off" */

export default class IssueFilter extends React.Component {
    render() {
      return (
        <div>
            <a href="/#/issues">All Issues</a>
            {' | '}
            <a href="/#/issues?status=New">New Issues</a>
            {' | '}
            <a href="/#/issues?status=Assigned">Assigned Issues</a>
        </div>
      );
    }
  }