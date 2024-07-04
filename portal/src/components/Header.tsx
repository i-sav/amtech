import React, { useContext, useState, useEffect } from "react";
import {
  IonToolbar,
  IonIcon,
  IonImg,
  IonHeader,
  IonChip,
  IonLabel,
} from "@ionic/react";
import { useHistory } from "react-router-dom";

import {
  listOutline,
  listSharp,
  logOutOutline,
  personCircleSharp,
  qrCodeOutline,
} from "ionicons/icons";
import { AuthContext } from "./AuthContext";
import CurrentCreatorDetailsStore, { fetchCurrentUserDetails } from "../store/CurrentUserDataStore";
import CurrentUserDetailsStore from "../store/CurrentUserDataStore";

// interface ContainerProps {
//   count: string;
// }

const Header: React.FC = () => {
  const history = useHistory();
  const userId = useContext(AuthContext);
  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [currentUserData, setCurrentUserData] = useState<any>([]);

  //read user data from pull state
  const currentUserDetails = CurrentUserDetailsStore?.useState<any>(s => s.currentUserDetails);
  //console.log(currentUser;etails);
  //log out current user
  const LogOut = () => {
    localStorage.removeItem("AM-Tkn");
    //window.history.replaceState({}, "Log In", "/login");
    window.history.replaceState({}, "Log In", "/");
    setMessage("Logging you out...");
    setIserror(true);
    document.location.reload();
    return;
  };

  return (
    <IonHeader>
      <IonToolbar>
        <IonImg style={{ "margin-left": "-40%", width: "100%", height: "90px" }} src="assets/images/Logo.png"></IonImg>

        {currentUserDetails.role === "admin" ?
          <IonIcon className="ion-padding" slot="end" size="large" color="primary" icon={qrCodeOutline} onClick={(e) => {
            e.preventDefault();
            history.push("/qr-pdf");
          }}></IonIcon>
          : ""
        }
        <IonIcon className="ion-padding" slot="end" size="large" color="primary" icon={logOutOutline} onClick={() => LogOut()}></IonIcon>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
