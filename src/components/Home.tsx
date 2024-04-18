import React, { useContext, useState } from "react";
import { Redirect, Route, RouteComponentProps } from "react-router-dom";
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { homeSharp, searchSharp, settingsSharp } from "ionicons/icons";
import HomePage from "../pages/Home";
import AllClients from "../pages/All";
import AddUser from "../pages/AddUsers";
import ApplicationRecords from "../pages/Applications";
import UploadDocument from "../pages/DocumentUpload";
import Profile from "../pages/Profile";
import LogIn from "../pages/Login";
import About from "../pages/About";
import TCs from "../pages/Terms";
import TabsContext from "./TabsContext";
import ClientProfile from "../pages/ClientProfiles";
import CurrentUserDetailsStore from "../store/CurrentUserDataStore";
import AllUserDocuments from "../pages/UserDocs";
import ApplyLicense from "../pages/LicenseApplication";
import MyHistory from "../pages/ApplicationHistory"




const Home: React.FC = (RouteComponentProps) => {
  //tabs controller context
  const { showTabs } = useContext(TabsContext);

  let tabStyle = showTabs ? undefined : { display: "none" };

  //current user data
  const userData = CurrentUserDetailsStore.useState<any>(s => s.currentUserDetails);
  //console.log(userData);

  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/home">
            <HomePage />
          </Route>
          <Route exact path="/all">
            <AllClients />
          </Route>
          <Route exact path="/user-docs">
            <AllUserDocuments />
          </Route>
          <Route
            exact
            path="/client-profile/:id"
            render={(match) => <ClientProfile {...match} />}
          ></Route>
          <Route
            exact
            path="/license-application/:id"
            render={(match) => <ApplyLicense {...match} />}
          ></Route>
          <Route exact path="/applications">
            <ApplicationRecords />
          </Route>
          <Route exact path="/application-history">
            <MyHistory />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
          <Route exact path="/add-user">
            <AddUser />
          </Route>
          <Route
            exact
            path="/upload-document/:id"
            render={(match) => <UploadDocument {...match} />}
          ></Route>
          <Route exact path="/about">
            <About />
          </Route>
          <Route exact path="/terms">
            <TCs />
          </Route>
          <Route exact path="/login">
            <LogIn />
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom" style={tabStyle}>
          <IonTabButton tab="home" href="/home">
            <IonIcon icon={homeSharp} />
            <IonLabel><b>Portal Area</b></IonLabel>
          </IonTabButton>
          {userData?.role === "admin" ? <IonTabButton tab="all" href="/all">
            <IonIcon icon={searchSharp} />
            <IonLabel><b>All Clients</b></IonLabel>
          </IonTabButton> : ""}
          <IonTabButton tab="profile" href="/profile">
            <IonIcon icon={settingsSharp} />
            <IonLabel><b>Profile</b></IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
};

export default Home;
