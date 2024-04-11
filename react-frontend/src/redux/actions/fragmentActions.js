// redux/actions/FRAGMENTActions.js

// Tipos de ações
export const ADD_FRAGMENT = 'ADD_FRAGMENT';
export const REMOVE_FRAGMENT = 'REMOVE_COMPONENT';

// Action creators
export const addFragment = fragmentName => ({
    type: ADD_FRAGMENT,
    payload: fragmentName
});



export const removeFragment = fragmentName => ({
    type: REMOVE_FRAGMENT,
    payload: fragmentName
});
