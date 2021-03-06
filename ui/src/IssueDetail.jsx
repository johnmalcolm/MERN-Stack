import React from "react";
import graphQLFetch from "./graphQLFetch.js";

export default class IssueDetail extends React.Component {
  constructor() {
    super();
    this.state = { issue: {} };
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId }}} = prevProps;
    const { match: { params: { id }}} = this.props;
    if (prevId !== id) {
      this.loadData();
    }
  }

  async loadData() {
    const { match: { params: { id } } } = this.props;
    const parsedId = parseInt(id);

    const query = `query issue($id: Int!) {
                issue(id: $id){
                  id description 
                }
              }`;
              
    const data = await graphQLFetch(query, { id: parsedId });
    if (data) {
      this.setState({ issue: data.issue });
    } else {
      this.setState({ issue: {} });
    }
  }

  render(){
    const { issue: { description }} = this.state;

    return(
        <div>
            <h3>Description</h3>
            <p>{description}</p>
        </div>
    )
  }
}
