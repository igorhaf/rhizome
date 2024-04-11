// redux/reducers/textReducer.js
const initialState = {
    text: '',
    liveText: '' // Adicione um novo estado para o texto ao vivo
};

function textReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_TEXT':
            return {
                ...state,
                text: action.payload
            };
        case 'SET_LIVE_TEXT': // Manipula a atualização do texto em tempo real
            return {
                ...state,
                liveText: action.payload
            };
        default:
            return state;
    }
}


export default textReducer;