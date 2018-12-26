import React, { Component } from 'react'
import { withApollo, Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const COMMANDS_MUTATION = gql`
  mutation updateCommandsMutation($froms: [String]!, $tos: [String]!, $types: [String]!, $valuesFrom: [String]!, $valuesTo: [String]!, $listenerCommand: String!, $philipsHueIp: String!, $philipsHuePort: String!, $philipsHueUsername: String!) {
    user {
      updateCommands(froms: $froms, tos: $tos, types: $types, valuesFrom: $valuesFrom, valuesTo: $valuesTo, listenerCommand: $listenerCommand, philipsHueIp: $philipsHueIp, philipsHuePort: $philipsHuePort, philipsHueUsername: $philipsHueUsername) {
    		userId
    		from
    		to
    	}
    }
  }
`

const USER_QUERY = gql`
  query {
    user {
      listenerCommand
      states
      philipsHueConfig {
        ip
        username
        port
      }
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
    listenerCommand: "",
    states: [],
    philipsHueIp: "",
    philipsHueUsername: "",
    philipsHuePort: "",
    loading: false,
    error: null
  }

  addCommand() {
    const {froms, tos, types, valuesFrom, valuesTo } = this.state;
    froms.push('')
    tos.push('')
    types.push('voiceCommand')
    valuesFrom.push('')
    valuesTo.push('')
    this.setState({ froms, tos, types, valuesFrom, valuesTo });
  }

  fetchCommands() {
    const { froms, tos, types, valuesFrom, valuesTo } = this.state

    this.setState({loading: true});

    this.props.client.query({
      query: USER_QUERY,
      fetchPolicy: 'no-cache',
    }).then(({ data: { user } }) => {

      const dataCommands = user.commands;
      const states = user.states;
      let { ip: philipsHueIp, port: philipsHuePort, username: philipsHueUsername } =
        user.philipsHueConfig;

      philipsHueIp = philipsHueIp ? philipsHueIp : "";
      philipsHuePort = philipsHuePort ? philipsHuePort : "";
      philipsHueUsername = philipsHueUsername ? philipsHueUsername : "";

      const { listenerCommand } = user;

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
        valuesTo,
        listenerCommand,
        states,
        philipsHueIp,
        philipsHuePort,
        philipsHueUsername
      });
    }).catch(() => {
      this.setState({
        loading: false,
        error: "Failed to load commands!"
      });
    })
  }

  componentWillMount() {
    this.fetchCommands();
  }

  renderCommandSection({
    i,
    from,
    froms,
    type,
    valueFrom,
    valuesFrom,
    valueTo,
    valuesTo,
    states
  }) {
    if (type === "voiceCommand" || type === "guiCommand") {
      return (
        <div>
        Command: <input
          className="mb2"
          value={from}
          onChange={e => {
            froms[i] = e.target.value
            this.setState({ froms })
          }}
          type="text"
          placeholder="Command"
        />
        </div>
      );
    } else if (type === "bciCommand") {
      return (
        <div>
          Command:
          <select value={from} onChange={e => {
            froms[i] = e.target.value
            this.setState({ froms })
          }}>
            <option value="attention">Attention</option>
            <option value="meditation">Meditation</option>
            <option value="blinking">Blinking</option>
            <option disabled="disabled">----</option>
            {states.map(state => <option value={state}>{state}</option>)}
          </select>
          {(from === "attention" ||
            from === "meditation" ||
            from === "blinking") ?
            <span>
              From: <input
                className="mb2"
                min="1"
                max="100"
                style={{width: "60px"}}
                value={valueFrom}
                onChange={e => {
                  valuesFrom[i] = e.target.value
                  this.setState({ valuesFrom })
                }}
                type="number"
                placeholder="From"
              />
              To: <input
                className="mb2"
                min="1"
                max="100"
                style={{width: "60px"}}
                value={valueTo}
                onChange={e => {
                  valuesTo[i] = e.target.value
                  this.setState({ valuesTo })
                }}
                type="number"
                placeholder="To"
              />
            </span> : <span/>}
        </div>
      );
    } else {
      return <span/>;
    }

  }

  render() {
    const { froms, tos, types, valuesFrom, valuesTo,
            listenerCommand, states, philipsHueIp, philipsHuePort, philipsHueUsername,
            loading, error } = this.state

    if (loading) return <div>Fetching...</div>
    if (error) return <div>Error: {error}</div>

    return (<div>
            <b>Base configuration</b>
            <br /><br />
            Call command: <input
              className="mb2"
              value={listenerCommand}
              onChange={e => this.setState({ listenerCommand: e.target.value })}
              type="text"
              placeholder="Call command"
            />
            <br />
            Philips HUE IP (ex: <b>192.168.1.38</b>): <input
              className="mb2"
              value={philipsHueIp}
              onChange={e => this.setState({ philipsHueIp: e.target.value })}
              type="text"
              placeholder="Philips HUE IP"
            />
            <br />
            Philips HUE Port: <input
              className="mb2"
              value={philipsHuePort}
              onChange={e => this.setState({ philipsHuePort: e.target.value })}
              type="text"
              placeholder="Philips HUE Port"
            />
            <br />
            Philips HUE Username: <input
              className="mb2"
              value={philipsHueUsername}
              onChange={e => this.setState({ philipsHueUsername: e.target.value })}
              type="text"
              placeholder="Philips HUE Username"
            />
            <br />
            <hr />
            <b>Commands</b>
            <br />
            {froms.map((from, i) => {
            const to = tos[i];
            const type = types[i];
            const valueFrom = valuesFrom[i];
            const valueTo = valuesTo[i];

            return (<span key={i}><div className="flex flex-column mt3">
              Command type:
              <select value={type} onChange={e => {
                types[i] = e.target.value
                if (types[i] === "voiceCommand" || types[i] === "guiCommand") {
                  froms[i] = "";
                } else if (types[i] === "bciCommand") {
                  froms[i] = "attention";
                  valuesFrom[i] = "";
                  valuesTo[i] = "";
                }
                this.setState({ types, froms, valuesFrom, valuesTo })
              }}>
                <option value="voiceCommand">Voice command</option>
                <option value="bciCommand">BCI command</option>
                <option value="guiCommand">GUI command</option>
              </select>

              {this.renderCommandSection({
                i,
                from,
                froms,
                type,
                valueFrom,
                valuesFrom,
                valueTo,
                valuesTo,
                states
              })}
              <a href="https://github.com/sqmk/huejay#clientgroupsgetall---get-all-groups"
                target="_blank" // eslint-disable-line react/jsx-no-target-blank
              >
                Philips HUE command:
              </a><input
                className="mb2"
                value={to}
                onChange={e => {
                  tos[i] = e.target.value
                  this.setState({ tos })
                }}
                type="text"
                placeholder="Philips HUE command"
              />
              <div>Example: <pre style={{display:"inline"}}>light.on = true; light.incrementBrightness = 200;</pre></div>
              <button onClick={e => {
                tos.splice(i, 1);
                froms.splice(i, 1);
                types.splice(i, 1);
                valuesFrom.splice(i, 1);
                valuesTo.splice(i, 1);
                this.setState({ tos, froms, types, valuesFrom, valuesTo })
              }}>Remove</button>
            </div>
            <hr/>
            </span>);
            })}

            <button onClick={this.addCommand.bind(this)}>Add Command</button>

            <Mutation
              mutation={COMMANDS_MUTATION}
              variables={{ froms, tos, types, valuesFrom, valuesTo,
                 listenerCommand, philipsHueIp, philipsHuePort, philipsHueUsername }}
              onCompleted={() => this.props.history.push('/sendCommand')}
            >
              {mutation => <button onClick={() => {
                alert("Please click your sync Philips HUE bridge button continuously!");
                mutation();
              }}>Save</button>}
            </Mutation>
          </div>
      );
  }
}

export default withApollo(Command)
