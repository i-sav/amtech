import { Store } from "pullstate";

const OurClientsStore = new Store({
    clients: []
});


//fetch clients to the app
export const getClients = async (userId) => {
    const fecthclients = await fetch(
        `https://octopus-app-5uj8p.ondigitalocean.app/api/users/get-clients/${userId}`
    );
    const clientsfound = await fecthclients.json();
    //
    //console.log(clientsfound);

    OurClientsStore.update(s => {
        s.clients = clientsfound;
    });
};



export default OurClientsStore;
