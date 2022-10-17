import React from 'react';
import { Linking } from 'react-native';

const ContactWhatsappAction = (phone, text) => {
        // usar link para o whatsapp
        Linking.canOpenURL("whatsapp://send?text=oi").then(supported => {
            if (supported) {
                Linking.openURL(`whatsapp://send?phone=${phone}&text=${text}`);
            } else {
                Linking.openURL(`https://api.whatsapp.com/send?phone=${phone}&text=${text}`);
            }
        })
}

export default ContactWhatsappAction;