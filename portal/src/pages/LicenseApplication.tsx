import React, { useState, useContext, useEffect } from "react";
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
    IonList,
    IonListHeader,
    IonLabel,
    IonButton,
    IonToast,
    IonTitle,
    IonIcon,
    IonItem,
} from "@ionic/react";
import { RouteComponentProps, useLocation } from "react-router";

import "@ionic/react/css/ionic-swiper.css";
import ButtonProgress from "../components/ButtonProgress";
import { arrowForwardOutline, checkmarkDoneCircle, documentAttachOutline } from "ionicons/icons";
import { getDocuments } from "../store/DocStore";
import MyApplicationsStore, { getApplications } from "../store/ApplicationsStore";
import { type } from "os";

export interface PageProps
    extends RouteComponentProps<{
        id: string;
    }> { }


const ApplyLicense: React.FC<PageProps> = ({ match }) => {
    const userId = useContext(AuthContext);
    const history = useHistory();
    //
    const [filePath, setFilePath] = useState<string>("");
    const [activeFile, setActiveFile] = useState<string>("");
    const [blobState, setBlobState] = useState<any>();
    const [types, setTypes] = useState<any>([]);
    const [requiredTypes, setRequiredTypes] = useState<any>([]);
    //
    const [iserror, setIserror] = useState<boolean>(false);
    const [progress, setProgress] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    //upload document to this profile
    const licenseId = match.params.id;
    //read state data fpr category and amount
    //passed data
    const location = useLocation() as any;
    const applicationData = location.state?.state;

    //application processing ====
    const applications = MyApplicationsStore.useState<any>(s => s.applications);
    const thisApplication = applications.filter((currentApplication: any) => currentApplication?.licenseCategory === applicationData?.category);
    console.log(thisApplication);
    const documentsUploaded = thisApplication[0]?.documents;
    //loop through the required
    applicationData?.requirements?.forEach((document: any) => {
        const documentType = document.type;
        //console.log(documentType);
        requiredTypes.push(documentType);
    });
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
        console.log(file);
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
            console.log(data);
            //push file to uploaded types
            setTypes([...types, activeFile]);
            //process data
            const DocumentData = {
                documentUrl: data?.path,
                applicationBy: userId,
                category: applicationData?.category,
                amountPaid: applicationData?.amount,
                documentType: activeFile,

            };

            const api = axios.create({
                baseURL: `https://amtech-app-ya67p.ondigitalocean.app/api/users`,
            });
            api
                .post("/apply-license", DocumentData)
                .then((res) => {
                    //getApplications(userId);
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
        //check if all documents have been uploaded
        let typeChecker = (arr: any, target: any) => target.every((v: any) => arr.includes(v));
        console.log(typeChecker(types, requiredTypes));
        if (typeChecker(types, requiredTypes) === false) {
            console.log(" --- All required Documents have not been uploaded ----")
            setMessage("Please upload all required documents");
            setIserror(true);
        } else {
            console.log(" ---- Submitting Application ---- ");
            const applicationData = {
                applicationId: thisApplication[0]._id,
            }
            console.log(applicationData);
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
                    <IonTitle><b>{licenseId}</b></IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonList>
                    <IonListHeader>
                        <IonLabel color="primary">{licenseId} </IonLabel>
                    </IonListHeader>
                    {filePath ? <p className="ion-text-center">{filePath}</p> : ""}
                    {progress ? <ButtonProgress /> : ""}
                    <h6 className="ion-padding"><b>Upload each of the following:</b></h6>
                    {applicationData?.requirements?.map((requirement: any, index: any) => (

                        types?.includes(`${requirement?.type}`) ?
                            <IonItem>
                                <IonLabel className="ion-text-wrap">
                                    <p>{requirement?.description}</p>
                                    <br />
                                </IonLabel>
                                <IonIcon id="documentSelector" slot="end" size="large" color="primary" icon={checkmarkDoneCircle}></IonIcon>

                            </IonItem>
                            :
                            <IonItem>
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



                    <div style={{ display: "none" }}>
                        <input id="file-upload" type="file" onChange={setFile} />
                    </div>
                    <br />

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
                </IonList>
                <IonToast
                    color="primary"
                    isOpen={iserror}
                    onDidDismiss={() => setIserror(false)}
                    message={message}
                    duration={5000}
                />
            </IonContent>
        </IonPage >
    );
};

export default ApplyLicense;
