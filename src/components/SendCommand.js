import React, { Component } from 'react'
import { withApollo, Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const COMMANDS_MUTATION = gql`
  mutation sendCommandsMutation($fromCommand: String!, $type: String!, $valueFrom: String, $valueTo: String) {
    user {
      sendCommand(fromCommand: $fromCommand, type: $type, valueFrom: $valueFrom, valueTo: $valueTo)
    }
  }
`

const COMMANDS_QUERY = gql`
  query {
    user {
      commands {
        userId
        from
        to
        valueTo
        valueFrom
        type
      }
    }
  }
`

class Command extends Component {
  state = {
    froms: [],
    tos: [],
    types: [],
    valuesFrom: [],
    valuesTo: [],
    loading: false,
    error: null
  }

  fetchCommands() {
    const { froms, tos, types, valuesFrom, valuesTo } = this.state

    this.setState({loading: true});

    this.props.client.query({
      query: COMMANDS_QUERY,
      fetchPolicy: 'no-cache'
    }).then(({ data: {user} }) => {

      const dataCommands = user.commands;
      dataCommands.forEach(command => {
        froms.push(command.from);
        tos.push(command.to);
        types.push(command.type);
        valuesFrom.push(command.valueFrom);
        valuesTo.push(command.valueTo);
      });
      this.setState({
        loading: false,
        froms,
        tos,
        types,
        valuesFrom,
        valuesTo
      });
    }).catch(() => {
      this.setState({error: "Failed to load commands!"});
    })
  }

  componentWillMount() {
    this.fetchCommands();
  }

  render() {
    const { froms, tos, types, valuesFrom, valuesTo, loading, error } = this.state

    if (loading) return <div>Fetching</div>
    if (error) return <div>Error</div>
    if (froms.length === 0) return <div>Commands not registered!</div>

    return (<div>
            {froms.map((from, i) => {
              const to = tos[i];
              const type = types[i];
              const valueFrom = valuesFrom[i];
              const valueTo = valuesTo[i];

              return (
                <span key={i}>
                  <div className="flex flex-column mt3">
                  <div><b>Command type</b>: {type}</div>
                  <div><b>Command</b>: {from}</div>
                  {type === 'bciCommand' ?
                  <span>
                    <div><b>From</b>: {valueFrom}</div>
                    <div><b>To</b>: {valueTo}</div>
                  </span>
                  :
                  <span/>}
                  <div><b>PhilipsHUE Command</b>: {to}</div>

                  <Mutation
                    mutation={COMMANDS_MUTATION}
                    variables={{ fromCommand: from, type, valueFrom, valueTo }}
                    onCompleted={() => this.props.history.push('/sendCommand')}
                  >
                    {mutation => <button onClick={() => {
                      alert("Command sent!");
                      mutation();
                    }}>Send Command</button>}
                  </Mutation>
                  </div>
                  <hr/>
                </span>
              );
            })}
          </div>
      );
  }
}

export default withApollo(Command)
