// redux/reducers/index.js

import { combineReducers } from 'redux';
import textReducer from './textReducer';
import fragmentReducer from './fragmentReducer';
import formReducer from './formReducer';

const rootReducer = combineReducers({
    text: textReducer,
    fragments: fragmentReducer, // Adicione o reducer de componentes
    forms: formReducer

});

export default rootReducer;