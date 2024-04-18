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


const TransactionRecords: React.FC = () => {
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
            baseURL: `https://amtech-app-qas7x.ondigitalocean.app/api/users`,
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
                    <IonTitle><b>Payment Records</b></IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>


            </IonContent>
        </IonPage>
    );
};

export default TransactionRecords;
