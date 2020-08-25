import React from 'react';

function IssueRow({ issue }) {
    return (
      <React.Fragment>
        <tr>
          <td>{issue.id}</td>
          <td>{issue.status}</td>
          <td>{issue.owner}</td>
          <td>{issue.created.toDateString()}</td>
          <td>{issue.effort}</td>
          <td>{issue.due ? issue.due.toDateString() : ''}</td>
          <td>{issue.title}</td>
        </tr>
      </React.Fragment>
    );
  }

export default function IssueTable({ issues }) {
    const issueRows = issues.map(issue => <IssueRow issue={issue} key={issue.id} />);
  
    return (
      <table className="bordered-table">
        <thead>
          <tr style={{ borderCollapse: 'collapse' }}>
            <th>ID</th>
            <th>Status</th>
            <th>Owner</th>
            <th>Created</th>
            <th>Effort</th>
            <th>Due Date</th>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          {issueRows}
        </tbody>
      </table>
    );
  }
  