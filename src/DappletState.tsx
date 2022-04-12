import React from 'react';
import { Bridge } from './Bridge';
import { BehaviorSubjectProxy } from 'rxjs-proxify';

export interface IDappStateProps <T> {
    sharedState: { [name: string]: T }
    id?: string
    defaultState?: T
    changeSharedState?: (newStateData:  Partial<T>, id?: string) => Promise<void>
}

function dappletState<T>(WrappedComponent: any) {
    return class extends React.Component<any, { loading: boolean, sharedState: { [contextId: string]: BehaviorSubjectProxy<T> }, id?: string, defaultState?: T }> {
      bridge = new Bridge<{ changeSharedState: (newStateData: T, id?: string) => Promise<void> }>();
  
      constructor(props: any) {
        super(props);
        this.state = {
          sharedState: {},
          loading: true,
        }
      }
  
      componentDidMount() {
        this.bridge.on('onOpen', (id: string) => this.setState({ id, loading: false }));
        this.bridge.on('getDefaultState', (defaultState: T ) => this.setState({ defaultState, loading: false }));
        this.bridge.on('changeSharedState', (newState: { [contextId: string]: BehaviorSubjectProxy<T> }) => {
          this.setState({ sharedState: { ...this.state.sharedState, ...newState  }, loading: false });
        });
      }
  
      componentWillUnmount() {
          this.bridge.off('onOpen');
          this.bridge.off('getDefaultState');
          this.bridge.off('changeSharedState');
      }
  
      changeSharedState = (newStateData: T, id?: string ) => this.bridge.changeSharedState(newStateData, id);
  
      render() {
        return this.state.loading ? <></>
          :<WrappedComponent sharedState={this.state.sharedState} id={this.state.id} defaultState={this.state.defaultState} changeSharedState={this.changeSharedState} {...this.props} />;
      }
    }
  }

export default dappletState;