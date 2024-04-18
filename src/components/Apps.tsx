import React from "react";
//import axios from "axios";
import { Browser } from '@capacitor/browser';
import { IonButton, IonCard, IonCardTitle, IonIcon, IonImg } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { arrowForwardOutline } from "ionicons/icons";

interface ContainerProps {
    title: string;
    img: string;
    url: string;
}

const TopApps: React.FC<ContainerProps> = ({
    title,
    img,
    url
}) => {

    //history
    const history = useHistory();
    //open site
    const openCapacitorSite = async (site: any) => {
        await Browser.open({ url: site });
    };


    return (
        <IonCard id="featured-app" className="ion-padding" onClick={() => openCapacitorSite(`${url}`)}>
            {/* <IonCardSubtitle>{url}</IonCardSubtitle> */}
            <IonCardTitle>{title}</IonCardTitle>
            <br />
            <IonImg style={{ width: "100%", height: "260px", "object-fit": "cover" }} src={img}></IonImg>
            <br />
            <IonButton
                expand="full"
                fill="outline"
                shape="round"
                color="danger"
            >
                Download App
                <IonIcon slot="end" color="danger" icon={arrowForwardOutline}></IonIcon>
            </IonButton>

        </IonCard>
    );
};

export default TopApps;
