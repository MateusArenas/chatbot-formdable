import React from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import WebView from 'react-native-webview';

const LANGUAGE = 'pt-BR';
const SITE_KEY = "6Lfzv0QiAAAAAGOMRt6AELvUwzcRQgj8H4DgkwiL";
const BASE_URL = 'https://www.google.com/recaptcha/api/siteverify?';

const CaptchaComponent = props => {
  const [captchaOpen, setCaptchaOpen] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);

  const onMessage = event => {
      setCaptchaOpen(true);

      if (event && event.nativeEvent.data) {
        if (['cancel', 'error', 'expired',].includes(event.nativeEvent.data)) {
            setCaptchaOpen(false);
            setHidden(true);
            props.triggerNextStep({ trigger: 'captcha-failure' });
            return;
        } else {
          console.log('Verified code from Google', event?.nativeEvent?.data);
          setCaptchaOpen(false);
          // setTimeout(() => {
              setHidden(true);
              props.triggerNextStep({ value: event?.nativeEvent?.data });
            // }, 1500);
        }
      }
  };

  if (hidden) return (
    <Text style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '500', color: 'black' }}>Não sou um robô ✅</Text>
  )

  return (
    <TouchableWithoutFeedback style={{ flex: 1 }}
      onPress={() => setCaptchaOpen(true)}
    >
      <View style={{ flex: 1 }}>
        {!captchaOpen && <TouchableWithoutFeedback onPress={() => setCaptchaOpen(false)}>
          <View style={{ 
            width: '40%', height: '100%', backgroundColor: 'transparent', 
            position: 'absolute', zIndex: 2,
            right: 0, bottom: 0
          }} />
        </TouchableWithoutFeedback>}
        {captchaOpen && 
          <View style={{ 
            width: '100%', height: 60, backgroundColor: 'transparent', 
            position: 'absolute', zIndex: 2,
            bottom: 0
          }} />
        }
        <WebView
          originWhitelist={['*']}
          mixedContentMode={'always'}
          onMessage={onMessage}
          javaScriptEnabled
          injectedJavaScript={
            `(${String(function () {
              var originalPostMessage = window.ReactNativeWebView.postMessage;
              var patchedPostMessage = function (message, targetOrigin, transfer) {
                originalPostMessage(message, targetOrigin, transfer);
              };
              patchedPostMessage.toString = function () {
                return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
              };
              window.ReactNativeWebView.postMessage = patchedPostMessage
            })})();`
          }
          automaticallyAdjustContentInsets
          style={[
            { backgroundColor: 'transparent', width: '100%', height: 78, transform: [{ scale: 1 }] },
            captchaOpen && {  width: '100%', height: 264 *2 }
          ]}
          source={{
            html: `<!DOCTYPE html>
            <html>
            <head> 
              <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=0.77">
              <meta http-equiv="X-UA-Compatible" content="ie=edge"> 
              <script src="https://recaptcha.google.com/recaptcha/api.js?explicit&hl=${LANGUAGE}"></script> 
              <style>
                html, body {
                  overflow: hidden !important;
                  width: 100% !important;
                  height: 100% !important;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                * {
                  padding: 0 !important;
                  margin: 0 !important;
                  box-sizing: border-box;
                  border-width: 0 !important;
                }
                #captcha {
                  width: 100% !important;
                  height: 100% !important;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
              </style>
              <script type="text/javascript"> 
              var onloadCallback = function() { };  
              var onDataCallback = function(response) { 
                window.ReactNativeWebView.postMessage(response);
              };  
              var onCancel = function() {  
                window.ReactNativeWebView.postMessage("cancel"); 
              }
              var onDataExpiredCallback = function(error) {  window.ReactNativeWebView.postMessage("expired"); };  
              var onDataErrorCallback = function(error) {  window.ReactNativeWebView.postMessage("error"); } 
              </script> 
            </head>
            <body> 
              <div id="captcha">
                <div>
                  <div class="g-recaptcha" style="display: inline-block; height: auto;" 
                    data-sitekey="${SITE_KEY}" data-callback="onDataCallback"  
                    data-expired-callback="onDataExpiredCallback"  
                    data-error-callback="onDataErrorCallback">
                  </div>
                <div>
                </div>
                </div>
              </div>
              <script type="text/javascript"> 
                window.document.onload = function(e) {
                  document.getElementById("g-recaptcha-response").addEventListener("click", function () {
                    document.getElementById('captcha').style.display = 'none';
                    window.ReactNativeWebView.postMessage("click");
                  });
                }
              </script>
            </body>
            </html>
            `,
            baseUrl: BASE_URL,
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}

export default CaptchaComponent;