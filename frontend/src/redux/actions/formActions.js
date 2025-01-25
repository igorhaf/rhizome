import { ADD_FORM, REMOVE_FORM } from './actionTypes';

export const addForm = formName => ({
    type: ADD_FORM,
    payload: formName
});

export const removeForm = formName => ({
    type: REMOVE_FORM,
    payload: formName
});