import { Store } from "pullstate";

const UserApplicationsStore = new Store({
    applications: []
});


//fetch all user applications for user/completed and pending.
export const getUserApplications = async (userId) => {
    const fecthApplications = await fetch(
        `https://octopus-app-5uj8p.ondigitalocean.app/api/users/user-applications/${userId}`
    );
    const applicationsFound = await fecthApplications.json();
    //
    //console.log(applicationsFound);

    UserApplicationsStore.update(s => {
        s.applications = applicationsFound;
    });
};



export default UserApplicationsStore;
