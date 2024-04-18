import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import supabase from "../supabase-client";
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
} from "@ionic/react";
import { RouteComponentProps, useLocation } from "react-router";
import "@ionic/react/css/ionic-swiper.css";
import { arrowForwardOutline, documentAttachOutline } from "ionicons/icons";
import DocumentPreview from "../components/DocPreview";
import MyDocumentsStore from "../store/DocStore";

export interface PageProps
    extends RouteComponentProps<{
        id: string;
    }> { }


const ClientProfile: React.FC<PageProps> = ({ match }) => {
    const history = useHistory();
    const [iserror, setIserror] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    //selected client identity
    const userId = match.params.id;
    //passed data
    const location = useLocation() as any;
    const profileData = location.state?.state;
    //documents
    const documentsData = MyDocumentsStore.useState<any>(s => s.documents);
    //filter for user
    const userDocuments = documentsData.filter((document: any) => document.belongsTo === userId);
    //console.log(userDocuments);


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
                <div className="ion-text-center">
                    <br />
                    <IonAvatar id="client"><IonImg src="assets/images/icon.png"></IonImg></IonAvatar>
                    <IonLabel className="ion-padding">
                        <h2><b>{profileData?.username}</b></h2>
                        <p>Amtech Ltd | Supplier</p>
                    </IonLabel>
                </div>
                <IonItem lines="none" onClick={(e) => {
                    e.preventDefault();
                    history.push("/upload-document/" + `${userId}`);
                }}>
                    <IonIcon slot="start" size="large" color="primary" icon={documentAttachOutline}></IonIcon>
                    <IonLabel className="ion-padding ion-text-wrap">
                        <h2><b>Upload Document</b></h2>
                        <p>All documents uploaded here are specifically for this user</p>
                    </IonLabel>
                    <IonIcon icon={arrowForwardOutline} color="primary"></IonIcon>
                </IonItem>
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
                                            docUrl={"https://mbttpimkgallkklqbndt.supabase.co/storage/v1/object/public/biva-storage/" + document?.documentPath}
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
