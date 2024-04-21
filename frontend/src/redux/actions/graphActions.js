// redux/actions/FRAGMENTActions.js

// Tipos de ações
export const ADD_GRAPH = 'ADD_GRAPH';
export const REMOVE_GRAPH = 'REMOVE_GRAPH';

// Action creators
export const addGraph = graphName => ({
    type: ADD_GRAPH,
    payload: graphName
});



export const removeFragment = graphName => ({
    type: REMOVE_GRAPH,
    payload: graphName
});
