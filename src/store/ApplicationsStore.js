import { Store } from "pullstate";

const MyApplicationsStore = new Store({
    applications: []
});


//fetch documents for user.
export const getApplications = async (userId) => {
    const fecthApplications = await fetch(
        `https://amtech-app-qas7x.ondigitalocean.app/api/users/applications/${userId}`
    );
    const applicationsFound = await fecthApplications.json();
    //
    //console.log(applicationsFound);

    MyApplicationsStore.update(s => {
        s.applications = applicationsFound;
    });
};



export default MyApplicationsStore;
