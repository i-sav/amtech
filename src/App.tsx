import React, { useContext, useEffect } from "react";
//import { Redirect, Route } from "react-router-dom";
import { IonApp, setupIonicReact } from "@ionic/react";
// import { IonReactRouter } from "@ionic/react-router";
// import { useIonRouter } from "@ionic/react";
// //import { Plugins } from "@capacitor/core";
//const { App } = Plugins;
//push notifications
// import { PushNotificationSchema, PushNotifications, Token, ActionPerformed } from '@capacitor/push-notifications';
import { Plugins, Capacitor } from "@capacitor/core";

import { AuthContext } from "./components/AuthContext";
import { useHistory } from "react-router-dom";
import Home from "./components/Home";
import LogIn from "./pages/Login";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => {
  const history = useHistory();
  //const [currentUser, setCurrentUser] = useState("");
  //const ionRouter = useIonRouter();
  const userId = useContext(AuthContext);
  //const [currentUser, setCurrentUser] = useState(userId);
  console.log(userId);

  if (userId._id) {
    //cureent user is logged in -- redirect to home
    window.history.replaceState({}, "", "/");
  } else {
    //user is not logged in redirect to login
    window.history.replaceState({}, "", "/login");
  }

  useEffect(() => {
    if (Capacitor.isNative) {
      Plugins.App.addListener("backButton", (e: any) => {
        if (window.location.pathname === "/") {
          // // Show A Confirm Box For User to exit app or not
          // let ans = window.confirm("Are you sure you want to exit app?");
          // if (ans) {
          //   Plugins.App.exitApp();
          // }
          Plugins.App.exitApp();
        } else if (window.location.pathname === "/home") {
          // // Show A Confirm Box For User to exit app or not
          // let ans = window.confirm("Are you sure you want to exit app?");
          // if (ans) {
          //   Plugins.App.exitApp();
          // }
          Plugins.App.exitApp();
        } else if (window.location.pathname === "/login") {
          // // Show A Confirm Box For User to exit app or not
          // let ans = window.confirm("Are you sure you want to exit app?");
          // if (ans) {
          //   Plugins.App.exitApp();
          // }
          Plugins.App.exitApp();
        }
      });
    }
  }, []);
  window.screen.orientation.lock("portrait").then(
    (success) => console.log("---Screen locked to portrait ----"),
    (failure) => console.log("----Failed to lock screen")
  );

  return (
    <IonApp>
      {userId._id ? <Home /> : <LogIn />}
    </IonApp>
  );
};

export default App;
