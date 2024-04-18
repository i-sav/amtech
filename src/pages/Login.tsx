import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { parseISO, format } from "date-fns";
import {
  IonPage,
  IonContent,
  IonButton,
  IonLabel,
  IonItem,
  IonItemGroup,
  IonInput,
  IonToast,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonImg,
  IonListHeader,
} from "@ionic/react";
import { arrowBackOutline, arrowForwardSharp, eyeOutline } from "ionicons/icons";
import ButtonProgress from "../components/ButtonProgress";
import "./LogIn.css";


//validating email
function validateEmail(email: string) {
  // eslint-disable-next-line
  const re =
    /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
  return re.test(String(email).toLowerCase());
}

const LogIn: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [progress, setProgress] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRegisterPassword, setShowRegisterPassword] =
    useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState(false);

  //Register user states

  const [username, setUsername] = useState<string>("");
  const [registerEmail, setRegisterEmail] = useState<string>("");
  const [tel, setTel] = useState<string>("");
  const [registerPassword, setRegisterPassword] = useState<string>("");
  const [cPassword, setCpassword] = useState<string>("");
  //const [datePopOver, setDatePopOver] = useState<string>("");


  //----

  //Reset password states
  const [findAccountEmail, setAccountEmail] = useState<string>("");
  const [newAccountPassword, setNewAccountPassword] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [confirmNewAccountPassword, setConfirmNewAccountPassword] = useState<string>("");
  const [isAccountRegistered, setIsAccountRegistered] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [isFindingAccount, setIsFindingAccount] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  //end of reset password states


  //login logic -------------------
  const handleLogin = () => {
    if (!email) {
      setMessage("Please enter a valid email");
      setIserror(true);
      return;
    }
    if (validateEmail(email) === false) {
      setMessage("Your email is invalid");
      setIserror(true);
      return;
    }

    if (!password || password.length < 6) {
      setMessage("Please enter a valid password");
      setIserror(true);
      return;
    }

    const loginData = {
      email: email,
      password: password,
    };
    setProgress(true);
    const api = axios.create({
      baseURL: `https://amtech-app-qas7x.ondigitalocean.app/api/auth`,
    });
    api
      .post("/login", loginData)
      .then((res) => {
        setProgress(false);
        localStorage.setItem("AM-Tkn", JSON.stringify(res.data));
        setMessage("Welcome...");
        setIserror(true);
        //history.push("/home");
        window.history.replaceState({}, "Home", "/home");
        document.location.reload();
      })
      .catch((error) => {
        setProgress(false);
        setMessage("LogIn failed, check your email & password and try again.");
        setIserror(true);
      });
  };

  //format date
  const formatdate = (value: string) => {
    return format(parseISO(value), "MMM dd yyyy ");
  };

  //register logic ----------------
  const handleRegister = () => {
    if (!username || username.length < 3) {
      setMessage("Enter a valid Username");
      setIserror(true);
      return;
    }
    if (!registerEmail) {
      setMessage("Please enter your email");
      setIserror(true);
      return;
    }
    if (!tel) {
      setMessage("Please enter your phone number");
      setIserror(true);
      return;
    }
    if (validateEmail(registerEmail) === false) {
      setMessage("Your email is invalid");
      setIserror(true);
      return;
    }

    if (!registerPassword || registerPassword.length < 6) {
      setMessage("Password must be at least 6 characters long");
      setIserror(true);
      return;
    }

    if (registerPassword !== cPassword) {
      setMessage("Please confirm your password");
      setIserror(true);
      return;
    }

    const RegisterData = {
      username: username,
      email: registerEmail,
      tel: tel,
      password: registerPassword,
    };
    setProgress(true);
    const api = axios.create({
      baseURL: `https://amtech-app-qas7x.ondigitalocean.app/api/auth`,
    });
    api
      .post("/register", RegisterData)
      .then((res) => {
        setProgress(false);
        setMessage("Your Registration is successful, please LogIn to proceed ");
        setIserror(true);
        setShowModal(false);

        //Reload to login
        function proceedToLogIn() {
          //history.push("/login");
          window.history.replaceState({}, "Log In", "/login");
          document.location.reload();
        }
        setTimeout(proceedToLogIn, 4000);
        // --------------
      })
      .catch((error) => {
        setProgress(false);
        setMessage("Registration failed. Please try again.");
        //setMessage(error);
        setIserror(true);
      });
  };

  //
  //handle find account logic
  const findUserAccount = () => {
    if (!findAccountEmail) {
      setMessage("Please enter your account's email");
      setIserror(true);
      return;
    }
    if (validateEmail(findAccountEmail) === false) {
      setMessage("Your account email is invalid. Try again!");
      setIserror(true);
      return;
    }

    const findAccountData = {
      emailToFind: findAccountEmail,
    };

    setIsFindingAccount(true);
    const api = axios.create({
      baseURL: `https://amtech-app-qas7x.ondigitalocean.app/api/auth`,
    });
    api
      .post("/find-account-with-email", findAccountData)
      .then((res) => {
        setIsFindingAccount(false);
        //console.log(res);
        if (res.data === "Found!") {
          setMessage("Please enter verification code sent to your email and your new password");
          setIserror(true);
          setIsAccountRegistered(true);
        }
      })
      .catch((error) => {
        setIsFindingAccount(false);
        setMessage("We could not find you account, try again");
        //setMessage(error);
        setIserror(true);
      });

  }
  //

  //handle reset password logic
  const handleResetPassword = () => {
    if (!verificationCode) {
      setMessage("Please enter verification code sent to your email");
      setIserror(true);
      return;
    }
    if (!newAccountPassword) {
      setMessage("Please enter your new password");
      setIserror(true);
      return;
    }

    if (!newAccountPassword || newAccountPassword.length < 6) {
      setMessage("Password must be at least 6 characters");
      setIserror(true);
      return;
    }

    if (newAccountPassword !== confirmNewAccountPassword) {
      setMessage("Please confirm your new password");
      setIserror(true);
      return;
    }

    const ResetPasswordData = {
      verificationCode: verificationCode,
      email: findAccountEmail,
      newPassword: newAccountPassword,
    };

    setIsResetting(true);
    const api = axios.create({
      baseURL: `https://amtech-app-qas7x.ondigitalocean.app/api/auth`,
    });
    api
      .post("/reset-password", ResetPasswordData)
      .then((res) => {

        setIsResetting(false);
        //Reload to login
        function proceedToLogIn() {
          //history.push("/login");
          window.history.replaceState({}, "Log In", "/login");
          document.location.reload();
        }

        if (res.data === "PassUpdated!") {
          setMessage("Password has been reset successfully, LogIn with your new password");
          setIserror(true);
          setTimeout(proceedToLogIn, 3000);
          // --------------
        }

      })
      .catch((error) => {
        setIsResetting(false);
        setMessage("Account password reset failed. Please try again.");
        //setMessage(error);
        setIserror(true);
      });
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonItemGroup id="login" className="ion-padding">
          <IonImg style={{ width: "100%", height: "120px" }} src="assets/images/Logo.png"></IonImg>
          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput
              type="email"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
            ></IonInput>
          </IonItem>
          <br />
          <IonItem>
            <IonLabel position="floating">Password</IonLabel>
            <IonInput
              type={showPassword ? "text" : "password"}
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
            ></IonInput>
            <IonIcon
              id="eye"
              slot="end"
              icon={eyeOutline}
              onClick={(e) => setShowPassword(true)}
            ></IonIcon>
          </IonItem>
          {progress ? <ButtonProgress /> : ""}
          <IonButton expand="full" shape="round" onClick={handleLogin}>
            Log In
            <IonIcon icon={arrowForwardSharp} slot="end"></IonIcon>
          </IonButton>

          <p className="ion-text-center" onClick={() => setShowModal(true)}>
            Don't have an account? <b>Register</b>
          </p>
          <p className="ion-text-center" onClick={() => setShowResetModal(true)}>
            Forgot Password? <b>Reset</b>
          </p>
        </IonItemGroup>

        {/* Register Modal */}

        <IonModal isOpen={showModal}>
          <IonPage>
            <IonHeader>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonButton onClick={() => setShowModal(false)}>
                    <IonIcon
                      size="large"
                      color="primary"
                      icon={arrowBackOutline}
                    ></IonIcon>{" "}
                  </IonButton>
                </IonButtons>
                <IonButtons slot="end">
                  <IonButton color="primary" size="small" shape="round" fill="outline" onClick={() => setShowModal(false)}>Cancel</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
              <IonItemGroup id="signup" className="ion-padding">
                <IonImg style={{ width: "100%", height: "120px" }} src="assets/images/Logo.png"></IonImg>
                <IonItem>
                  <IonLabel position="floating">Full Name</IonLabel>
                  <IonInput
                    className="ion-padding"
                    type="text"
                    value={username}
                    onIonChange={(e) => setUsername(e.detail.value!)}
                  ></IonInput>
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Email</IonLabel>
                  <IonInput
                    className="ion-padding"
                    type="email"
                    value={registerEmail}
                    onIonChange={(e) => setRegisterEmail(e.detail.value!)}
                  ></IonInput>
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Tel</IonLabel>
                  <IonInput
                    className="ion-padding"
                    placeholder="07XXXXXXXX"
                    type="text"
                    value={tel}
                    onIonChange={(e) => setTel(e.detail.value!)}
                  ></IonInput>
                </IonItem>

                <IonItem>
                  <IonLabel position="floating">Password</IonLabel>
                  <IonInput
                    className="ion-padding"
                    type={showRegisterPassword ? "text" : "password"}
                    value={registerPassword}
                    onIonChange={(e) => setRegisterPassword(e.detail.value!)}
                  ></IonInput>
                  <IonIcon
                    id="eye"
                    slot="end"
                    icon={eyeOutline}
                    onClick={(e) => setShowRegisterPassword(true)}
                  ></IonIcon>
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Confirm Password</IonLabel>
                  <IonInput
                    className="ion-padding"
                    type="password"
                    value={cPassword}
                    onIonChange={(e) => setCpassword(e.detail.value!)}
                  ></IonInput>
                </IonItem>
                {progress ? <ButtonProgress /> : ""}
                <IonButton
                  id="signUpButton"
                  expand="full"
                  shape="round"
                  onClick={handleRegister}
                >
                  Register Now
                </IonButton>

                <p className="ion-text-center" onClick={() => setShowModal(false)}>
                  Already Registered? <b>Login</b>
                </p>
                <p className="ion-text-center" onClick={() => setShowTermsModal(true)}>
                  By registering, you agree to our<b> Terms & Conditions</b>
                </p>
              </IonItemGroup>
            </IonContent>
          </IonPage>
        </IonModal>

        {/* Reset password Modal */}

        <IonModal isOpen={showResetModal}>
          <IonPage>
            <IonHeader>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonButton onClick={() => setShowResetModal(false)}>
                    <IonIcon
                      size="large"
                      color="primary"
                      icon={arrowBackOutline}
                    ></IonIcon>{" "}
                  </IonButton>
                </IonButtons>
                <IonButtons slot="end">
                  <IonButton color="primary" size="small" shape="round" fill="outline" onClick={() => setShowResetModal(false)}>Cancel</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
              <IonItemGroup id="signup" className="ion-padding">
                <IonImg style={{ width: "100%", height: "100px" }} src="assets/images/Logo.png"></IonImg>
                <h4 className="ion-text-center ion-padding">Reset your password</h4>
                <IonItem>
                  <IonLabel position="floating">Enter your account's email</IonLabel>
                  <IonInput
                    className="ion-padding"
                    type="email"
                    value={findAccountEmail}
                    onIonChange={(e) => setAccountEmail(e.detail.value!)}
                  ></IonInput>
                </IonItem>
                {isFindingAccount ? <ButtonProgress /> : ""}
                {isAccountRegistered ? "" : (<IonButton
                  id="signUpButton"
                  expand="full"
                  shape="round"
                  onClick={findUserAccount}
                >
                  Let's find your acount
                </IonButton>)}

                {isAccountRegistered ? (
                  <>
                    <br />
                    <IonListHeader className="ion-padding ion-text-center" color="primary">
                      <b>We've sent a verification code to your email.</b>
                    </IonListHeader>

                    <IonItem>
                      <IonLabel position="floating">Enter verification code</IonLabel>
                      <IonInput
                        className="ion-padding"
                        type="email"
                        value={verificationCode}
                        onIonChange={(e) => setVerificationCode(e.detail.value!)}
                      ></IonInput>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="floating">Enter New Password</IonLabel>
                      <IonInput
                        className="ion-padding"
                        type={showNewPassword ? "text" : "password"}
                        value={newAccountPassword}
                        onIonChange={(e) => setNewAccountPassword(e.detail.value!)}
                      ></IonInput>
                      <IonIcon
                        id="eye"
                        slot="end"
                        icon={eyeOutline}
                        onClick={(e) => setShowNewPassword(true)}
                      ></IonIcon>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="floating">Confirm New Password</IonLabel>
                      <IonInput
                        className="ion-padding"
                        type="password"
                        value={confirmNewAccountPassword}
                        onIonChange={(e) => setConfirmNewAccountPassword(e.detail.value!)}
                      ></IonInput>
                    </IonItem>
                    <br />
                    {isResetting ? <ButtonProgress /> : ""}
                    <IonButton
                      id="signUpButton"
                      expand="full"
                      shape="round"
                      onClick={handleResetPassword}
                    >
                      Reset Password
                    </IonButton>
                  </>
                ) :

                  ""
                }
              </IonItemGroup>
            </IonContent>
          </IonPage>
        </IonModal>


        {/* Terms and conditions Modal */}


        <IonModal isOpen={showTermsModal}>
          <IonPage>
            <IonHeader>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonButton onClick={() => setShowTermsModal(false)}>
                    <IonIcon
                      size="large"
                      color="primary"
                      icon={arrowBackOutline}
                    ></IonIcon>{" "}
                  </IonButton>
                </IonButtons>
                <b>T&Cs</b>
                <IonButtons slot="end">
                  <IonButton color="primary" size="small" shape="round" fill="outline" onClick={() => setShowTermsModal(false)}>Cancel</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
              <IonItem>
                <IonLabel className="ion-padding ion-text-wrap">

                  <h5><b>These terms and conditions govern your use of the Biva application. If you do not agree to any of these terms, you should not use the application. Biva reserves the right to update or modify these terms at any time without prior notice.</b></h5>
                  <br />
                  <p>
                    <b>User Agreement:</b> By using the Biva application, you agree to abide by all the terms and conditions outlined herein. This agreement constitutes a legally binding contract between you and Biva.</p><br />

                  <p><b>Eligibility:</b> You must be at least 18 years old or the legal age of majority in your jurisdiction to use the Biva application. By using the application, you confirm that you meet these eligibility requirements.</p><br />

                  <p><b>User Conduct:</b> You agree to use the Biva application responsibly and in compliance with all applicable laws and regulations. You will not engage in any unlawful, fraudulent, or abusive activities while using the platform.</p><br />

                  <p><b>Account Responsibility:</b> You are responsible for maintaining the confidentiality of your Biva account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized access or use of your account.</p><br />

                  <p><b>Listing and Selling:</b> If you choose to list items for sale on Biva, you warrant that you have the legal right to sell those items and that they comply with our policies. You agree to accurately represent your items and fulfill any obligations to buyers in a timely manner.</p><br />

                  <p><b>Payment and Fees:</b> Biva may charge fees for certain services, such as listing items or processing payments. By using these services, you agree to pay any applicable fees as outlined in our fee schedule.</p><br />

                  <p><b>Intellectual Property:</b> Biva owns all intellectual property rights associated with the application, including trademarks, copyrights, and patents. You agree not to use our intellectual property without our express permission.</p><br />

                  <p><b>Privacy Policy:</b> Your privacy is important to us. By using the Biva application, you consent to the collection, use, and disclosure of your personal information as described in our Privacy Policy.</p><br />

                  <p><b>Disclaimer of Warranties:</b> Biva provides the application on an "as is" and "as available" basis without any warranties or representations. We do not guarantee that the application will be error-free, secure, or uninterrupted.</p><br />

                  <p><b>Limitation of Liability:</b> In no event shall Biva be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the application, even if we have been advised of the possibility of such damages.</p>

                </IonLabel>
              </IonItem>
            </IonContent>
          </IonPage>
        </IonModal>




        <IonToast
          color="primary"
          isOpen={iserror}
          onDidDismiss={() => setIserror(false)}
          message={message}
          duration={10000}
        />
      </IonContent>
    </IonPage>
  );
};

export default LogIn;
