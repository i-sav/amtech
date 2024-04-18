import React, { useEffect } from "react";
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
    IonTitle,
} from "@ionic/react";

import "@ionic/react/css/ionic-swiper.css";
import TabsContext from "../components/TabsContext";

const TCs: React.FC = () => {
    const { setShowTabs } = React.useContext(TabsContext);
    //hiding tabs on page when it loads
    useEffect(() => {
        setShowTabs(false);
        return () => {
            setShowTabs(true);
        };
    }, []);


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>Our terms and conditions</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonList>
                    <IonListHeader>
                        <IonLabel color="primary">Please read and understand.</IonLabel>
                    </IonListHeader>
                    <IonItem>
                        <IonLabel className="ion-padding ion-text-wrap">

                            <h5><b>These terms and conditions govern your use of the Amtech application. If you do not agree to any of these terms, you should not use the application. Amtech reserves the right to update or modify these terms at any time without prior notice.</b></h5>
                            <br />
                            <p>
                                <b>Acceptance of Terms:</b>
                                By downloading, installing, or using the Amtech mobile application ("the App"), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use the App.
                            </p>
                            <br />
                            <p><b>User Account:</b> You must be at least 18 years old or the legal age of majority in your jurisdiction to use the Biva application. By using the application, you confirm that you meet these eligibility requirements.</p><br />

                            <p><b>Usage Restrictions:</b> You shall not use the App for any unlawful purpose or in any way that may damage, disable, overburden, or impair the functionality of the App. You also agree not to attempt to gain unauthorized access to any part of the App.</p><br />

                            <p><b>Fuel Supply Orders:</b> The App allows users to place orders for fuel supply services. By placing an order through the App, you agree to pay all applicable fees and charges associated with the order</p><br />

                            <p><b>Delivery Terms:</b> We will make every effort to deliver the fuel supply within the specified time frame. However, delivery times may vary depending on factors such as weather conditions and traffic. We shall not be liable for any delays in delivery.</p><br />

                            <p><b>Cancellation Policy:</b> Users may cancel their fuel supply orders through the App within a specified time frame. Cancellation outside this time frame may be subject to a cancellation fee. We reserve the right to cancel orders in case of unforeseen circumstances.</p><br />

                            <p><b>User Conduct:</b> You agree to use the App in a manner consistent with all applicable laws and regulations. You shall not engage in any conduct that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.</p><br />

                            <p><b>Intellectual Property Rights:</b> The App and its original content, features, and functionality are owned by Amtech and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p><br />

                            <p><b>Disclaimer of Warranties: </b>Our Privacy Policy governs the collection, use, and disclosure of personal information provided by users of the App. By using the App, you consent to the terms of our Privacy Policy.</p><br />

                            <p><b>Disclaimer of Warranties:</b> The App is provided on an "as is" and "as available" basis without any warranties of any kind, whether express or implied. We do not warrant that the App will be uninterrupted, secure, or error-free.</p>

                        </IonLabel>
                    </IonItem>
                </IonList>
            </IonContent>
        </IonPage >
    );
};

export default TCs;
