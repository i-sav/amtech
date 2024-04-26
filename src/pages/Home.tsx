import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import axios from "axios";
import { Geolocation } from "@capacitor/geolocation";
import { useHistory } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from '@capacitor/push-notifications';
import {
  IonContent,
  IonListHeader,
  IonLabel,
  IonCard,
  IonText,
  IonIcon,
  IonGrid,
  IonRow,
  IonPage,
  IonItem,
  IonAccordionGroup,
  IonAccordion,
  IonButton,
} from "@ionic/react";

import { arrowForwardOutline, chevronForwardCircleOutline, handRightSharp } from "ionicons/icons";
import Header from "../components/Header";
import CurrentUserDetailsStore, { fetchCurrentUserDetails } from "../store/CurrentUserDataStore";
import "../pages/Styles.css";
import CreateUser from "../components/CreateUsers";
import OurClientsStore, { getClients } from "../store/ClientsStore";
import OurClients from "../components/Clients";
import LoadingClients from "../components/ClientsLoading";
import CreateClients from "../components/createClient";
import MyDocumentsStore, { getDocuments } from "../store/DocStore";
import DocumentPreview from "../components/DocPreview";
import { getApplications } from "../store/ApplicationsStore";
import { ApplicationHistory } from "../store/MyApplicationHistory";
import { AllApplications } from "../store/CurrentApplications";

