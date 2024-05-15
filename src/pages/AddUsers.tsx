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
    IonList,
    IonListHeader,
    IonLabel,
    IonItem,
    IonButton,
    IonToast,
    IonTitle,
    IonInput,
    IonSelect,
    IonSelectOption,
} from "@ionic/react";
import { RouteComponentProps } from "react-router";

import "@ionic/react/css/ionic-swiper.css";
import ButtonProgress from "../components/ButtonProgress";


const AddUser: React.FC = () => {
    const userId = useContext(AuthContext);
    const history = useHistory();
    //
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [tel, setTel] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    //
    const [iserror, setIserror] = useState<boolean>(false);
    const [progress, setProgress] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    //create user logic
    const CreateUser = async () => {

        //name
        if (name == "") {
            setMessage("Please provide full Name");
            setIserror(true);
            return;
        }
        //name
        if (email == "") {
            setMessage("Please provide a valid email");
            setIserror(true);
            return;
        }
        //name
        if (tel == "") {
            setMessage("Please provide a valid Tel No");
            setIserror(true);
            return;
        }
        //name
        if (category == "") {
            setMessage("Please select the user's category");
            setIserror(true);
            return;
        }
        if (password == "") {
            setMessage("Please provide the user's password");
            setIserror(true);
            return;
        }

        setProgress(true);

        //process data
        const UsrData = {
            name: name,
            email: email,
            tel: tel,
            password: password,
            category: category,
        };

        const api = axios.create({
            baseURL: `https://amtech-app-ya67p.ondigitalocean.app/api/users`,
        });
        api
            .post("/create-user", UsrData)
            .then((res) => {
                setMessage("Use has been created successfully. Their logIn credentials have been shared via their email!");
                setIserror(true);
                //go back to previous route
                function goBack() {
                    history.goBack();
                }
                setTimeout(goBack, 5000);
                // --------------
            })
            .catch((error) => {
                setMessage(error);
                setIserror(true);
            });
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle><b>Create User</b></IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonList>
                    <IonListHeader>
                        <IonLabel color="primary">Provide user Details </IonLabel>
                    </IonListHeader>
                    <IonItem lines="none">
                        <IonLabel position="floating"><b>Full Name</b></IonLabel>
                        <IonInput
                            className="ion-padding"
                            placeholder="Enter Full Name"
                            value={name}
                            onIonChange={(e) => setName(e.detail.value!)}
                        ></IonInput>
                    </IonItem>

                    <IonItem lines="none">
                        <IonLabel position="floating"><b>Email</b></IonLabel>
                        <IonInput
                            className="ion-padding"
                            value={email}
                            placeholder="Enter Email"
                            onIonChange={(e) => setEmail(e.detail.value!)}
                        ></IonInput>
                    </IonItem>

                    <IonItem lines="none">
                        <IonLabel position="floating"><b>Tel No</b></IonLabel>
                        <IonInput
                            className="ion-padding"
                            placeholder="Enter Tel"
                            value={tel}
                            onIonChange={(e) => setTel(e.detail.value!)}
                        ></IonInput>
                    </IonItem>

                    <IonItem lines="none">
                        <IonLabel position="floating"><b>Select User Category</b></IonLabel>
                        <IonSelect
                            className="ion-padding"
                            value={category}
                            onIonChange={(e) => setCategory(e.detail.value!)}
                        >
                            <IonSelectOption value="admin">Admin</IonSelectOption>
                            <IonSelectOption value="user">Normal User</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    <IonItem lines="none">
                        <IonLabel position="floating"><b>Password</b></IonLabel>
                        <IonInput
                            className="ion-padding"
                            placeholder="Enter Password"
                            value={password}
                            onIonChange={(e) => setPassword(e.detail.value!)}
                        ></IonInput>
                    </IonItem>
                </IonList>

                {progress ? <ButtonProgress /> : ""}
                <IonButton
                    id="signUpButton"
                    expand="full"
                    shape="round"
                    onClick={() => CreateUser()}
                >
                    Create User Now
                </IonButton>
                <IonToast
                    color="primary"
                    isOpen={iserror}
                    onDidDismiss={() => setIserror(false)}
                    message={message}
                    duration={5000}
                />
            </IonContent>
        </IonPage>
    );
};

export default AddUser;
