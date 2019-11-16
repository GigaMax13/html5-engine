import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';

const devTools = '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__';
// eslint-disable-next-line no-undef,no-underscore-dangle
const devToolsCompose = window && window[devTools] ? window[devTools] : null;

const composeEnhancers = devToolsCompose ? devToolsCompose({
  // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
}) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk),
  // other store enhancers if any
);

const store = createStore(reducers, enhancer);

store.subscribe(() => {
  console.clear();
  console.log(store.getState());
});

export default store;
