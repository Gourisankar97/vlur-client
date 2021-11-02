import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { combineReducers, compose, createStore } from 'redux';
import { players, roomLink, page, user, messageList, game, round, currentAnswer, skipTime, invalidRoom} from './store/Reducer/reducers';
import { Provider } from 'react-redux';
import { inProduction } from './env';
import Logo from './components/preface/logo/Logo';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { Blog } from './blog/Blog';
import { Article_1 } from './blog/Articles/Article_1_Image_Guessing_Quiz';
import "@patternfly/react-core/dist/styles/base.css";

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
  <Router>
    <Provider store={store}>
      <Logo></Logo>
      <Switch>
        
        
        <Route path="/blog/image_guessing_quiz_game">
          <Article_1/>
        </Route>

        <Route path="/blog">
          <Blog/>
        </Route>

        <Route path="/">
          <App/>
        </Route>

      </Switch>      
    </Provider>
  </Router>,
  document.getElementById('root')
);

