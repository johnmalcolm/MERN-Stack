/* eslint "react/jsx-no-undef": "off" */
import React from 'react';
import URLSearchParams from 'url-search-params';
import { Route } from 'react-router-dom';

import IssueFilter from './IssueFilter.jsx';
import IssueTable from './IssueTable.jsx';
import IssueAdd from './IssueAdd.jsx';
import graphQLFetch from './graphQLFetch.js';
import IssueDetail from './IssueDetail.jsx';


export default class IssueList extends React.Component {
    constructor() {
      super();
      this.state = { issues: [] };
      this.createIssue = this.createIssue.bind(this);
    }
  
    componentDidMount() {
      this.loadData();
    }

    componentDidUpdate(prevProps) {
      const { location: { search: prevSearch } } = prevProps;
      const { location: { search } } = this.props;
      if ( prevSearch !== search){
        this.loadData();
      }
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
      const { location: { search } } = this.props;
      const params = new URLSearchParams(search);
      const vars = {};
      if (params.get('status')) vars.status = params.get('status');
      
      const query = `query issueList($status: StatusType) {
              issueList(status: $status){
                id title status owner
                created effort due
              }}`;
      const data = await graphQLFetch(query, vars);
      if (data) {
        this.setState({ issues: data.issueList });
      }
    }
  
    render() {
      const { issues } = this.state;
      const { match } = this.props;
      return (
        <React.Fragment>
          <h1>Issue Tracker</h1>
          <IssueFilter />
          <IssueTable issues={issues} />
          <IssueAdd createIssue={this.createIssue} />
          <hr />
          <Route path={`${match.path}/:id`} component={IssueDetail} />
        </React.Fragment>
      );
    }
  }