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
  personCircleSharp,
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

  useEffect(() => {
    fetchCurrentUserDetails(userId._id);
  });

  //read user data from pull state
  const currentUserDetails = CurrentUserDetailsStore?.useState<any>(s => s.currentUserDetails);
  //console.log(currentUser;etails);

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonIcon className="ion-padding" icon={personCircleSharp} slot="start" size="large" color="primary"></IonIcon>

          <IonImg style={{ width: "100%", height: "80px" }} src="assets/images/Logo.png"></IonImg>

          {currentUserDetails?.role === "admin" ?
            <IonIcon className="ion-padding" slot="end" size="large" color="primary" icon={listSharp} onClick={(e) => {
              e.preventDefault();
              history.push("/transactions");
            }}></IonIcon>
            :
            <IonIcon className="ion-padding" slot="end" size="large" color="primary" icon={listOutline} onClick={(e) => {
              e.preventDefault();
              history.push("/application-history");
            }}></IonIcon>
          }

        </IonToolbar>
      </IonHeader>
    </>
  );
};

export default Header;
