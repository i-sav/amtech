import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import axios from "axios";
import supabase from "../supabase-client";
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
  IonCol,
  IonPopover,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
} from "@ionic/react";

import { arrowForwardOutline, checkmarkCircleOutline, checkmarkDoneCircleOutline, chevronForwardCircleOutline, documentAttachOutline, downloadOutline, personCircleOutline } from "ionicons/icons";
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
import MyApplicationsStore, { getApplications } from "../store/ApplicationsStore";
import CurrentApplicationsStore, { AllApplications } from "../store/CurrentApplications";
import UserApplicationsStore, { getUserApplications } from "../store/UserApplicationsStore";
import ButtonProgress from "../components/ButtonProgress";

const HomePage: React.FC = () => {
  const userId = useContext(AuthContext);
  const [iserror, setIserror] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");

  //modal data
  const [applicationTitle, setApplicationTitle] = useState<string>("");
  const [applicationCategory, setApplicationCategory] = useState<string>("");
  const [amount, setAmount] = useState<Number>();
  const [requirements, setRequirements] = useState<any>([]);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [progress, setProgress] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  //file states
  const [filePath, setFilePath] = useState<string>("");
  const [activeFile, setActiveFile] = useState<string>("");
  const [blobState, setBlobState] = useState<any>();
  const [types, setTypes] = useState<any>([]);
  //
  //history
  const history = useHistory();
  //check if push notifications is available
  const isPushNotificationsAvailable = Capacitor.isPluginAvailable("PushNotifications");

  //end of modal data


  //use effect when page loads ====
  useEffect(() => {
    //fetch user data
    fetchCurrentUserDetails(userId._id);
    //get clients
    getClients(userId._id);
    //get documents
    getDocuments(userId._id);
    //get applications for user
    getApplications(userId._id);
    //get all application history
    getUserApplications(userId._id);
    //get all applications for admins
    AllApplications(userId._id);
    //access user location
    userLocation();
    //push notifications
    addListeners();
    registerNotifications();
    getDeliveredNotifications();
    //
    setIsLoading(false);
  }, []);
  //end of user effect ==============

  //userData
  const userData = CurrentUserDetailsStore.useState<any>(s => s.currentUserDetails);
  //documents
  const documentsData = MyDocumentsStore.useState<any>(s => s.documents);
  //filter for user
  const userDocuments = documentsData.filter((document: any) => document.belongsTo === userId._id);
  //applications
  // for admins
  const currentApplications = CurrentApplicationsStore.useState<any>(s => s.currentApplications);
  //application history for users
  const userHistory = UserApplicationsStore.useState<any>(s => s.applications);

  //user location
  //use location ===
  const userLocation = async () => {
    // get the users current position
    const position = await Geolocation.getCurrentPosition();

    // grab latitude & longitude
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    //console.log(latitude, longitude);
    if (!position) {
      //setMessage(error?.message);
      setMessage("Please allow access to your location permissions for better experience!");
      setIserror(true);
    } else {
      const locationData = {
        posted_by: userId._id,
        location: [latitude, longitude],
      };
      //console.log(locationData);

      const api = axios.create({
        baseURL: `https://amtech-app-ya67p.ondigitalocean.app/api/users`,
      });
      api
        .post("/mylocation", locationData)
        .then((res) => {
          //console.log("Location updated");
        })
        .catch((error) => {
          //console.log(error);
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
          baseURL: `https://amtech-app-ya67p.ondigitalocean.app/api/users`,
        });
        api
          .post("/device-data", deviceData)
          .then((res) => {
            //console.log("Device data updated");
          })
          .catch((error) => {
            //console.log(error);
          });
      });

      await PushNotifications.addListener('registrationError', err => {
        //console.error('Registration error: ', err.error);
      });

      await PushNotifications.addListener('pushNotificationReceived', notification => {
        //console.log('Push notification received: ', notification);
      });

      await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
        //console.log('Push notification action performed', notification.actionId, notification.inputValue);
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
      // console.log('delivered notifications', notificationList);
    }
  }

  //current user data
  const userDetails = CurrentUserDetailsStore.useState<any>(s => s.currentUserDetails);
  //clients data
  const availabaleClients = OurClientsStore.useState<any>(s => s.clients);


  //application processing ====
  const applications = MyApplicationsStore.useState<any>(s => s.applications);
  const thisApplication = applications.filter((currentApplication: any) => currentApplication?.licenseCategory === applicationCategory);
  console.log(thisApplication);
  //console.log(requirements);
  const documentsUploaded = thisApplication[0]?.documents;
  //end of required
  //loop through already upload files and add to types
  documentsUploaded?.forEach((document: any) => {
    const documentType = document.documentType;
    // console.log(documentType);
    types.push(documentType);

  });


  //const open dialog
  const openFileDialog = (active: any) => {
    (document as any).getElementById("file-upload").click();
    setActiveFile(`${active}`);
  }
  //set Image
  const setFile = (_event: any) => {
    let file = _event.target.files[0];
    //console.log(file);
    //const selectedFilePath = file?.path;
    const selectedFilePath = file?.name;
    setFilePath(selectedFilePath as string);
    setBlobState(file);
  }

  //upload document logic
  const handleDocumentUpload = async (filePath: any, blobState: any) => {

    //handle upload
    if (filePath == "") {
      setMessage("Please select the document to upload");
      setIserror(true);
      return;
    }
    //upload timestamp
    const currentTime = new Date().getTime();
    //path
    const filename = filePath.substr(filePath.lastIndexOf("/") + 1);

    setProgress(true);
    //console.log(blobState);
    const { data, error } = await supabase.storage
      .from("biva-storage")
      .upload(`docs/${currentTime + filename}`, blobState, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      //setMessage(error?.message);
      setMessage("An error occured while uploading your document. Please try again!");
      setIserror(true);
      setProgress(false);
    } else {
      //console.log(data);
      //push file to uploaded types
      setTypes([...types, activeFile]);
      //process data
      const DocumentData = {
        documentUrl: data?.path,
        applicationBy: userId,
        category: applicationCategory,
        amountPaid: amount,
        documentType: activeFile,

      };

      const api = axios.create({
        baseURL: `https://amtech-app-ya67p.ondigitalocean.app/api/users`,
      });
      api
        .post("/apply-license", DocumentData)
        .then((res) => {
          //getApplications(userId);
          setMessage("Document has been uploaded. Upload other required documents and finish your application");
          setIserror(true);
          setProgress(false);
          setFilePath("");
          setActiveFile("");
        })
        .catch((error) => {
          setMessage(error);
          setIserror(true);
        });
    }
  };
  //submit and finish application
  const SubmitApplication = async () => {
    console.log(" --- Submitting Application˝ ----");

    const applicationData = {
      applicationId: thisApplication[0]._id,
    }
    console.log(applicationData);
    setSubmitting(true);
    const api = axios.create({
      baseURL: `https://amtech-app-ya67p.ondigitalocean.app/api/users`,
    });
    api
      .post("/submit-license-application", applicationData)
      .then((res) => {
        //getApplications(userId);
        setMessage("Application submitted successfully!");
        setIserror(true);
        setSubmitting(false);
        setFilePath("");
        setActiveFile("");
        setIsApplicationOpen(false);
      })
      .catch((error) => {
        setMessage(error);
        setIserror(true);
      });
  }

  //end of application =====


  //end of push notification actions
  return (
    <>
      <IonPage>
        <Header />
        <IonContent fullscreen>
          {userDetails.role === "admin" ?
            <>
              <IonGrid>
                <IonRow>
                  <IonCol size="3">
                    <IonListHeader>
                      <IonLabel><b>Create User(s)</b></IonLabel>
                    </IonListHeader>
                    <IonCard>
                      <CreateUser />
                    </IonCard>
                  </IonCol>
                  <IonCol size="5">
                    <IonListHeader>
                      <IonLabel><b>Our Clients - {availabaleClients?.length}</b></IonLabel>
                    </IonListHeader>
                    <IonCard className="ion-padding">
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
                    </IonCard>
                  </IonCol>
                  <IonCol size="4">
                    <IonListHeader>
                      <IonLabel><b>Current Applications</b></IonLabel>
                    </IonListHeader>
                    {
                      currentApplications !== undefined ? (
                        currentApplications.length > 0 ? (
                          currentApplications.slice(0, 60).map((application: any, index: any) => (

                            <>
                              <IonCard className="ion-padding" key={index}>
                                <IonAccordionGroup>
                                  <IonItem lines="none" onClick={(e) => {
                                    e.preventDefault();
                                    history.push("/client-profile/" + `${application?.applicationDetails[0]?._id}`, { state: application?.applicationDetails[0] });
                                  }}>
                                    <IonIcon size="large" slot="start" color="primary" icon={personCircleOutline}></IonIcon>
                                    <IonLabel>
                                      <h2><b>Application By: {application?.applicationDetails[0]?.username}</b></h2>
                                      <p><b>Visit Profile</b> <IonIcon icon={arrowForwardOutline}></IonIcon></p>
                                    </IonLabel>
                                  </IonItem>

                                  <IonAccordion>
                                    <IonItem slot="header">
                                      <IonLabel>
                                        <p>Status: <b>{application?.status}</b></p>
                                        <p>Category: <b>{application?.licenseCategory}</b></p>
                                        <p>Documents: <b>{application?.documents?.length}</b></p>

                                        {/* <p>Date Applied: {new Date(application?.dateapplied)}</p> */}
                                      </IonLabel>
                                    </IonItem>
                                    <div className="ion-padding" slot="content">
                                      <p><b>Attached Documents:</b></p>
                                      <IonRow>
                                        {application?.documents?.map((doc: any, index: any) => (
                                          <IonCol key={index} size="3" onClick={() => window.open("https://mbttpimkgallkklqbndt.supabase.co/storage/v1/object/public/biva-storage/" + doc?.documentUrl)}>
                                            <p>{doc?.documentType} <IonIcon color="primary" icon={downloadOutline}></IonIcon></p>
                                          </IonCol>
                                        ))}
                                      </IonRow>
                                    </div>
                                  </IonAccordion>
                                </IonAccordionGroup>
                              </IonCard>
                            </>
                          ))
                        ) : (
                          <IonCard className="ion-padding">
                            <IonText><b>You have no applications at the moment, check again later!</b></IonText>
                          </IonCard>
                        )
                      ) : (
                        ""
                      )}
                  </IonCol>
                </IonRow>
              </IonGrid>

            </>
            :
            <>
              <IonGrid>
                <IonRow>
                  <IonCol size="3">
                    <IonListHeader>
                      <IonLabel><b>Available Documents</b></IonLabel>
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
                                  key={index}
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
                  </IonCol>
                  <IonCol size="6">
                    <IonListHeader>
                      <IonLabel><b>Licenses</b></IonLabel>
                    </IonListHeader>

                    <IonItem>
                      <IonIcon icon={chevronForwardCircleOutline} size="large" color="primary">
                      </IonIcon>
                      <IonLabel className="ion-padding ion-text-wrap">
                        <h2><b>Transport of petroleum products(Except LPG) by Road</b></h2>
                        <p id="click-transport"><b>Check out the Requirements</b> <IonIcon icon={arrowForwardOutline}></IonIcon></p>
                      </IonLabel>
                      <IonButton shape="round" onClick={() => {
                        setIsApplicationOpen(true);
                        setApplicationTitle("Transport of petroleum products(Except LPG) by Road");
                        setApplicationCategory("transport");
                        setAmount(0);
                        setRequirements([
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
                        ])
                      }}>Apply Now</IonButton>
                    </IonItem>
                    <IonPopover trigger="click-transport" triggerAction="click" side="bottom" alignment="center" size="cover">
                      <IonContent class="ion-padding">
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
                      </IonContent>
                    </IonPopover>


                    <IonItem>
                      <IonIcon icon={chevronForwardCircleOutline} size="large" color="primary">
                      </IonIcon>
                      <IonLabel className="ion-padding ion-text-wrap">
                        <h2><b>Retail of LPG in Cylinders</b></h2>

                        <p id="click-LPG"><b>Check out the Requirements</b> <IonIcon icon={arrowForwardOutline}></IonIcon></p>
                      </IonLabel>
                      <IonButton shape="round" onClick={() => {
                        setIsApplicationOpen(true);
                        setApplicationTitle("Retail of LPG in Cylinders");
                        setApplicationCategory("lpg-retail");
                        setAmount(0);
                        setRequirements([
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
                        ])
                      }}>Apply Now</IonButton>
                    </IonItem>
                    <IonPopover trigger="click-LPG" triggerAction="click" side="bottom" alignment="center" size="cover">
                      <IonContent class="ion-padding">
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
                      </IonContent>
                    </IonPopover>

                    <IonItem>
                      <IonIcon icon={chevronForwardCircleOutline} size="large" color="primary">
                      </IonIcon>
                      <IonLabel className="ion-padding ion-text-wrap">
                        <h2><b>Retail of Petroleum Products (except LPG)
                        </b></h2>
                        <p id="retail"><b>Check out the Requirements</b> <IonIcon icon={arrowForwardOutline}></IonIcon></p>
                      </IonLabel>
                      <IonButton shape="round" onClick={() => {
                        setIsApplicationOpen(true);
                        setApplicationTitle("Retail of Petroleum Products (except LPG)");
                        setApplicationCategory("lpg-retail-expt");
                        setAmount(0);
                        setRequirements([
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

                        ])
                      }}>Apply Now</IonButton>
                    </IonItem>
                    <IonPopover trigger="retail" triggerAction="click" side="bottom" alignment="center" size="cover">
                      <IonContent class="ion-padding">
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
                      </IonContent>
                    </IonPopover>

                    <IonItem>
                      <IonIcon icon={chevronForwardCircleOutline} size="large" color="primary">
                      </IonIcon>
                      <IonLabel className="ion-padding ion-text-wrap">
                        <h2><b>Export and Wholesale of Petroleum Products(Except LPG)
                        </b></h2>
                        <p id="export"><b>Check out the Requirements</b> <IonIcon icon={arrowForwardOutline}></IonIcon></p>
                      </IonLabel>
                      <IonButton shape="round" onClick={() => {
                        setIsApplicationOpen(true);
                        setApplicationTitle("Export and Wholesale of Petroleum Products(Except LPG)");
                        setApplicationCategory("export-wholesale");
                        setAmount(0);
                        setRequirements([
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
                        ])
                      }}>Apply Now</IonButton>
                    </IonItem>
                    <IonPopover trigger="export" triggerAction="click" side="bottom" alignment="center" size="cover">
                      <IonContent class="ion-padding">
                        <IonListHeader>
                          <IonLabel><b>Requirements</b></IonLabel>
                        </IonListHeader>
                        <p>1) CR12 from the Registrar of companies (should not be older than 1 year at the time of submission of the application. Further, if a Limited company appears as part of the shareholders, provide the company's CR12 plus all the Directors' IDs)</p>
                        <p>2) Certificate of Incorporation / Business Registration Certificate</p>
                        <p>3) Valid Tax Compliance Certificate from Kenya Revenue Authority </p>
                        <p>4) Legible Copies of Identification Documents i.e. IDs/Passports for all the Company directors</p>
                        <p>5) Single Business Permit to operate business from the respective County Government</p>
                        <p>6) Valid Work Permits Class “G” for all foreign directors working in Kenya (Foreign directors not resident in Kenya should provide a notarized declaration. Any employee given Powers of Attorney by a foreign director should provide a copy of their ID)</p>
                      </IonContent></IonPopover>

                    <IonItem>
                      <IonIcon icon={chevronForwardCircleOutline} size="large" color="primary">
                      </IonIcon>
                      <IonLabel className="ion-padding ion-text-wrap">
                        <h2><b>Driver Certification / Driver License
                        </b></h2>
                        <p id="driver"><b>Check out the Requirements</b> <IonIcon icon={arrowForwardOutline}></IonIcon></p>
                      </IonLabel>
                      <IonButton shape="round" onClick={() => {
                        setIsApplicationOpen(true);
                        setApplicationTitle("Driver Certification - Driver License");
                        setApplicationCategory("drivers");
                        setAmount(0);
                        setRequirements([
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
                        ])
                      }}>Apply Now</IonButton>
                    </IonItem>
                    <IonPopover trigger="driver" triggerAction="click" side="bottom" alignment="center" size="cover">
                      <IonContent class="ion-padding">
                        <IonListHeader>
                          <IonLabel><b>Requirements</b></IonLabel>
                        </IonListHeader>
                        <p>1) Scanned original copies of Identification documents (IDs or Passports) for the driver</p>
                        <p>2) Valid Certification of Fitness for Drivers from Designated Health Practitioner(DOSHS approved Doctors)</p>
                        <p>3) A valid driving licence for each driver </p>
                        <p>4) Certificate of Good Conduct</p>
                        <p>5) Passport size photo of the driver</p>
                        <p>6) Proof of training on defensive driving from a National Industrial Training Authority approved driving school.      </p>
                      </IonContent></IonPopover>

                  </IonCol>
                  <IonCol size="3">
                    <IonListHeader>
                      <IonLabel><b>My Application History</b></IonLabel>
                    </IonListHeader>

                    {
                      userHistory !== undefined ? (
                        userHistory.length > 0 ? (
                          userHistory.slice(0, 60).map((application: any, index: any) => (
                            <>
                              <IonCard className="ion-padding" key={index}>
                                <IonAccordionGroup>
                                  <IonAccordion>
                                    <IonItem slot="header">
                                      <IonIcon size="large" slot="start" color="primary" icon={checkmarkCircleOutline}></IonIcon>
                                      <IonLabel>
                                        <p>Status: <b>{application?.status}</b></p>
                                        <p>Category: <b>{application?.licenseCategory}</b></p>
                                        <p>Documents: <b>{application?.documents?.length}</b></p>
                                      </IonLabel>
                                    </IonItem>
                                    <div className="ion-padding" slot="content">
                                      <p><b>Attached Documents:</b></p>
                                      <IonRow>
                                        {application?.documents?.map((doc: any, index: any) => (
                                          <IonCol key={index} size="3" onClick={() => window.open("https://mbttpimkgallkklqbndt.supabase.co/storage/v1/object/public/biva-storage/" + doc?.documentUrl)}>
                                            <p>{doc?.documentType} <IonIcon color="primary" icon={downloadOutline}></IonIcon></p>
                                          </IonCol>
                                        ))}
                                      </IonRow>
                                    </div>
                                  </IonAccordion>
                                </IonAccordionGroup>
                              </IonCard>
                            </>
                          ))
                        ) : (
                          <IonCard className="ion-padding">
                            <IonText><b>You have no applications at the moment, check again later!</b></IonText>
                          </IonCard>
                        )
                      ) : (
                        ""
                      )}

                  </IonCol>


                </IonRow>
              </IonGrid>


            </>
          }

          {/* //application modal */}

          <IonModal isOpen={isApplicationOpen}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>{applicationTitle}</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setIsApplicationOpen(false)}>Close</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">

              {filePath ? <p className="ion-text-center">{filePath}</p> : ""}
              {progress ? <ButtonProgress /> : ""}
              {requirements?.map((requirement: any, index: any) => (

                types?.includes(`${requirement?.type}`) ?
                  <IonItem>
                    <IonLabel className="ion-text-wrap">
                      <p>{requirement?.description}</p>
                      <br />
                    </IonLabel>
                    <IonIcon id="documentSelector" slot="end" size="large" color="primary" icon={checkmarkDoneCircleOutline}></IonIcon>

                  </IonItem>
                  :
                  <IonItem>
                    <IonLabel className="ion-text-wrap">
                      <p onClick={() => openFileDialog(`${requirement?.type}`)}>{requirement?.description}</p>
                      <br />
                      {activeFile === `${requirement?.type}` ? <IonButton
                        id="signUpButton"
                        expand="block"
                        size="small"
                        fill="outline"
                        onClick={() => handleDocumentUpload(filePath, blobState)}
                      >
                        Upload
                      </IonButton> : ""}
                    </IonLabel>
                    <IonIcon id="documentSelector" slot="end" size="large" color="primary" icon={documentAttachOutline} onClick={() => openFileDialog(`${requirement?.type}`)}></IonIcon>

                  </IonItem>
              ))}



              <div style={{ display: "none" }}>
                <input id="file-upload" type="file" onChange={setFile} />
              </div>
              <br />

              {submitting ? <ButtonProgress /> : ""}
              <IonButton
                id="signUpButton"
                color="dark"
                expand="full"
                shape="round"
                onClick={() => SubmitApplication()}
              >
                Finish & Submit Application
                <IonIcon icon={arrowForwardOutline}></IonIcon>
              </IonButton>
            </IonContent>
          </IonModal>

        </IonContent>

        {/* {userData.role === "admin" ? <CreateClients /> : ""} */}
      </IonPage >
    </>
  );
};

export default HomePage;
