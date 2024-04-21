// redux/reducers/index.js

import { combineReducers } from 'redux';
import textReducer from './textReducer';
import fragmentReducer from './fragmentReducer';
import formReducer from './formReducer';
import graphReducer from './graphReducer';

const rootReducer = combineReducers({
    text: textReducer,
    fragments: fragmentReducer, // Adicione o reducer de componentes
    graphs: graphReducer,
    forms: formReducer

});

export default rootReducer;