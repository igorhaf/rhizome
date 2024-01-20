export const SET_CURRENT_COMPONENT = 'SET_CURRENT_COMPONENT';

export const setCurrentComponent = (componentName) => ({
    type: SET_CURRENT_COMPONENT,
    payload: componentName,
});

// actions.js
export const TOGGLE_NODE = 'TOGGLE_NODE';

export const toggleNode = (nodeId) => ({
    type: TOGGLE_NODE,
    payload: nodeId,
});

export const ADD_FRAME = 'ADD_FRAME';

export const addFrame = (frameName) => ({
    type: ADD_FRAME,
    payload: frameName,
});