const HomePage: React.FC = () => {
  const userId = useContext(AuthContext);
  const [iserror, setIserror] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  //history
  const history = useHistory();
  //check if push notifications is available
  const isPushNotificationsAvailable = Capacitor.isPluginAvailable("PushNotifications");
  //userData
  const userData = CurrentUserDetailsStore.useState<any>(s => s.currentUserDetails);
  //documents
  const documentsData = MyDocumentsStore.useState<any>(s => s.documents);
  //filter for user
  const userDocuments = documentsData.filter((document: any) => document.belongsTo === userId._id);

  useEffect(() => {
    //fetch user data and videos
    fetchCurrentUserDetails(userId._id);
    getClients(userId._id);
    getDocuments(userId._id);
    getApplications(userId._id);
    ApplicationHistory(userId._id);
    AllApplications(userId._id);
    //access user location
    userLocation();
    //notifications
    addListeners();
    registerNotifications();
    getDeliveredNotifications();
    //
    setIsLoading(false);
  }, []);
  //user location
  //use location ===
  const userLocation = async () => {
    // get the users current position
    const position = await Geolocation.getCurrentPosition();

    // grab latitude & longitude
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    console.log(latitude, longitude);
    if (!position) {
      //setMessage(error?.message);
      setMessage("Please allow access to your location permissions for better experience!");
      setIserror(true);
    } else {
      const locationData = {
        posted_by: userId._id,
        location: [latitude, longitude],
      };
      console.log(locationData);

      const api = axios.create({
        baseURL: `https://amtech-app-qas7x.ondigitalocean.app/api/users`,
      });
      api
        .post("/mylocation", locationData)
        .then((res) => {
          console.log("Location updated");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  //end of location

  //push notifications


  //push notifications ===

  const addListeners = async () => {
    if (isPushNotificationsAvailable) {
      await PushNotifications.addListener('registration', token => {
        console.info('Registration token: ', token.value);

        const deviceData = {
          userId: userId._id,
          deviceId: token.value,
        };

        const api = axios.create({
          baseURL: `https://amtech-app-qas7x.ondigitalocean.app/api/users`,
        });
        api
          .post("/device-data", deviceData)
          .then((res) => {
            console.log("Device data updated");
          })
          .catch((error) => {
            console.log(error);
          });
      });

      await PushNotifications.addListener('registrationError', err => {
        console.error('Registration error: ', err.error);
      });

      await PushNotifications.addListener('pushNotificationReceived', notification => {
        console.log('Push notification received: ', notification);
      });

      await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
        console.log('Push notification action performed', notification.actionId, notification.inputValue);
      });
    }
  }

  const registerNotifications = async () => {
    if (isPushNotificationsAvailable) {
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        throw new Error('User denied permissions!');
      }

      await PushNotifications.register();
    }
  }

  const getDeliveredNotifications = async () => {
    if (isPushNotificationsAvailable) {
      const notificationList = await PushNotifications.getDeliveredNotifications();
      console.log('delivered notifications', notificationList);
    }
  }

  //current user data
  const userDetails = CurrentUserDetailsStore.useState<any>(s => s.currentUserDetails);
  //clients data
  const availabaleClients = OurClientsStore.useState<any>(s => s.clients);


  //end of push notification actions
  return (
    <>
      <IonPage>
        <Header />
        <IonContent fullscreen>
          {userDetails.role === "admin" ?
            <>
              <CreateUser />

              <IonListHeader>
                <IonLabel><b>Our Clients - {availabaleClients?.length}</b></IonLabel>
              </IonListHeader>
              {isLoading ?
                <LoadingClients />
                :

                availabaleClients !== undefined ? (
                  availabaleClients.length > 0 ? (
                    availabaleClients.slice(0, 30).map((client: any, index: any) => (
                      <OurClients key={index}
                        userId={client?._id}
                        username={client?.username}
                        company={client?.company}
                        displayPhoto={"https://mbttpimkgallkklqbndt.supabase.co/storage/v1/object/public/biva-storage/" + client?.displayPhoto} />
                    ))
                  ) : (
                    <IonCard className="ion-padding">
                      <IonText><b>Your clients once added will appear here.</b></IonText>
                    </IonCard>
                  )
                ) : (
                  ""
                )}
            </>
            :
            <>
              <IonListHeader>
                <IonLabel color="primary"><b>Available Documents</b></IonLabel>
                {userDocuments.length > 6 ?
                  <IonLabel color="primary" onClick={(e) => {
                    e.preventDefault();
                    history.push("/user-docs");
                  }}><b>See More <IonIcon icon={arrowForwardOutline}></IonIcon></b></IonLabel>
                  :
                  ""}
              </IonListHeader>

              <IonGrid>
                <IonRow>
                  {
                    userDocuments !== undefined ? (
                      userDocuments.length > 0 ? (
                        userDocuments.slice(0, 6).map((document: any, index: any) => (
                          <DocumentPreview
                            docId={document._id}
                            title={document.title}
                            docUrl={"https://mbttpimkgallkklqbndt.supabase.co/storage/v1/object/public/biva-storage/" + document?.documentPath}
                          />
                        ))
                      ) : (
                        <IonCard className="ion-padding">
                          <IonText><b>You have no documents at the moment, check again later!</b></IonText>
                        </IonCard>
                      )
                    ) : (
                      ""
                    )}
                </IonRow>
              </IonGrid>
              <IonListHeader>
                <IonLabel color="primary"><b>Licenses</b></IonLabel>
              </IonListHeader>
              <IonAccordionGroup>
                <IonAccordion>
                  <IonItem slot="header">
                    <IonIcon icon={chevronForwardCircleOutline} size="large" color="primary">
                    </IonIcon>
                    <IonLabel className="ion-padding ion-text-wrap">
                      <h2><b>Transport of petroleum products(Except LPG) by Road</b></h2>
                    </IonLabel>
                  </IonItem>
                  <div className="ion-padding" slot="content">
                    <IonListHeader>
                      <IonLabel><b>Requirements</b></IonLabel>
                    </IonListHeader>
                    <p>1) CR12 from the Registrar of companies (should not be older than 1 year at the time of submission of the application. Further, if a Limited company appears as part of the shareholders, provide the company's CR12 plus all the Directors' IDs)</p>
                    <p>2) Certificate of Incorporation / Business Registration Certificate</p>
                    <p>3) Valid Tax Compliance Certificate from Kenya Revenue Authority</p>
                    <p>4) Legible Copies of Identification Documents i.e. IDs/Passports for all the Company directors</p>
                    <p>5) Single Business Permit to operate business from the respective County Government</p>
                    <p>6) A valid Motor Vehicle Inspection Certificate for each prime mover and trailer</p>
                    <p>7) Log book for each prime mover and trailer (Attach a valid lease agreement if vehicle not in the name of the applicant)</p>
                    <p>8)A list of vehicles; paired prime movers and trailers where necessary (In Microsoft Excel)</p>
                    <p>9)A valid calibration certificate for the tank mounted on each trailer</p>
                    <p>10)Fire Clearance Certificate for the vehicle(s) from the respective County Fire Department</p>
                    <p>11)Valid Work Permits Class “G” for all foreign directors working in Kenya (Foreign directors not resident in Kenya should provide a notarized declaration. Any employee given Powers of Attorney by a foreign director should provide a copy of their ID)</p>
                    <p>12)A summary Highway Emergency Response Plan from the applicant</p>
                    <IonButton expand="full"
                      shape="round"
                      onClick={(e) => {
                        e.preventDefault();
                        history.push("/license-application/" + "Transport of petroleum products(Except LPG) by Road", {
                          state: {
                            category: "transport", amount: 0, requirements: [
                              {
                                type: "CR12",
                                description: "CR12 from the Registrar of companies (should not be older than 1 year at the time of submission of the application"
                              },
                              {
                                type: "RegistrationCerticate",
                                description: "Certificate of Incorporation / Business Registration Certificate"
                              },
                              {
                                type: "TCC",
                                description: "Valid Tax Compliance Certificate from Kenya Revenue Authority"
                              },
                              {
                                type: "DirectorIDs",
                                description: "Legible Copies of Identification Documents i.e. IDs/Passports for all the Company directors"
                              },
                              {
                                type: "SBP",
                                description: "Single Business Permit to operate business from the respective County Government"
                              },
                              {
                                type: "InspectionReports",
                                description: "A valid Motor Vehicle Inspection Certificate for each prime mover and trailer"
                              },
                              {
                                type: "LogBooks&Lease",
                                description: "Log book for each prime mover and trailer (Attach a valid lease agreement if vehicle not in the name of the applicant)"
                              },
                              {
                                type: "ListOfvehicles",
                                description: "A list of vehicles; paired prime movers and trailers where necessary (In Microsoft Excel)"
                              },
                              {
                                type: "CalibrationReports",
                                description: "A valid calibration certificate for the tank mounted on each trailer"
                              },
                              {
                                type: "FireCertificates",
                                description: "Fire Clearance Certificate for the vehicle(s) from the respective County Fire Department"
                              },
                              {
                                type: "WorkPermitForForeigners",
                                description: "Valid Work Permits Class “G” for all foreign directors working in Kenya (Foreign directors not resident in Kenya should provide a notarized declaration. Any employee given Powers of Attorney by a foreign director should provide a copy of their ID)"
                              },
                              {
                                type: "EmergencyResponsePlan",
                                description: "A summary Highway Emergency Response Plan from the applicant"
                              },
                            ]


                          }
                        });
                      }}>Apply </IonButton>
                  </div>
                </IonAccordion>
                <IonAccordion>
                  <IonItem slot="header">
                    <IonIcon icon={chevronForwardCircleOutline} size="large" color="primary">
                    </IonIcon>
                    <IonLabel className="ion-padding ion-text-wrap">
                      <h2><b>Retail of LPG in Cylinders</b></h2>
                    </IonLabel>
                  </IonItem>
                  <div className="ion-padding" slot="content">
                    <IonListHeader>
                      <IonLabel><b>Requirements</b></IonLabel>
                    </IonListHeader>
                    <p>1) CR12 from the Registrar of companies (should not be older than 1 year at the time of submission of the application. Further, if a Limited company appears as part of the shareholders, provide the company's CR12 plus all the Directors' IDs)</p>
                    <p>2) Certificate of Incorporation / Business Registration Certificate</p>
                    <p>3) Valid Tax Compliance Certificate from Kenya Revenue Authority</p>
                    <p>4) Legible Copies of Identification Documents i.e. IDs/Passports for all the Company directors</p>
                    <p>5) Single Business Permit to operate business from the respective County Government</p>
                    <p>6) Proof of ownership of at least 5,000 cylinders of either 0.5,1,3,6 or 13kg or a written authority for distributorship of a particular brand from a licensed LPG cylinder brand owner;</p>
                    <p>7) Scanned original copy of a valid weighing scale calibration certificate from Weights and Measures department</p>
                    <p>8)Scanned original copy of a valid fire certificate for the premises from the County Government</p>
                    <p>9)Valid Work Permits Class “G” for all foreign directors working in Kenya (Foreign directors not resident in Kenya should provide a notarized declaration. Any employee given Powers of Attorney by a foreign director should provide a copy of their ID)</p>
                    <p>10)A colour photograph of the retail point clearly showing the cylinder holding cage and the neighbouring premises.</p>

                    <IonButton expand="full"
                      shape="round"
                      onClick={(e) => {
                        e.preventDefault();
                        history.push("/license-application/" + "Retail of LPG in Cylinders", {
                          state: {
                            category: "lpg-retail", amount: 0, requirements: [
                              {
                                type: "CR12",
                                description: "CR12 from the Registrar of companies (should not be older than 1 year at the time of submission of the application"
                              },
                              {
                                type: "RegistrationCerticate",
                                description: "Certificate of Incorporation / Business Registration Certificate"
                              },
                              {
                                type: "TCC",
                                description: "Valid Tax Compliance Certificate from Kenya Revenue Authority"
                              },
                              {
                                type: "DirectorIDs",
                                description: "Legible Copies of Identification Documents i.e. IDs/Passports for all the Company directors"
                              },
                              {
                                type: "SBP",
                                description: "Single Business Permit to operate business from the respective County Government"
                              },
                              {
                                type: "AuthorizationLetters",
                                description: "Proof of ownership of at least 5,000 cylinders of either 0.5,1,3,6 or 13kg or a written authority for distributorship of a particular brand from a licensed LPG cylinder brand owner;"
                              },
                              {
                                type: "Weights&MeasuresCertificate",
                                description: "Scanned original copy of a valid weighing scale calibration certificate from Weights and Measures department"
                              },
                              {
                                type: "FireCertificates",
                                description: "Scanned original copy of a valid fire certificate for the premises from the County Government"
                              },
                              {
                                type: "WorkPermitForForeigners",
                                description: "Valid Work Permits Class “G” for all foreign directors working in Kenya (Foreign directors not resident in Kenya should provide a notarized declaration. Any employee given Powers of Attorney by a foreign director should provide a copy of their ID)"
                              },
                              {
                                type: "PhotoOfCylinderCage",
                                description: "A colour photograph of the retail point clearly showing the cylinder holding cage and the neighbouring premises."
                              },
                            ]
                          }
                        });
                      }}>Apply </IonButton>
                  </div>
                </IonAccordion>
                <IonAccordion>
                  <IonItem slot="header">
                    <IonIcon icon={chevronForwardCircleOutline} size="large" color="primary">
                    </IonIcon>
                    <IonLabel className="ion-padding ion-text-wrap">
                      <h2><b>Retail of Petroleum Products (except LPG)
                      </b></h2>
                    </IonLabel>
                  </IonItem>
                  <div className="ion-padding" slot="content">
                    <IonListHeader>
                      <IonLabel><b>Requirements</b></IonLabel>
                    </IonListHeader>
                    <p>1) CR12 from the Registrar of companies (should not be older than 1 year at the time of submission of the application. Further, if a Limited company appears as part of the shareholders, provide the company's CR12 plus all the Directors' IDs)</p>
                    <p>2) Certificate of Incorporation / Business Registration Certificate</p>
                    <p>3) Valid Tax Compliance Certificate from Kenya Revenue Authority</p>
                    <p>4) Legible Copies of Identification Documents i.e. IDs/Passports for all the Company directors</p>
                    <p>5) Single Business Permit to operate business from the respective County Government</p>
                    <p>6) Fire Clearance Certificate for the facility from the respective County Fire Department</p>
                    <p>7) A valid copy of certificate of registration of work place from DOSHS</p>
                    <p>8)A valid certificate of calibration for the Underground Storage tank(s)</p>
                    <p>9)A pressure test report for the petroleum tanks and pipelines at the facility; (not older than 60 months)</p>
                    <p>10)Proof of land ownership (copy of title deed in the name of company/director(s)). In the case of long term land lease, copy of duly registered lease agreement in the name of the Applicant company plus the title deed of the land owner.</p>
                    <p>11)Certificate of Compliance with the Physical Planning Act 2019 (PPA5 or PPA2);</p>
                    <p>12)Valid Work Permits Class “G” for all foreign directors working in Kenya (Foreign directors not resident in Kenya should provide a notarized declaration. Any employee given Powers of Attorney by a foreign director should provide a copy of their ID)</p>
                    <p>13)Picture of the station captioning the frontage, canopy, and pumps</p>
                    <p>14)A summary Emergency Response Plan from the applicant.</p>
                    <p>15)A valid certificate of calibration of the petroleum dispensing units’ meters from the Department of Weights and Measures;</p>
                    <p>16)A valid Environmental Impact Assessment licence from NEMA for the facility;</p>

                    <IonButton expand="full"
                      shape="round"
                      onClick={(e) => {
                        e.preventDefault();
                        history.push("/license-application/" + "Retail of Petroleum Products (except LPG)", {
                          state: {
                            category: "lpg-retail-expt", amount: 0, requirements: [
                              {
                                type: "CR12",
                                description: "CR12 from the Registrar of companies (should not be older than 1 year at the time of submission of the application"
                              },
                              {
                                type: "RegistrationCerticate",
                                description: "Certificate of Incorporation / Business Registration Certificate"
                              },
                              {
                                type: "TCC",
                                description: "Valid Tax Compliance Certificate from Kenya Revenue Authority"
                              },
                              {
                                type: "DirectorIDs",
                                description: "Legible Copies of Identification Documents i.e. IDs/Passports for all the Company directors"
                              },
                              {
                                type: "SBP",
                                description: "Single Business Permit to operate business from the respective County Government"
                              },
                              {
                                type: "FireCertificates",
                                description: "Fire Clearance Certificate for the facility from the respective County Fire Department"
                              },

                              {
                                type: "CalibrationReports",
                                description: "A valid certificate of calibration for the Underground Storage tank(s)"
                              },
                              {
                                type: "PressureTests",
                                description: "A pressure test report for the petroleum tanks and pipelines at the facility; (not older than 60 months)"
                              },
                              {
                                type: "LandLeaseOrTitle",
                                description: "Proof of land ownership (copy of title deed in the name of company/director(s)). In the case of long term land lease, copy of duly registered lease agreement in the name of the Applicant company plus the title deed of the land owner."
                              },
                              {
                                type: "PhysicalPlanning",
                                description: "Certificate of Compliance with the Physical Planning Act 2019 (PPA5 or PPA2)"
                              },
                              {
                                type: "WorkPermitForForeigners",
                                description: "Valid Work Permits Class “G” for all foreign directors working in Kenya (Foreign directors not resident in Kenya should provide a notarized declaration. Any employee given Powers of Attorney by a foreign director should provide a copy of their ID)"
                              },
                              {
                                type: "PhotoOfStation",
                                description: "Picture of the station captioning the frontage, canopy, and pumps"
                              },
                              {
                                type: "EmergencyResponsePlan",
                                description: "A summary Emergency Response Plan from the applicant."
                              },
                              {
                                type: "CalibrationReportsOfDispensingUnits",
                                description: "A valid certificate of calibration of the petroleum dispensing units’ meters from the Department of Weights and Measures;"
                              },
                              {
                                type: "NEMA",
                                description: "A valid Environmental Impact Assessment licence from NEMA for the facility"
                              },

                            ]
                          }
                        });
                      }}>Apply </IonButton>
                  </div>
                </IonAccordion>
                <IonAccordion>
                  <IonItem slot="header">
                    <IonIcon icon={chevronForwardCircleOutline} size="large" color="primary">
                    </IonIcon>
                    <IonLabel className="ion-padding ion-text-wrap">
                      <h2><b>Export and Wholesale of Petroleum Products(Except LPG)
                      </b></h2>
                    </IonLabel>
                  </IonItem>
                  <div className="ion-padding" slot="content">
                    <IonListHeader>
                      <IonLabel><b>Requirements</b></IonLabel>
                    </IonListHeader>
                    <p>1) CR12 from the Registrar of companies (should not be older than 1 year at the time of submission of the application. Further, if a Limited company appears as part of the shareholders, provide the company's CR12 plus all the Directors' IDs)</p>
                    <p>2) Certificate of Incorporation / Business Registration Certificate</p>
                    <p>3) Valid Tax Compliance Certificate from Kenya Revenue Authority </p>
                    <p>4) Legible Copies of Identification Documents i.e. IDs/Passports for all the Company directors</p>
                    <p>5) Single Business Permit to operate business from the respective County Government</p>
                    <p>6) Valid Work Permits Class “G” for all foreign directors working in Kenya (Foreign directors not resident in Kenya should provide a notarized declaration. Any employee given Powers of Attorney by a foreign director should provide a copy of their ID)</p>

                    <IonButton expand="full"
                      shape="round" onClick={(e) => {
                        e.preventDefault();
                        history.push("/license-application/" + "Export and Wholesale of Petroleum Products(Except LPG)", {
                          state: {
                            category: "export-wholesale", amount: 0, requirements: [
                              {
                                type: "CR12",
                                description: "CR12 from the Registrar of companies (should not be older than 1 year at the time of submission of the application"
                              },
                              {
                                type: "RegistrationCerticate",
                                description: "Certificate of Incorporation / Business Registration Certificate"
                              },
                              {
                                type: "TCC",
                                description: "Valid Tax Compliance Certificate from Kenya Revenue Authority"
                              },
                              {
                                type: "DirectorIDs",
                                description: "Legible Copies of Identification Documents i.e. IDs/Passports for all the Company directors"
                              },
                              {
                                type: "SBP",
                                description: "Single Business Permit to operate business from the respective County Government"
                              },

                              {
                                type: "WorkPermitForForeigners",
                                description: "Valid Work Permits Class “G” for all foreign directors working in Kenya (Foreign directors not resident in Kenya should provide a notarized declaration. Any employee given Powers of Attorney by a foreign director should provide a copy of their ID)"
                              },
                            ]
                          }
                        });
                      }}>Apply </IonButton>
                  </div>
                </IonAccordion>
                <IonAccordion>
                  <IonItem slot="header">
                    <IonIcon icon={chevronForwardCircleOutline} size="large" color="primary">
                    </IonIcon>
                    <IonLabel className="ion-padding ion-text-wrap">
                      <h2><b>Driver Certification / Driver License
                      </b></h2>
                    </IonLabel>
                  </IonItem>
                  <div className="ion-padding" slot="content">
                    <IonListHeader>
                      <IonLabel><b>Requirements</b></IonLabel>
                    </IonListHeader>
                    <p>1) Scanned original copies of Identification documents (IDs or Passports) for the driver</p>
                    <p>2) Valid Certification of Fitness for Drivers from Designated Health Practitioner(DOSHS approved Doctors)</p>
                    <p>3) A valid driving licence for each driver </p>
                    <p>4) Certificate of Good Conduct</p>
                    <p>5) Passport size photo of the driver</p>
                    <p>6) Proof of training on defensive driving from a National Industrial Training Authority approved driving school.      </p>

                    <IonButton expand="full"
                      shape="round" onClick={(e) => {
                        e.preventDefault();
                        history.push("/license-application/" + "Driver Certification - Driver License", {
                          state: {
                            category: "drivers", amount: 0, requirements: [
                              {
                                type: "ID",
                                description: "Scanned original copies of Identification documents (IDs or Passports)"
                              },
                              {
                                type: "FitnessLetter",
                                description: "Valid Certification of Fitness for Drivers from Designated Health Practitioner(DOSHS approved Doctors)"
                              },
                              {
                                type: "DL",
                                description: "A valid driving licence for each driver"
                              },

                              {
                                type: "GoodConductCertificate",
                                description: "Certificate of Good Conduct"
                              },
                              {
                                type: "DefensiveDrivingCertificate",
                                description: "Proof of training on defensive driving from a National Industrial Training Authority approved driving school."
                              },
                              {
                                type: "PassportPhoto",
                                description: "Passport size photo of the driver"
                              },
                            ]
                          }
                        });
                      }}>Apply </IonButton>
                  </div>
                </IonAccordion>
              </IonAccordionGroup>


            </>
          }

        </IonContent>

        {userData.role === "admin" ? <CreateClients /> : ""}
      </IonPage>
    </>
  );
};

export default HomePage;
