import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { combineReducers, compose, createStore } from 'redux';
import { players, roomLink, page, user, messageList, game, round, currentAnswer, skipTime} from './store/Reducer/reducers';
import { Provider } from 'react-redux';


declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const allReducers = combineReducers({page:page, roomLink:roomLink, user:user, players:players, messageList: messageList, game: game, round: round, currentAnswer: currentAnswer, skipTime: skipTime});
let store = createStore(allReducers,composeEnhancers());
store.subscribe(()=>{console.log(store.getState())});

ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
