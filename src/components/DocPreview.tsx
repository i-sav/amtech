import { IonCard, IonCol, IonIcon } from "@ionic/react";
import { documentTextSharp, downloadSharp } from "ionicons/icons";
import React from "react";
import { useHistory } from "react-router";


interface ContainerProps {
    docId: string;
    title: string;
    docUrl: string;
}

const DocumentPreview: React.FC<ContainerProps> = ({
    docId,
    title,
    docUrl,
}) => {

    //history
    const history = useHistory();
    //construct data to pass
    const docData = {
        docId,
        title,
        docUrl,
    }

    return (
        <IonCol size="6" className="ion-text-center" key={docId} onClick={() => window.open(docUrl)}>
            <IonCard>
                <IonIcon className="ion-padding" color="primary" size="large" icon={documentTextSharp}></IonIcon>
                <p><b>{title}</b></p>
                <p>Download <IonIcon color="primary" icon={downloadSharp}></IonIcon></p>
            </IonCard>
        </IonCol>
    );
};

export default DocumentPreview;
