import { ADD_FORM, REMOVE_FORM } from '../actions/actionTypes';

const initialState = {
    activeForms: [] // Esta lista conterá os nomes dos formulários atualmente carregados
};

function formReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_FORM:
            return {
                ...state,
                activeForms: [action.payload] // Mantém apenas o último formulário adicionado
            };
        case REMOVE_FORM:
            return {
                ...state,
                activeForms: state.activeForms.filter(formName => formName !== action.payload)
            };
        default:
            return state;
    }
}

export default formReducer;
