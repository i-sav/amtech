import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import axios from "axios";
//camera
import supabase from "../supabase-client";
import { FilePicker } from '@capawesome/capacitor-file-picker';
//
import {
    IonContent,
    IonPage,
    IonHeader,
    IonButtons,
    IonBackButton,
    IonToolbar,
    IonListHeader,
    IonLabel,
    IonItem,
    IonButton,
    IonToast,
    IonTitle,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
} from "@ionic/react";
import { RouteComponentProps, useLocation } from "react-router";

import "@ionic/react/css/ionic-swiper.css";
import ButtonProgress from "../components/ButtonProgress";
import { arrowForwardOutline, checkmarkDoneCircleOutline, documentAttachOutline } from "ionicons/icons";
import MyApplicationsStore, { getApplications } from "../store/ApplicationsStore";
import { title } from "process";
import CurrentUserDetailsStore from "../store/CurrentUserDataStore";

export interface PageProps
    extends RouteComponentProps<{
        id: string;
    }> { }


const Apply: React.FC<PageProps> = ({ match }) => {
    //history
    const history = useHistory();
    //application
    // const userId = useContext(AuthContext);
    const [iserror, setIserror] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<string>("");

    //application States data
    const [isApplicationOpen, setIsApplicationOpen] = useState(false);
    const [progress, setProgress] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);
    //file states
    const [filePath, setFilePath] = useState<string>("");
    const [activeFile, setActiveFile] = useState<string>("");
    const [blobState, setBlobState] = useState<any>();
    const [types, setTypes] = useState<any>([]);

    //upload document to this profile
    const licenseId = match.params.id;
    //passed data
    const location = useLocation() as any;
    const licenseData = location.state?.state;
    //console.log(licenseData);

    //application processing ====
    const applications = MyApplicationsStore.useState<any>(s => s.applications);
    const thisApplication = applications.filter((currentApplication: any) => currentApplication?.licenseCategory === licenseData?.category);
    //console.log(thisApplication);
    //user details
    const currentUser = CurrentUserDetailsStore.useState<any>(s => s.currentUserDetails);
    const userId = currentUser?._id;
    //console.log(requirements);
    const documentsUploaded = thisApplication[0]?.documents;
    //end of required
    //loop through already upload files and add to types
    documentsUploaded?.forEach((document: any) => {
        const documentType = document.documentType;
        // console.log(documentType);
        types.push(documentType);

    });


    //const open dialog
    const openFileDialog = (active: any) => {
        (document as any).getElementById("file-upload").click();
        setActiveFile(`${active}`);
    }
    //set Image
    const setFile = (_event: any) => {
        let file = _event.target.files[0];
        //console.log(file);
        //const selectedFilePath = file?.path;
        const selectedFilePath = file?.name;
        setFilePath(selectedFilePath as string);
        setBlobState(file);
    }

    //upload document logic
    const handleDocumentUpload = async (filePath: any, blobState: any) => {

        //handle upload
        if (filePath == "") {
            setMessage("Please select the document to upload");
            setIserror(true);
            return;
        }
        //upload timestamp
        const currentTime = new Date().getTime();
        //path
        const filename = filePath.substr(filePath.lastIndexOf("/") + 1);

        setProgress(true);
        //console.log(blobState);
        const { data, error } = await supabase.storage
            .from("biva-storage")
            .upload(`docs/${currentTime + filename}`, blobState, {
                cacheControl: "3600",
                upsert: false,
            });

        if (error) {
            //setMessage(error?.message);
            setMessage("An error occured while uploading your document. Please try again!");
            setIserror(true);
            setProgress(false);
        } else {
            //console.log(data);
            //push file to uploaded types
            setTypes([...types, activeFile]);
            //process data
            const DocumentData = {
                documentUrl: data?.path,
                applicationBy: userId,
                category: licenseData?.category,
                amountPaid: licenseData?.amount,
                documentType: activeFile,

            };

            const api = axios.create({
                baseURL: `https://amtech-app-ya67p.ondigitalocean.app/api/users`,
            });
            api
                .post("/apply-license", DocumentData)
                .then((res) => {
                    getApplications(userId);
                    setMessage("Document has been uploaded. Upload other required documents and finish your application");
                    setIserror(true);
                    setProgress(false);
                    setFilePath("");
                    setActiveFile("");
                })
                .catch((error) => {
                    setMessage(error);
                    setIserror(true);
                });
        }
    };
    //submit and finish application
    const SubmitApplication = async () => {
        console.log(" --- Submitting Application˝ ----");

        if (thisApplication[0]?._id === null || thisApplication[0]?._id === undefined) {
            setMessage("Application not ready to be submitted. Check if you have submitted the documents above and try again!");
            setIserror(true);
        } else {
            const applicationData = {
                applicationId: thisApplication[0]?._id,
            }
            //console.log(applicationData);
            setSubmitting(true);
            const api = axios.create({
                baseURL: `https://amtech-app-ya67p.ondigitalocean.app/api/users`,
            });
            api
                .post("/submit-license-application", applicationData)
                .then((res) => {
                    //getApplications(userId);
                    setMessage("Application submitted successfully!");
                    setIserror(true);
                    setSubmitting(false);
                    setFilePath("");
                    setActiveFile("");
                    setIsApplicationOpen(false);
                    //go back to previous route
                    function goBack() {
                        history.goBack();
                    }
                    setTimeout(goBack, 4000);
                    // --------------
                })
                .catch((error) => {
                    setMessage(error);
                    setIserror(true);
                });
        }


    }

    //end of application =====



    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle><b>Apply for License</b></IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonGrid>
                    <IonRow>
                        <IonCol size="2"></IonCol>
                        <IonCol size="8">
                            <IonListHeader>
                                <IonLabel color="primary"><b>{licenseData?.title}</b></IonLabel>
                            </IonListHeader>


                            {filePath ? <p className="ion-text-center">{filePath}</p> : ""}
                            {progress ? <ButtonProgress /> : ""}
                            {licenseData?.requirements
                                .map((requirement: any, index: any) => (

                                    types?.includes(`${requirement?.type}`) ?
                                        <IonItem key={index}>
                                            <IonLabel className="ion-text-wrap">
                                                <p>{requirement?.description}</p>
                                                <br />
                                            </IonLabel>
                                            <IonIcon id="documentSelector" slot="end" size="large" color="dark" icon={checkmarkDoneCircleOutline}></IonIcon>

                                        </IonItem>
                                        :
                                        <IonItem key={index}>
                                            <IonLabel className="ion-text-wrap">
                                                <p onClick={() => openFileDialog(`${requirement?.type}`)}>{requirement?.description}</p>
                                                <br />
                                                {activeFile === `${requirement?.type}` ? <IonButton
                                                    id="signUpButton"
                                                    expand="block"
                                                    size="small"
                                                    fill="outline"
                                                    onClick={() => handleDocumentUpload(filePath, blobState)}
                                                >
                                                    Upload
                                                </IonButton> : ""}
                                            </IonLabel>
                                            <IonIcon id="documentSelector" slot="end" size="large" color="primary" icon={documentAttachOutline} onClick={() => openFileDialog(`${requirement?.type}`)}></IonIcon>

                                        </IonItem>
                                ))}

                            {submitting ? <ButtonProgress /> : ""}
                            <IonButton
                                id="signUpButton"
                                color="dark"
                                expand="full"
                                shape="round"
                                onClick={() => SubmitApplication()}
                            >
                                Finish & Submit Application
                                <IonIcon icon={arrowForwardOutline}></IonIcon>
                            </IonButton>
                            {/* file selector */}
                            <div style={{ display: "none" }}>
                                <input id="file-upload" type="file" onChange={setFile} />
                            </div>
                            <div><p><br /></p></div>
                            <div><p><br /></p></div>


                        </IonCol>
                        <IonCol size="2"></IonCol>
                    </IonRow>
                </IonGrid>

                <IonToast
                    color="primary"
                    isOpen={iserror}
                    onDidDismiss={() => setIserror(false)}
                    message={message}
                    duration={5000}
                />
            </IonContent>
        </IonPage>
    );
};

export default Apply;
