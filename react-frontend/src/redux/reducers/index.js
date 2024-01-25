// redux/reducers/index.js
import { combineReducers } from 'redux';
import textReducer from './textReducer';

const rootReducer = combineReducers({
    text: textReducer
});

export default rootReducer;