import React from 'react';
import { Linking } from 'react-native';

const ContactWhatsappAction = ({ text, phone, ...props }) => {
    React.useEffect(() => {
        // usar link para o whatsapp
        Linking.canOpenURL("whatsapp://send?text=oi").then(supported => {
            console.log({ supported });
            if (supported) {
                Linking.openURL(`whatsapp://send?phone=${phone}&text=${text}`);
                props.triggerNextStep({ })
            } else {
                Linking.openURL(`https://api.whatsapp.com/send?phone=${phone}&text=${text}`);
                props.triggerNextStep({ })
            }
        })
    }, [])

    return props?.loadingComponent;
}

export default ContactWhatsappAction;