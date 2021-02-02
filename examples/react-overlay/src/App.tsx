import React from 'react';
import { bridge } from './dappletBridge';

interface Props {

}

interface State {
  data: string | null;
}

export default class App extends React.Component<Props, State> {

  state = {
    data: null
  };

  componentDidMount() {
    bridge.onData((data) => this.setState({ data }));
  }

  render() {
    return <div>Message from a dapplet: {this.state.data}</div>
  }
}
