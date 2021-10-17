import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { combineReducers, compose, createStore } from 'redux';
import { players, roomLink, page, user, messageList, game, round, currentAnswer, skipTime, invalidRoom} from './store/Reducer/reducers';
import { Provider } from 'react-redux';
import { inProduction } from './env';


// declare global {
//   interface Window {
//     __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
//   }
// }

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const allReducers = combineReducers({page:page, roomLink:roomLink, user:user, players:players, messageList: messageList, game: game, round: round, currentAnswer: currentAnswer, skipTime: skipTime, invalidRoom:invalidRoom});
// let store = createStore(allReducers,composeEnhancers());
let store = createStore(allReducers);


if(!inProduction) store.subscribe(()=>{console.log(store.getState())});

ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
  document.getElementById('root')
);

