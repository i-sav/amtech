import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import axios from "axios";
import {
    Camera,
    CameraResultType,
    CameraSource,
    //Photo,
} from "@capacitor/camera";
import supabase from "../supabase-client";
import {
    IonContent,
    IonPage,
    IonHeader,
    IonButtons,
    IonBackButton,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardSubtitle,
    IonCardTitle,
    IonRow,
    IonCol,
    IonIcon,
    IonText,
} from "@ionic/react";
import { RouteComponentProps } from "react-router";

import "@ionic/react/css/ionic-swiper.css";
import ButtonProgress from "../components/ButtonProgress";
import CurrentApplicationsStore, { AllApplications } from "../store/CurrentApplications";
import { download, downloadOutline, personCircleSharp } from "ionicons/icons";


const ApplicationRecords: React.FC = () => {
    const userId = useContext(AuthContext);
    const history = useHistory();
    //
    const currentApplications = CurrentApplicationsStore.useState<any>(s => s.currentApplications);
    console.log(currentApplications);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle><b>Current Applications</b></IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>

                {
                    currentApplications !== undefined ? (
                        currentApplications.length > 0 ? (
                            currentApplications.slice(0, 60).map((application: any, index: any) => (
                                <>
                                    <IonCard className="ion-padding" key={index}>
                                        <IonIcon size="large" color="primary" icon={personCircleSharp}></IonIcon>
                                        <IonCardSubtitle>Status:{application?.status}</IonCardSubtitle>
                                        <IonCardTitle>Category: {application?.licenseCategory}</IonCardTitle>
                                        <IonRow>
                                            {application?.documents?.map((doc: any, index: any) => (
                                                <IonCol size="6" onClick={() => window.open("https://mbttpimkgallkklqbndt.supabase.co/storage/v1/object/public/biva-storage/" + doc?.documentUrl)}>
                                                    <p>{doc?.documentType} <IonIcon color="primary" icon={downloadOutline}></IonIcon></p>
                                                </IonCol>
                                            ))}
                                        </IonRow>
                                    </IonCard>
                                </>
                            ))
                        ) : (
                            <IonCard className="ion-padding">
                                <IonText><b>You have no applications at the moment, check again later!</b></IonText>
                            </IonCard>
                        )
                    ) : (
                        ""
                    )}
            </IonContent>
        </IonPage>
    );
};

export default ApplicationRecords;
