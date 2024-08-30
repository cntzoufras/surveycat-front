import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import {
  themeReducer,
  rtlReducer,
  customizerReducer,
  newOrderTableReducer,
  sidebarReducer,
  authReducer,
  roundBordersReducer,
  blocksShadowsReducer,
  pokemonReducer,
} from '@/redux/reducers/index';
import appConfigReducer from '@/redux/reducers/appConfigReducer';
import surveyReducer from '@/redux/reducers/surveyReducer';
import covidReducer from '../Maps/VectorMapWithRequestData/redux/covidReducer';
import todoReducer from '../Todo/redux/reducer';

const authFromSession = JSON.parse(localStorage.getItem('auth')) || { loggedIn: false, user: null };

const initialAuthState = {
  error: null,
  loggedIn: authFromSession.loggedIn,
  user: authFromSession.user,
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducer = combineReducers({
  theme: themeReducer,
  rtl: rtlReducer,
  border: roundBordersReducer,
  shadow: blocksShadowsReducer,
  appConfig: appConfigReducer,
  customizer: customizerReducer,
  newOrder: newOrderTableReducer,
  sidebar: sidebarReducer,
  auth: (state = initialAuthState, action) => authReducer(state, action),
  covid: covidReducer,
  todo: todoReducer,
  pokemon: pokemonReducer,
  survey: surveyReducer,
});
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));


export default store;
