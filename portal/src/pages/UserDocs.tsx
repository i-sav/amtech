import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import axios from "axios";
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
    IonGrid,
    IonRow,
    IonCard,
    IonText,
} from "@ionic/react";
import { RouteComponentProps } from "react-router";

import "@ionic/react/css/ionic-swiper.css";
import MyDocumentsStore from "../store/DocStore";
import DocumentPreview from "../components/DocPreview";
import TabsContext from "../components/TabsContext";


const AllUserDocuments: React.FC = () => {
    const userId = useContext(AuthContext);
    //history
    const history = useHistory();
    const { setShowTabs } = React.useContext(TabsContext);
    //hiding tabs on page when it loads
    useEffect(() => {
        setShowTabs(false);
        return () => {
            setShowTabs(true);
        };
    }, []);
    //
    //documents
    const documentsData = MyDocumentsStore.useState<any>(s => s.documents);
    //filter for user
    const userDocuments = documentsData.filter((document: any) => document.belongsTo === userId._id);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle><b>All Documents</b></IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonListHeader>
                    <IonLabel color="primary"><b>Your documents</b></IonLabel>
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
                                        <IonText><b>You have no documents at the moment, check again later!</b></IonText>
                                    </IonCard>
                                )
                            ) : (
                                ""
                            )}
                    </IonRow>
                </IonGrid>

            </IonContent>
        </IonPage>
    );
};

export default AllUserDocuments;
