import React, { Component } from 'react'
import { withApollo, Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const STATES_MUTATION = gql`
  mutation updateStatesMutation($states: [String]!) {
    user {
      updateStates(states: $states)
    }
  }
`

const USER_QUERY = gql`
  query {
    user {
      states
    }
  }
`

class State extends Component {
  state = {
    states: [],
    loading: false,
    error: null
  }

  addState() {
    const { states } = this.state;
    states.push('')
    this.setState({ states });
  }

  fetchStates() {
    this.setState({ loading: true });

    this.props.client.query({
      query: USER_QUERY,
      fetchPolicy: 'no-cache',
    }).then(({ data: { user } }) => {
      this.setState({
        loading: false,
        states: user.states
      });
    }).catch(() => {
      this.setState({
        loading: false,
        error: "Failed to load states!"
      });
    })
  }

  componentWillMount() {
    this.fetchStates();
  }

  render() {
    const { states, loading, error } = this.state

    if (loading) return <div>Fetching...</div>
    if (error) return <div>Error: {error}</div>

    return (<div>
            {states.map((state, i) => {
              return (
                <span key={i}>
                  <div className="flex flex-column mt3">
                    State:
                    <input
                      className="mb2"
                      value={state}
                      onChange={e => {
                        states[i] = e.target.value;
                        this.setState({ states })
                      }}
                      type="text"
                      placeholder="State"
                    />
                  </div>
                  <button onClick={e => {
                    states.splice(i, 1);
                    this.setState({ states })
                  }}>Remove</button>
                  <hr/>
                </span>);
            })}

            <button onClick={this.addState.bind(this)}>Add State</button>
            <Mutation
              mutation={STATES_MUTATION}
              variables={{ states }}
              onCompleted={() => this.props.history.push('/states')}
            >
              {mutation => <button onClick={() => {
                alert("Saved!");
                mutation();
              }}>Save</button>}
            </Mutation>
          </div>
    );
  }
}

export default withApollo(State)
