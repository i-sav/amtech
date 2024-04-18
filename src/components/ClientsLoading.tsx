import { IonAvatar, IonIcon, IonImg, IonItem, IonLabel, IonSkeletonText } from "@ionic/react";
import { arrowForwardOutline } from "ionicons/icons";
import React from "react";

const LoadingClients: React.FC = () => {

    return (
        <>
            {Array(10).fill(0).map((_, i) => (
                <IonItem lines="none" key={i}>
                    <IonAvatar>
                        <IonSkeletonText animated></IonSkeletonText>
                    </IonAvatar>
                    <IonLabel className="ion-padding">
                        <IonSkeletonText style={{ width: "80%" }} animated></IonSkeletonText>
                        <IonSkeletonText style={{ width: "50%" }} animated></IonSkeletonText>
                    </IonLabel>
                </IonItem>
            ))}

        </>
    );
};

export default LoadingClients;
