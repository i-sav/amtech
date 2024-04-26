import { IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { personAddSharp } from "ionicons/icons";
import React from "react";
import { useHistory } from "react-router";

const CreateClients: React.FC = () => {
    //history
    const history = useHistory();

    return (
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={(e) => {
                e.preventDefault();
                history.push("/add-user");
            }}>
                <IonIcon icon={personAddSharp}></IonIcon>
            </IonFabButton>
        </IonFab>
    );
};

export default CreateClients;
