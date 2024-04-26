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

const About: React.FC = () => {
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
          <IonTitle>About Amtech</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonListHeader>
            <IonLabel color="primary">About Us</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonLabel className="ion-padding ion-text-wrap">

              <h2>Welcome to Amtech Ltd</h2>
              <br />
              <p>
                Our journey began with a vision to bridge the gap between potential petroleum operators and regulatory compliance. Recognizing the challenges faced by businesses in obtaining petroleum licenses, we set out to offer a solution that combines industry expertise with a client-centric approach. Over the years, we have built a reputation for excellence, reliability, and efficiency. Our team of seasoned professionals has worked tirelessly to stay abreast of regulatory changes and industry trends, ensuring that our clients receive the most up-to-date advice and support.
              </p>

            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default About;
