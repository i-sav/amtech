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
    IonList,
    IonListHeader,
    IonLabel,
    IonButton,
    IonToast,
    IonTitle,
    IonIcon,
    IonCard,
    IonText,
} from "@ionic/react";
import { RouteComponentProps, useLocation } from "react-router";

import "@ionic/react/css/ionic-swiper.css";
import ButtonProgress from "../components/ButtonProgress";
import { arrowForwardOutline, documentAttachOutline } from "ionicons/icons";
import { getDocuments } from "../store/DocStore";
import MyApplicationsStore, { getApplications } from "../store/ApplicationsStore";

export interface PageProps
    extends RouteComponentProps<{
        id: string;
    }> { }


const ApplyLicense: React.FC<PageProps> = ({ match }) => {
    const userId = useContext(AuthContext);
    const history = useHistory();
    //
    const [filePath, setFilePath] = useState<string>("");
    const [blobState, setBlobState] = useState<any>();
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
    //list uploaded files
    const uploadedAlready = MyApplicationsStore.useState<any>(s => s.applications);
    //console.log(uploadedAlready);
    //docs for this application
    const thisApplicationsDocs = uploadedAlready.filter((document: any) => document.category === applicationData?.category);
    //console.log(thisApplicationsDocs);

    //const open dialog
    const openFileDialog = () => {
        (document as any).getElementById("file-upload").click();
    }
    //set Image
    const setFile = (_event: any) => {
        let file = _event.target.files[0];
        console.log(file);
        //const selectedFilePath = file?.path;
        const selectedFilePath = file?.name;
        setFilePath(selectedFilePath as string);
        //Process blob
        // if (file.blob) {
        //     console.log(file.blob);
        //     const rawFile = new Blob([file.blob as BlobPart, file.name], {
        //         type: file.mimeType,
        //     });

        //};
        setBlobState(file);
    }

    //upload document logic
    const handleDocumentUpload = async (filePath: any, blobState: any) => {
        if (filePath == "") {
            setMessage("Please select the document to upload");
            setIserror(true);
            return;
        }
        //path
        const filename = filePath.substr(filePath.lastIndexOf("/") + 1);

        setProgress(true);
        //console.log(blobState);
        const { data, error } = await supabase.storage
            .from("biva-storage")
            .upload(`docs/${filename}`, blobState, {
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
            //process data
            const DocumentData = {
                documentUrl: data?.path,
                applicationBy: userId,
                category: applicationData?.category,
                amountPaid: applicationData?.amount,

            };

            const api = axios.create({
                baseURL: `https://amtech-app-qas7x.ondigitalocean.app/api/users`,
            });
            api
                .post("/apply-license", DocumentData)
                .then((res) => {
                    setMessage("Document has been uploaded. Upload other required documents and finish your application");
                    setIserror(true);
                    setProgress(false);
                    setFilePath("");
                    getApplications(userId);
                    //go back to previous route
                    // function goBack() {
                    //     getDocuments(userId);
                    //     history.goBack();
                    // }
                    // setTimeout(goBack, 5000);
                    // --------------
                })
                .catch((error) => {
                    setMessage(error);
                    setIserror(true);
                });
        }
    };
    //submit and finish application
    const SubmitApplication = async () => {
        console.log(" --- Submitting Application˝ ----")
    }

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

                    <div className="ion-text-center ion-padding" onClick={() => openFileDialog()}>
                        <IonIcon id="documentSelector" slot="start" size="large" color="primary" icon={documentAttachOutline}></IonIcon>
                        <IonLabel className="ion-padding ion-text-wrap">
                            <h2><b>Upload Required Documents One by one</b></h2>
                            <p>Tap to select documents from device and upload</p>
                            {filePath ? <p>{filePath}</p> : ""}
                            {progress ? <ButtonProgress /> : ""}
                        </IonLabel>
                    </div>
                    <IonButton
                        id="signUpButton"
                        expand="full"
                        size="small"
                        shape="round"
                        onClick={() => handleDocumentUpload(filePath, blobState)}
                    >
                        Upload Document
                    </IonButton>
                    <div style={{ display: "none" }}>
                        <input id="file-upload" type="file" onChange={setFile} />
                    </div>
                    <IonListHeader>
                        <IonLabel color="primary"><b>Documents you've uploaded</b></IonLabel>
                    </IonListHeader>
                    {
                        thisApplicationsDocs !== undefined ? (
                            thisApplicationsDocs?.length > 0 ? (
                                thisApplicationsDocs[2]?.documents?.map((document: string, index: any) => (
                                    <IonCard className="ion-padding" key={index}><IonText>{document?.[0]}</IonText></IonCard>
                                ))
                            ) : (
                                <IonCard className="ion-padding">
                                    <IonText><b>Already uploaded documents for this application will appear here</b></IonText>
                                </IonCard>
                            )
                        ) : (
                            ""
                        )}


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
        </IonPage>
    );
};

export default ApplyLicense;
