import { Store } from "pullstate";

//
const CurrentUserDetailsStore = new Store({
    currentUserDetails: []
});

//reload function
function runReload() {
    console.log("---- Relaoding after logging out user");
    window.history.replaceState({}, "Log In", "/login");
    document.location.reload();
}

export const fetchCurrentUserDetails = async (id) => {
    //userId
    const user = id;
    //Initiate details request
    const UsrInfo = await fetch(`https://octopus-app-5uj8p.ondigitalocean.app/api/users/${user}`);

    const UsrData = await UsrInfo.json();

    console.log(Object.keys(UsrData).length);
    if (Object.keys(UsrData).length === 0) {
        console.log("--- User Not found, object is empty ---");
        localStorage.removeItem("AM-Tkn");
        setTimeout(runReload, 2000);
        return;
    }

    CurrentUserDetailsStore.update(s => {
        s.currentUserDetails = UsrData;
    })
};

export default CurrentUserDetailsStore;

