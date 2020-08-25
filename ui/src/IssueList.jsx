/* eslint "react/jsx-no-undef": "off" */
import React from 'react';

import IssueFilter from './IssueFilter.jsx';
import IssueTable from './IssueTable.jsx';
import IssueAdd from './IssueAdd.jsx';
import graphQLFetch from './graphQLFetch.js';


export default class IssueList extends React.Component {
    constructor() {
      super();
      this.state = { issues: [] };
      this.createIssue = this.createIssue.bind(this);
    }
  
    componentDidMount() {
      this.loadData();
    }
  
    async createIssue(issue) {
      const query = `mutation issueAdd($issue: IssueInputs!){
              issueAdd(issue: $issue){
                  id
              }
          }`;
  
      const data = await graphQLFetch(query, { issue });
      if (data) {
        this.loadData();
      }
    }
  
    async loadData() {
      const query = `query { issueList {
              id title status owner
              created effort due
            }}`;
      const data = await graphQLFetch(query);
      if (data) {
        this.setState({ issues: data.issueList });
      }
    }
  
    render() {
      const { issues } = this.state;
      return (
        <React.Fragment>
          <h1>Issue Tracker</h1>
          <IssueFilter />
          <IssueTable issues={issues} />
          <IssueAdd createIssue={this.createIssue} />
        </React.Fragment>
      );
    }
  }