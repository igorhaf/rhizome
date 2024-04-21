import client from './backend';

// Funções para usuários
const getLastGraph = () => {
    return client.get('graphs/get-latest-diagram')
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
};

const sendGraphApi = (data) => {
    return client.post(`/graphs/graph-data`, data)
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
};
export { getLastGraph,  sendGraphApi };
