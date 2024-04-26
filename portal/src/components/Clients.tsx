import { IonAvatar, IonIcon, IonImg, IonItem, IonLabel } from "@ionic/react";
import { arrowForwardOutline } from "ionicons/icons";
import React from "react";
import { useHistory } from "react-router";


interface ContainerProps {
    userId: string;
    username: string;
    company: string;
    displayPhoto: string;
}

const OurClients: React.FC<ContainerProps> = ({
    userId,
    username,
    company,
    displayPhoto,
}) => {

    //history
    const history = useHistory();
    //construct data to pass
    const clientData = {
        userId, username, company, displayPhoto
    }

    return (
        <IonItem onClick={(e) => {
            e.preventDefault();
            history.push("/client-profile/" + `${userId}`, { state: clientData });
        }}>
            <IonAvatar>
                <IonImg src="assets/images/icon.png"></IonImg>
            </IonAvatar>
            <IonLabel className="ion-padding ion-text-wrap">
                <h2><b>{username}</b></h2>
                <p>{company}</p>

            </IonLabel>
            <IonIcon slot="end" color="primary" icon={arrowForwardOutline}></IonIcon>
        </IonItem>
    );
};

export default OurClients;
