import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";

import axios from "axios";
import supabase from "../supabase-client";
import { FilePicker } from '@capawesome/capacitor-file-picker';
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
    IonToast,
    IonTitle,
    IonIcon,
    IonImg,
    IonAvatar,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonText,
    IonAccordionGroup,
    IonAccordion,
    IonPopover,
    IonSelect,
    IonSelectOption,
    IonList,
    IonButton,
} from "@ionic/react";
import { RouteComponentProps, useLocation } from "react-router";
import "@ionic/react/css/ionic-swiper.css";
import { arrowForwardOutline, checkmarkCircleOutline, documentAttachOutline, downloadOutline } from "ionicons/icons";
import DocumentPreview from "../components/DocPreview";
import MyDocumentsStore, { getDocuments } from "../store/DocStore";
import ButtonProgress from "../components/ButtonProgress";
import MyApplicationsStore, { getApplications } from "../store/ApplicationsStore";

export interface PageProps
    extends RouteComponentProps<{
        id: string;
    }> { }


const ClientProfile: React.FC<PageProps> = ({ match }) => {
    const history = useHistory();
    //
    // const [title, setTitle] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [filePath, setFilePath] = useState<string>("");
    const [blobState, setBlobState] = useState<any>();
    //
    const [iserror, setIserror] = useState<boolean>(false);
    const [progress, setProgress] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    //upload document to this profile
    const userId = match.params.id;

    //get this clients documents
    useEffect(() => {
        //fecth docs
        getDocuments(userId);
        //fecth applications
        getApplications(userId);
    }, []);

    //passed data ==========================
    const location = useLocation() as any;
    const profileData = location.state?.state;
    console.log(profileData);
    //documents
    const documentsData = MyDocumentsStore.useState<any>(s => s.documents);
    //filter for user
    const userDocuments = documentsData.filter((document: any) => document.belongsTo === userId);
    //console.log(userDocuments);
    //current applications by teh user
    const userApplications = MyApplicationsStore.useState<any>(s => s.applications);

    //end of data ===========================

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

    //choose file
    const pickFiles = async () => {
        //read files from the device
        const result = await FilePicker.pickFiles({
            types: ['application/pdf'],
            multiple: true,
            readData: false,
        });
        //process the files
        const file = result.files[0];
        //const selectedFilePath = file?.path;
        const selectedFilePath = file?.name;
        setFilePath(selectedFilePath as string);
        //Process blob
        //PLATFORM WEB
        if (file.blob) {
            console.log(file.blob);
            const rawFile = new Blob([file.blob as BlobPart, file.name], {
                type: file.mimeType,
            });
            setBlobState(rawFile);
        };
        //PLATFORM APP

    }

    //upload document logic
    const handleDocumentUpload = async (filePath: any, blobState: any) => {
        if (filePath == "") {
            setMessage("Please select the document to upload");
            setIserror(true);
            return;
        }

        //document title
        if (category == "") {
            setMessage("Please select the document Category");
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
            .from("amtechStorage")
            .upload(`documents/${currentTime + filename}`, blobState, {
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
                // title: title,
                documentUrl: data?.path,
                belongsTo: userId,
                category: category,
            };

            const api = axios.create({
                baseURL: `https://octopus-app-5uj8p.ondigitalocean.app/api/users`,
            });
            api
                .post("/create-document", DocumentData)
                .then((res) => {
                    getDocuments(userId);
                    setMessage("Document has been uploaded to user profile. Click anywhere to go back.");
                    setIserror(true);
                    setProgress(false);
                })
                .catch((error) => {
                    setProgress(false);
                    setMessage(error);
                    setIserror(true);
                });
        }
    };


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>{profileData?.username}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonGrid>
                    <IonRow>
                        <IonCol size="3">
                            <div className="ion-text-center">
                                <br />
                                <IonAvatar id="client"><IonImg src="assets/images/icon.png"></IonImg></IonAvatar>
                                <IonLabel className="ion-padding">
                                    <h2><b>{profileData?.username}</b></h2>
                                </IonLabel>
                            </div>
                            <IonItem id="uploadDocument" lines="none">
                                <IonIcon slot="start" size="large" color="primary" icon={documentAttachOutline}></IonIcon>
                                <IonLabel className="ion-padding ion-text-wrap">
                                    <h2><b>Upload Document</b></h2>
                                    <p>All documents uploaded here are specifically for this user</p>
                                </IonLabel>
                                <IonIcon icon={arrowForwardOutline} color="primary"></IonIcon>
                            </IonItem>
                            <IonPopover trigger="uploadDocument" triggerAction="click" side="right" alignment="center" size="cover">
                                <IonContent class="ion-padding">
                                    <IonList>
                                        <IonListHeader>
                                            <IonLabel color="primary">Provide document details </IonLabel>
                                        </IonListHeader>

                                        <div className="ion-text-center ion-padding" onClick={() => openFileDialog()}>
                                            <IonIcon id="documentSelector" slot="start" size="large" color="primary" icon={documentAttachOutline}></IonIcon>
                                            <IonLabel className="ion-padding ion-text-wrap">
                                                <h2><b>Upload Document</b></h2>
                                                <p>Tap to select document from device and upload</p>
                                                {filePath ? <p>{filePath}</p> : ""}
                                            </IonLabel>
                                        </div>
                                        <div style={{ display: "none" }}>
                                            <input id="file-upload" type="file" onChange={setFile} />
                                        </div>
                                        <IonItem lines="none">
                                            <IonLabel position="floating"><b>Select Category</b></IonLabel>
                                            <IonSelect
                                                className="ion-padding"
                                                value={category}
                                                onIonChange={(e) => setCategory(e.detail.value!)}
                                            >
                                                <IonSelectOption value="transport">Transport Of LPG</IonSelectOption>
                                                <IonSelectOption value="retail-except-lpg">Retail Except LPG</IonSelectOption>
                                                <IonSelectOption value="lpg-retail">Retail of LPG</IonSelectOption>
                                                <IonSelectOption value="export-wholesale">Export & Wholesale</IonSelectOption>
                                                <IonSelectOption value="drivers">Driver License</IonSelectOption>
                                                <IonSelectOption value="Other">Normal Documents(Non-License)</IonSelectOption>
                                            </IonSelect>
                                        </IonItem>



                                        {progress ? <ButtonProgress /> : ""}
                                        <IonButton
                                            id="signUpButton"
                                            expand="full"
                                            shape="round"
                                            onClick={() => handleDocumentUpload(filePath, blobState)}
                                        >
                                            Upload Document Now
                                        </IonButton>
                                    </IonList>
                                </IonContent>
                            </IonPopover>
                        </IonCol>
                        <IonCol size="5">
                            <IonListHeader className="ion-text-center">
                                <IonLabel color="primary"><b>Available Documents</b></IonLabel>
                            </IonListHeader>
                            <IonGrid>
                                <IonRow>
                                    {
                                        userDocuments !== undefined ? (
                                            userDocuments.length > 0 ? (
                                                userDocuments.map((document: any, index: any) => (
                                                    <DocumentPreview
                                                        docId={document._id}
                                                        title={document.title}
                                                        docUrl={"https://fssmofuasqbfyefiygaf.supabase.co/storage/v1/object/public/amtechStorage/" + document?.documentPath}
                                                    />
                                                ))
                                            ) : (
                                                <IonCard className="ion-padding">
                                                    <IonText><b>There are no documents at the moment, check again later!</b></IonText>
                                                </IonCard>
                                            )
                                        ) : (
                                            ""
                                        )}
                                </IonRow>
                            </IonGrid>
                        </IonCol>
                        <IonCol size="4">
                            <IonListHeader>
                                <IonLabel><b>Current Applications</b></IonLabel>
                            </IonListHeader>
                            {
                                userApplications !== undefined ? (
                                    userApplications.length > 0 ? (
                                        userApplications.slice(0, 60).map((application: any, index: any) => (
                                            <>
                                                <IonCard className="ion-padding" key={index}>
                                                    <IonAccordionGroup>
                                                        <IonAccordion>
                                                            <IonItem slot="header">
                                                                <IonIcon size="large" slot="start" color="primary" icon={checkmarkCircleOutline}></IonIcon>
                                                                <IonLabel>
                                                                    <p>Status: <b>{application?.status}</b></p>
                                                                    <p>Category: <b>{application?.licenseCategory}</b></p>
                                                                    <p>Documents: <b>{application?.documents?.length}</b></p>
                                                                </IonLabel>
                                                            </IonItem>
                                                            <div className="ion-padding" slot="content">
                                                                <p><b>Attached Documents:</b></p>
                                                                <IonRow>
                                                                    {application?.documents?.map((doc: any, index: any) => (
                                                                        <IonCol size="3" onClick={() => window.open("https://fssmofuasqbfyefiygaf.supabase.co/storage/v1/object/public/amtechStorage/" + doc?.documentUrl)}>
                                                                            <p>{doc?.documentType} <IonIcon color="primary" icon={downloadOutline}></IonIcon></p>
                                                                        </IonCol>
                                                                    ))}
                                                                </IonRow>
                                                            </div>
                                                        </IonAccordion>
                                                    </IonAccordionGroup>
                                                </IonCard>
                                            </>
                                        ))
                                    ) : (
                                        <IonCard className="ion-padding">
                                            <IonText><b>{profileData?.username} has no applications at the moment, check again later!</b></IonText>
                                        </IonCard>
                                    )
                                ) : (
                                    ""
                                )}
                        </IonCol>
                    </IonRow>
                </IonGrid>



                <IonToast
                    color="primary"
                    isOpen={iserror}
                    onDidDismiss={() => setIserror(false)}
                    message={message}
                    duration={2000}
                />
            </IonContent>
        </IonPage>
    );
};

export default ClientProfile;
