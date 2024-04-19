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
    IonListHeader,
    IonLabel,
    IonCard,
    IonText,
    IonCardSubtitle,
    IonCardTitle,
    IonCol,
    IonRow,
    IonIcon,
} from "@ionic/react";
import { RouteComponentProps } from "react-router";

import "@ionic/react/css/ionic-swiper.css";
import ButtonProgress from "../components/ButtonProgress";
import ApplicationHistoryStore from "../store/MyApplicationHistory";
import { downloadOutline } from "ionicons/icons";


const MyHistory: React.FC = () => {
    const userId = useContext(AuthContext);
    const history = useHistory();
    //const my history
    const userHistory = ApplicationHistoryStore.useState<any>(s => s.applicationHistory);
    console.log(userHistory);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle><b>License Application History</b></IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonListHeader>
                    <IonLabel color="primary">My Application History</IonLabel>
                </IonListHeader>

                {
                    userHistory !== undefined ? (
                        userHistory.length > 0 ? (
                            userHistory.slice(0, 20).map((application: any, index: any) => (
                                <>
                                    <IonCard className="ion-padding" key={index}>
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

export default MyHistory;
