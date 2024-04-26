import { Store } from "pullstate";

const MyDocumentsStore = new Store({
    documents: []
});


//fetch documents for user.
export const getDocuments = async (userId) => {
    const fecthDocs = await fetch(
        `https://amtech-app-qas7x.ondigitalocean.app/api/users/documents/${userId}`
    );
    const documentsFound = await fecthDocs.json();
    //
    //console.log(documentsFound);

    MyDocumentsStore.update(s => {
        s.documents = documentsFound;
    });
};



export default MyDocumentsStore;
