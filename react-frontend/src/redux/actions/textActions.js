// redux/actions/textActions.js
export const setText = text => ({
    type: 'SET_TEXT',
    payload: text
});

// Nova action para atualizar o texto em tempo real
export const setLiveText = text => ({
    type: 'SET_LIVE_TEXT',
    payload: text
});