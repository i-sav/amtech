import { Store } from "pullstate";

const CurrentApplicationsStore = new Store({
    currentApplications: []
});


//fetch
export const AllApplications = async (userId) => {
    const fecthApplications = await fetch(
        `https://amtech-app-ya67p.ondigitalocean.app/api/users/all-applications/${userId}`
    );
    const applicationsFound = await fecthApplications.json();
    //
    //console.log(applicationsFound);

    CurrentApplicationsStore.update(s => {
        s.currentApplications = applicationsFound;
    });
};



export default CurrentApplicationsStore;
