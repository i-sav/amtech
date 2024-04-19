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
    IonItem,
    IonButton,
    IonToast,
    IonTitle,
    IonInput,
    IonIcon,
    IonSelect,
    IonSelectOption,
} from "@ionic/react";
import { RouteComponentProps } from "react-router";

import "@ionic/react/css/ionic-swiper.css";
import ButtonProgress from "../components/ButtonProgress";
import { documentAttachOutline } from "ionicons/icons";
import { getDocuments } from "../store/DocStore";

export interface PageProps
    extends RouteComponentProps<{
        id: string;
    }> { }


const UploadDocument: React.FC<PageProps> = ({ match }) => {
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
                // title: title,
                documentUrl: data?.path,
                belongsTo: userId,
                category: category,
            };

            const api = axios.create({
                baseURL: `https://amtech-app-qas7x.ondigitalocean.app/api/users`,
            });
            api
                .post("/create-document", DocumentData)
                .then((res) => {
                    setMessage("Document has been uploaded to user profile.");
                    setIserror(true);
                    //go back to previous route
                    function goBack() {
                        getDocuments(userId);
                        history.goBack();
                    }
                    setTimeout(goBack, 5000);
                    // --------------
                })
                .catch((error) => {
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
                    <IonTitle><b>Upload Document</b></IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
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
                            <IonSelectOption value="lpg-retail-expt">Retail Expt LPG</IonSelectOption>
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

export default UploadDocument;
