import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../components/AuthContext";
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  useIonActionSheet,
  IonListHeader,
  IonImg,
} from "@ionic/react";
import {
  logOutOutline,
  callOutline,
  informationOutline,
  listOutline,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import Header from "../components/Header";
//import Header from "../components/Header";
//import CreateEvents from "../components/CreateEventButton";

const Profile: React.FC = () => {
  const userId = useContext(AuthContext);
  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [present, dismiss] = useIonActionSheet();
  const history = useHistory();
  //copy right year
  const year = new Date().getFullYear();

  //log out current user
  const LogOut = () => {
    localStorage.removeItem("AM-Tkn");
    window.history.replaceState({}, "Log In", "/login");
    setMessage("Logging you out...");
    setIserror(true);
    document.location.reload();
    return;
  };

  return (
    <IonPage>
      <Header />
      <IonContent fullscreen>
        <IonList>
          <IonListHeader>
            <IonLabel color="primary">
              <b>More</b>
            </IonLabel>
          </IonListHeader>
        </IonList>
        <IonList>
          <IonItem
            lines="full"
            onClick={(e) => {
              e.preventDefault();
              history.push("/about");
            }}
          >
            <IonIcon
              color="primary"
              icon={informationOutline}
              slot="start"
            ></IonIcon>
            <IonLabel className="ion-padding">
              <h3><b>About Us</b></h3>
              <p>About Amtech</p>
            </IonLabel>
          </IonItem>
          <IonItem
            lines="full"
            onClick={() => {
              present({
                buttons: [
                  {
                    text: "Email: info@amtech.com",
                  },
                  {
                    text: "Tel: 0710980890",
                  },
                  {
                    text: "Exit",
                    handler: () => {
                      dismiss();
                    },
                  },
                ],
                header: "Contact us or send us your feedback",
              });
            }}
          >
            <IonIcon
              color="primary"
              icon={callOutline}
              slot="start"
            ></IonIcon>
            <IonLabel className="ion-padding ion-text-wrap">
              <h3><b>Contact Support</b></h3>
              <p>Contact Support and get asistance or send us your feedback</p>
            </IonLabel>
          </IonItem>
          <IonItem
            lines="full"
            onClick={(e) => {
              e.preventDefault();
              history.push("/terms");
            }}
          >
            <IonIcon
              color="primary"
              icon={listOutline}
              slot="start"
            ></IonIcon>
            <IonLabel className="ion-padding">
              <h3><b>Terms and Conditions</b></h3>
              <p>Read our terms and conditions</p>
            </IonLabel>
          </IonItem>
          <IonItem
            lines="full"
            onClick={() => {
              present({
                buttons: [
                  {
                    text: "Log Me Out",
                    handler: () => {
                      LogOut();
                    },
                  },
                  {
                    text: "Cancel",
                    handler: () => {
                      dismiss();
                    },
                  },
                ],
                header: "Log me out",
              });
            }}
          >
            <IonIcon
              color="primary"
              icon={logOutOutline}
              slot="start"
            ></IonIcon>
            <IonLabel className="ion-padding">
              <h3><b>Log Me Out</b></h3>
              <p>Log me out of my account</p>
            </IonLabel>
          </IonItem>
          <p className="ion-text-center"> &copy; {year} </p>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
