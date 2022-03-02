import React from 'react';
import { Bridge } from './Bridge';
import { BehaviorSubjectProxy } from 'rxjs-proxify';

export interface IDappStateProps <T> {
    commonState: { [name: string]: T }
    id?: string
    defaultState?: T
    changeState?: (newStateData:  Partial<T>, id?: string) => Promise<void>
}

function dappletState<T>(WrappedComponent: any) {
    return class extends React.Component<any, { loading: boolean, commonState: { [contextId: string]: BehaviorSubjectProxy<T> }, id?: string, defaultState?: T }> {
      bridge = new Bridge<{ changeState: (newStateData: T, id?: string) => Promise<void> }>();
  
      constructor(props: any) {
        super(props);
        this.state = {
          commonState: {},
          loading: true,
        }
      }
  
      componentDidMount() {
        this.bridge.on('onOpen', (id: string) => this.setState({ id, loading: false }));
        this.bridge.on('getDefaultState', (defaultState: T ) => this.setState({ defaultState, loading: false }));
        this.bridge.on('changeState', (newState: { [contextId: string]: BehaviorSubjectProxy<T> }) => {
          this.setState({ commonState: { ...this.state.commonState, ...newState  }, loading: false });
        });
      }
  
      componentWillUnmount() {
          this.bridge.off('onOpen');
          this.bridge.off('getDefaultState');
          this.bridge.off('changeState');
      }
  
      changeState = (newStateData: T, id?: string ) => this.bridge.changeState(newStateData, id);
  
      render() {
        return this.state.loading ? <></>
          :<WrappedComponent commonState={this.state.commonState} id={this.state.id} defaultState={this.state.defaultState} changeState={this.changeState} {...this.props} />;
      }
    }
  }

export default dappletState;