import React, { useContext, useState } from "react";
import { AuthContext } from "../components/AuthContext";

import { useHistory } from "react-router-dom";

import {
    IonContent,
    IonPage,
    RefresherEventDetail,
    IonRefresher,
    IonRefresherContent,
    IonListHeader,
    IonLabel,
    IonGrid,
} from "@ionic/react";
import { chevronDownCircleOutline } from "ionicons/icons";
import Header from "../components/Header";
import CurrentUserDetailsStore, { fetchCurrentUserDetails } from "../store/CurrentUserDataStore";
import OurClientsStore from "../store/ClientsStore";
import LoadingClients from "../components/ClientsLoading";
import OurClients from "../components/Clients";
import CreateClients from "../components/createClient";

const AllClients: React.FC = () => {
    const userId = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    //history
    const history = useHistory();
    //current user data
    const userDetails = CurrentUserDetailsStore.useState<any>(s => s.currentUserDetails);

    //client's data
    const availabaleClients = OurClientsStore.useState<any>(s => s.clients);


    //end of push notification actions
    return (
        <IonPage>
            <Header />
            <IonContent fullscreen>

                <IonListHeader>
                    <IonLabel color="primary"><b>All our clients</b></IonLabel>
                </IonListHeader>
                {isLoading ?
                    <LoadingClients />
                    :

                    availabaleClients !== undefined ? (
                        availabaleClients.length > 0 ? (
                            availabaleClients.slice(0, 30).map((client: any, index: any) => (
                                <OurClients key={index}
                                    userId={client?._id}
                                    username={client?.username}
                                    company={client?.company}
                                    displayPhoto={"https://fssmofuasqbfyefiygaf.supabase.co/storage/v1/object/public/amtechStorage/" + client?.displayPhoto} />
                            ))
                        ) : (
                            ""
                        )
                    ) : (
                        ""
                    )}

            </IonContent>
            <CreateClients />
        </IonPage>
    );
};

export default AllClients;
