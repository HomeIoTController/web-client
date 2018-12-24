import React, { Component } from 'react'
import { withApollo, Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const PID_MUTATION = gql`
  mutation updatePIDMutation($kp: Float!, $ki: Float!, $kd: Float!, $k: Float!, $setpoint: Float!, $timeInterval: Int!, $active: Boolean!) {
    user {
      updatePID(kp: $kp, ki: $ki, kd: $kd, k: $k, setpoint: $setpoint, timeInterval: $timeInterval, active: $active) {
    		kp ki kd
    	}
    }
  }
`

const USER_QUERY = gql`
  query {
    user {
      pid {
        kp
        ki
        kd
        k
        setpoint
        timeInterval
        active
      }
    }
  }
`

class PID extends Component {
  state = {
    kp: 0,
    ki: 0,
    kd: 0,
    k: 0,
    setpoint: 0,
    timeInterval: 0,
    active: false,
    loading: false,
    error: null
  }

  fetchPID() {
    this.setState({ loading: true });

    this.props.client.query({
      query: USER_QUERY,
      fetchPolicy: 'no-cache',
    }).then(({ data: { user: { pid } } }) => {
      this.setState({
        loading: false,
        k: pid.k,
        kd: pid.kd,
        ki: pid.ki,
        kp: pid.kp,
        setpoint: pid.setpoint,
        timeInterval: pid.timeInterval,
        active: pid.active
      });
    }).catch(() => {
      this.setState({
        loading: false,
        error: "Failed to load pid parameters!"
      });
    })
  }

  componentWillMount() {
    this.fetchPID();
  }

  render() {
    const { kp, ki, kd, k, setpoint, timeInterval, active, loading, error } = this.state

    if (loading) return <div>Fetching...</div>
    if (error) return <div>Error: {error}</div>

    let pidParameters = <span/>;

    if (active) {
      pidParameters = (<div>
                Kp: <input
                  className="mb2"
                  value={kp}
                  onChange={e => this.setState({ kp: e.target.value })}
                  type="number"
                  placeholder="Kp"
                />
                <br />
                Ki: <input
                  className="mb2"
                  value={ki}
                  onChange={e => this.setState({ ki: e.target.value })}
                  type="number"
                  placeholder="Ki"
                />
                <br />
                Kd: <input
                  className="mb2"
                  value={kd}
                  onChange={e => this.setState({ kd: e.target.value })}
                  type="number"
                  placeholder="Kd"
                />
                <br />
                K: <input
                  className="mb2"
                  value={k}
                  onChange={e => this.setState({ k: e.target.value })}
                  type="number"
                  placeholder="K"
                />
                <br />
                Setpoint: <input
                  className="mb2"
                  value={setpoint}
                  onChange={e => this.setState({ setpoint: e.target.value })}
                  type="number"
                  placeholder="Setpoint"
                />
                <br />
                Time Interval (T in seconds): <input
                  className="mb2"
                  value={timeInterval}
                  onChange={e => this.setState({ timeInterval: e.target.value })}
                  type="number"
                  placeholder="Time Interval"
                />
              </div>);
    }

    return (<div>
              {pidParameters}
              Active: <input type="checkbox"
                    checked={this.state.active}
                    onChange={e => this.setState({ active: e.target.checked })} />

              <hr />

              <Mutation
                mutation={PID_MUTATION}
                variables={{ kp: Number(kp), ki: Number(ki), kd: Number(kd), k: Number(k), setpoint: Number(setpoint), timeInterval, active }}
                onCompleted={() => this.props.history.push('/pid')}
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

export default withApollo(PID)
