import React from "react";
//import axios from "axios";
import { IonItem, IonLabel, IonSpinner } from "@ionic/react";
import { } from "ionicons/icons";

interface ContainerProps {
  name: string;
}

const ButtonProgress: React.FC = () => {
  return (
    <IonItem lines="none" color="none" className="ion-text-center">
      <IonLabel>
        <IonSpinner name="bubbles"></IonSpinner>
      </IonLabel>
    </IonItem>
  );
};

export default ButtonProgress;
