class IssueFilter extends React.Component{
    render(){
       return(
        <p>This is a placeholder for an issue filter</p>
       )
    }
}

const initialssues = [
    {
        id: 1, status: 'New', owner: 'Ravan', effort: 5,
        created: new Date('2018-08-15'), due: undefined,
        title: 'Error in console when clicking Add',
    },
    {
        id: 2, status: 'Assigned', owner: 'Eddie', effort: 14,
        created: new Date('2018-08-16'), due: new Date('2018-08-30'),
        title: 'Missing bottom border on panel',
    },
];

function IssueTable(props){
        const issueRows = props.issues.map(issue => <IssueRow issue={issue}/>)

        return(
            <table className="bordered-table">
            <thead>
                <tr style={{borderCollapse: "collapse"}}>
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
        )
}

function IssueRow(props){
    const issue = props.issue;
        return(
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
        )
}

class IssueAdd extends React.Component{

    constructor(){
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = document.forms.issueAdd; 

        const issue = {
            owner: form.owner.value, 
            title: form.title.value, 
            status: 'New'
        }

        this.props.createIssue(issue);
        form.owner.value = ""; 
        form.title.value = ""; 
    }

    render(){
        return(
            <form name="issueAdd" onSubmit={this.handleSubmit}>
                <input type="text" name="owner" placeholder="Owner" /> 
                <input type="text" name="title" placeholder="Title" /> 
                <button>Add</button>
            </form>
        )
    }
}

class IssueList extends React.Component{

    constructor(){
        super();
        this.state = {issues: []}
        this.createIssue = this.createIssue.bind(this);
    }

    componentDidMount(){
        this.loadData();
    }

    createIssue(issue){
        issue.id = this.state.issues.length + 1;
        issue.created = new Date();
        
        const newIssueList = this.state.issues.slice();
        newIssueList.push(issue)
        this.setState({issues: newIssueList})
    }

    loadData(){
        setTimeout(() => {
            this.setState({issues: initialssues})
        }, 500)
    }

    render(){
        return(
            <React.Fragment>
                <h1>Issue Tracker</h1>
                <IssueFilter></IssueFilter>
                <IssueTable issues={this.state.issues}></IssueTable>
                <IssueAdd createIssue={this.createIssue}/>
            </React.Fragment>
        )
    }
}

const element = <IssueList />
ReactDOM.render(element, document.getElementById('contents'))