import { Store } from "pullstate";

const ApplicationHistoryStore = new Store({
    applicationHistory: []
});


//fetch
export const ApplicationHistory = async (userId) => {
    const fecthApplications = await fetch(
        `https://amtech-app-ya67p.ondigitalocean.app/api/users/user-applications/${userId}`
    );
    const applicationsFound = await fecthApplications.json();
    //
    //console.log(applicationsFound);

    ApplicationHistoryStore.update(s => {
        s.applicationHistory = applicationsFound;
    });
};



export default ApplicationHistoryStore;
