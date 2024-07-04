import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    IonContent,
    IonPage,
    IonHeader,
    IonButtons,
    IonBackButton,
    IonToolbar,
    IonListHeader,
    IonLabel,
    IonTitle,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonToast,
    IonItem,
    IonIcon,
    IonInput,
    IonDatetime,
} from "@ionic/react";
import QRCode from 'react-qr-code';
import { parseISO, format } from "date-fns";
import html2canvas from 'html2canvas';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Accept, useDropzone } from 'react-dropzone';

import "@ionic/react/css/ionic-swiper.css";
import TabsContext from "../components/TabsContext";
import { documentAttachOutline } from "ionicons/icons";
import ButtonProgress from "../components/ButtonProgress";

const GenerateQr: React.FC = () => {

    // hide tabs context
    const { setShowTabs } = React.useContext(TabsContext);
    //hiding tabs on page when it loads

    //process qr code states
    const qrRef = useRef(null);
    const [file, setFile] = useState<any>();
    const [iserror, setIserror] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [progress, setProgress] = useState<boolean>(false);
    //form data states
    const [companyName, setCompantName] = useState<string>("");
    const [officerInCharge, setOfficerinCharge] = useState<string>("");
    const [dateOfIssue, setDateOfIssue] = useState<string>("");
    const [expiryDate, setExpiryDate] = useState<string>("");
    //
    //format date
    //format date
    const formatdate = (value: string) => {
        return format(parseISO(value), "dd.MM.yyyy");
    };
    //
    //current Date
    const currentDate = new Date();
    const minDate = currentDate.toISOString();
    //time stamp
    const currentTimeStamp = new Date().getTime()

    //const 1 year ahead to allow selection of expiry date
    // Set maxDate to 1 year ahead
    const nextYear = new Date(currentDate.getFullYear() + 2, currentDate.getMonth(), currentDate.getDate());
    const maxDate = nextYear.toISOString();
    //

    useEffect(() => {
        setShowTabs(false);
        return () => {
            setShowTabs(true);
        };
    }, []);


    //data to be attached at the QR
    const data = {
        CompanyName: companyName,
        OfficerInCharge: officerInCharge,
        CalibrationDate: dateOfIssue,
        ExpiryDate: expiryDate,
    };
    // Replace with your data

    //drag n drop ====
    const onDrop = useCallback(acceptedFiles => {
        setFile(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        // accept: 'application/pdf',
    });
    //end of drag and drop ====

    //
    const generatePDF = async () => {
        //check if pdf has been selected
        if (!file) {
            setMessage('Please select a PDF file to attach Qr code.');
            setIserror(true);
            return;
        }
        if (!companyName) {
            setMessage('Please enter the Company Name');
            setIserror(true);
            return;
        }
        if (!officerInCharge) {
            setMessage('Please enter the name of Officer in charge');
            setIserror(true);
            return;
        }
        if (!dateOfIssue) {
            setMessage('Please enter the license date of issue');
            setIserror(true);
            return;
        }
        if (!expiryDate) {
            setMessage('Please enter the license expiry date');
            setIserror(true);
            return;
        }

        //buffer arary
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        //
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();
        //
        const qrElement = qrRef.current;
        if (qrElement) {
            const canvas = await html2canvas(qrElement);
            const imgData = canvas.toDataURL('image/png');
            //draw qr code
            const qrImage = await pdfDoc.embedPng(imgData);
            const qrSize = 90;
            const qrX = width - qrSize - 40;
            const qrY = 50;

            firstPage.drawImage(qrImage, {
                x: qrX,
                y: qrY,
                width: qrSize,
                height: qrSize,
            });
            //embed text
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const text = "Powered by Amtech Ltd";
            const fontSize = 12;
            const textWidth = font.widthOfTextAtSize(text, fontSize);

            firstPage.drawText(text, {
                x: qrX + (qrSize - textWidth) / 2,
                y: qrY - fontSize - 5,
                size: fontSize,
                font: font,
                color: rgb(0, 0, 0),
            });
            //save pdf
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `NewQRDocument${currentTimeStamp}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            //stop the loader
            setProgress(false);
            //
        }
    };
    //

    //process the pdf
    const processingPDF = async () => {
        //delay for 3 seconds
        setProgress(true);
        setTimeout(generatePDF, 3000);
    }


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>Generate PDF with details in QR code</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding ion-text-center">
                <IonGrid>
                    <IonRow>

                        <IonCol size="3" className="ion-padding">
                            <IonListHeader>
                                <IonLabel color="primary"><b>Select PDF</b></IonLabel>
                            </IonListHeader>
                            <div {...getRootProps({ className: 'dropzone' })} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', margin: '20px 0' }}>
                                <input {...getInputProps()} />
                                {file ? (
                                    <p>{file.name}</p>
                                ) : (
                                    <p>Drag 'n' drop a PDF file here, or click to select one</p>
                                )}
                            </div>
                        </IonCol>

                        <IonCol size="7" className="ion-text-center">
                            <IonListHeader>
                                <IonLabel color="primary"><b>Provide the following details</b></IonLabel>
                            </IonListHeader>
                            <IonGrid>
                                <IonRow>
                                    <IonCol size="6">
                                        <IonItem>
                                            <IonLabel position="floating">Company Name</IonLabel>
                                            <IonInput
                                                type="text"
                                                value={companyName}
                                                onIonChange={(e) => setCompantName(e.detail.value!)}
                                            ></IonInput>
                                        </IonItem>
                                    </IonCol>
                                    <IonCol size="6">
                                        <IonItem>
                                            <IonLabel position="floating">Officer In Charge</IonLabel>
                                            <IonInput
                                                type="text"
                                                value={officerInCharge}
                                                onIonChange={(e) => setOfficerinCharge(e.detail.value!)}
                                            ></IonInput>
                                        </IonItem>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>


                            <IonGrid>
                                <IonRow>
                                    <IonCol size="6">
                                        <IonItem>
                                            <IonLabel position="floating">Calibration Date</IonLabel>
                                            <IonInput id="date-input" value={dateOfIssue}></IonInput>

                                            <IonDatetime
                                                showClearButton={true}
                                                presentation="date"
                                                locale="KE"
                                                onIonChange={(e: any) =>
                                                    setDateOfIssue(formatdate(e.detail.value!))
                                                }
                                            ></IonDatetime>

                                        </IonItem>
                                    </IonCol>
                                    <IonCol size="6">
                                        <IonItem>
                                            <IonLabel position="floating">Expiry Date</IonLabel>
                                            <IonInput id="date-input" value={expiryDate}></IonInput>

                                            <IonDatetime
                                                showClearButton={true}
                                                presentation="date"
                                                locale="KE"
                                                max={maxDate}
                                                onIonChange={(e: any) =>
                                                    setExpiryDate(formatdate(e.detail.value!))
                                                }
                                            ></IonDatetime>

                                        </IonItem>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                            <IonButton fill="outline" shape="round" expand="block" onClick={processingPDF}>Generate PDF with QR Code</IonButton>
                        </IonCol>

                        <IonCol size="2" className="ion-text-center">
                            <IonListHeader>
                                <IonLabel color="primary"><b>QR code</b></IonLabel>
                            </IonListHeader>
                            <div ref={qrRef} style={{ display: 'inline-block' }}>
                                <QRCode value={JSON.stringify(data)} size={100} />
                            </div>
                            <br />
                            {progress ? <p><b>Working on it ... </b> <ButtonProgress /></p> : ""}
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <IonToast
                    color="primary"
                    isOpen={iserror}
                    onDidDismiss={() => setIserror(false)}
                    message={message}
                    duration={3000}
                />
            </IonContent>
        </IonPage>
    );
};

export default GenerateQr;
