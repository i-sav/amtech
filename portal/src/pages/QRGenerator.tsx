import React, { useEffect, useRef } from "react";
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
} from "@ionic/react";
import QRCode from 'react-qr-code';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import "@ionic/react/css/ionic-swiper.css";
import TabsContext from "../components/TabsContext";

const GenerateQr: React.FC = () => {
    const { setShowTabs } = React.useContext(TabsContext);
    //hiding tabs on page when it loads
    useEffect(() => {
        setShowTabs(false);
        return () => {
            setShowTabs(true);
        };
    }, []);

    //process qr code
    const qrRef = useRef(null);

    const data = {
        Company: "AMTECH LTD",
        License: "LPG Transport",
        ValidTill: "May 29Th 2025",
    }; // Replace with your data

    const generatePDF = async () => {
        const pdf = new jsPDF();

        // Add headers and paragraphs to the PDF
        pdf.setFontSize(22);
        pdf.text('Document Title', 10, 20);

        pdf.setFontSize(16);
        pdf.text('Header 1', 10, 30);

        pdf.setFontSize(12);
        pdf.text('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non urna et mauris luctus dignissim. Vivamus placerat, urna id fringilla varius, erat erat pharetra metus, vel sollicitudin dolor magna in nunc.', 10, 40, { maxWidth: 180 });

        pdf.setFontSize(16);
        pdf.text('Header 2', 10, 70);

        pdf.setFontSize(12);
        pdf.text('Sed vitae orci non urna suscipit dictum. Nam euismod massa ac ipsum interdum, et pharetra dui blandit. Curabitur at tortor in nulla ullamcorper vehicula. Donec vehicula, libero at dapibus lacinia, lectus odio pharetra metus, sed fermentum lacus urna ut felis.', 10, 80, { maxWidth: 180 });

        // Capture QR code as an image
        const qrElement = qrRef.current;
        if (qrElement) {
            const canvas = await html2canvas(qrElement);
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const qrSize = 50; // size of the QR code in the PDF
            pdf.addImage(imgData, 'PNG', pdfWidth - qrSize - 10, pdfHeight - qrSize - 10, qrSize, qrSize);
        }

        // Save or print the PDF
        pdf.save('document.pdf');
    };


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
            <IonContent fullscreen>
                <IonGrid>
                    <IonRow>
                        <IonCol size="2"></IonCol>
                        <IonCol size="8" className="ion-text-center">
                            <IonListHeader className="ion-text-center">
                                <IonLabel color="primary"><b>Provide the following details</b></IonLabel>
                            </IonListHeader>
                            <div ref={qrRef} style={{ display: 'inline-block' }}>
                                <QRCode value={JSON.stringify(data)} size={100} />
                            </div>
                            <br />
                            <IonButton onClick={generatePDF}>Generate PDF</IonButton>
                        </IonCol>
                        <IonCol size="2"></IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default GenerateQr;
