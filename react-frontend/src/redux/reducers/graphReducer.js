import { ADD_GRAPH, REMOVE_GRAPH } from '../actions/graphActions';

const initialState = {
    activeGraphs: [] // Esta lista conterá os nomes dos componentes atualmente carregados
};

function graphReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_GRAPH:
            return {
                ...state,
                activeGraphs: [action.payload] // Substitui a lista existente pelo novo componente exclusivamente
            };
        case REMOVE_GRAPH:
            return {
                ...state,
                activeGraphs: state.activeGraphs.filter(
                    graphName => graphName !== action.payload
                )
            };
        default:
            console.log(action);
            return state;
    }
    
}

export default graphReducer;




