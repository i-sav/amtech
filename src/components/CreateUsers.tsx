import { IonButton, IonItem, IonLabel } from "@ionic/react";
import React from "react";
import { useHistory } from "react-router";

const CreateUser: React.FC = () => {
    //history
    const history = useHistory();

    return (
        <IonItem id="featured" lines="none" onClick={(e) => {
            e.preventDefault();
            history.push("/add-user");
        }}>
            <IonLabel className="ion-padding ion-text-wrap">
                <h2><b>Create User</b></h2>
                <p>Create a client or user. Please share the login details with them</p>
            </IonLabel>
            <IonButton shape="round" slot="end" color="primary">Add user</IonButton>
        </IonItem>
    );
};

export default CreateUser;
