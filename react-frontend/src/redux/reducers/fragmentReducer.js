// redux/reducers/componentReducer.js

import { ADD_FRAGMENT, REMOVE_FRAGMENT } from '../actions/fragmentActions';

const initialState = {
    activeFragments: [] // Esta lista conterá os nomes dos componentes atualmente carregados
};

function fragmentReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_FRAGMENT:
            return {
                ...state,
                activeFragments: [action.payload] // Substitui a lista existente pelo novo componente exclusivamente
            };
        case REMOVE_FRAGMENT:
            return {
                ...state,
                activeFragments: state.activeFragments.filter(
                    fragmentName => fragmentName !== action.payload
                )
            };
        default:
            console.log(action);
            return state;
    }
    
}

export default fragmentReducer;
