import { SET_CURRENT_COMPONENT, TOGGLE_NODE, ADD_FRAME} from './actions';

const initialState = {
    currentComponent: 'treeView',
    treeData: [] // Supondo que você tenha uma estrutura de dados inicial aqui
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_FRAME:
            const newFrame = {
                id: state.treeData.length + 1,
                name: action.payload,
                expanded: false,
                children: []
            };
            return {
                ...state,
                treeData: [...state.treeData, newFrame]
            };
        case SET_CURRENT_COMPONENT:
            return {
                ...state,
                currentComponent: action.payload,
            };
        case TOGGLE_NODE:
            const toggleNode = (node) => {
                if (node.id === action.payload) {
                    return { ...node, expanded: !node.expanded };
                } else if (node.children) {
                    return { ...node, children: node.children.map(toggleNode) };
                } else {
                    return node;
                }
            };
            return {
                ...state,
                treeData: state.treeData.map(toggleNode),
            };
        default:
            return state;
    }
};

export default appReducer;