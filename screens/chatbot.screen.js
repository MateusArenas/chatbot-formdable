// import { Component } from '@react-navigation/stack';
// import { useHeaderHeight } from '@react-navigation/elements'
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { NativeModules, Platform } from 'react-native';

import ChatBot from '../components';

const { StatusBarManager } = NativeModules;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

          //state: 'SP', city: 'MAUÁ', district: 'JARDIM MARIA ENEIDA', street: "RUA ANTÔNIA DE OLIVEIRA"

const Review = (props) => {

    return (
      <View style={{ width: '100%' }}>
        <Text>Summary</Text>
        <View>
          <View>
            <View>
              <Text>Estado</Text>
              <Text>{props?.steps?.state?.value || props?.steps?.andress?.value?.state}</Text>
            </View>
            <View>
              <Text>Cidade</Text>
              <Text>{props?.steps?.city?.value || props?.steps?.andress?.value?.city}</Text>
            </View>
            <View>
              <Text>Bairro</Text>
              <Text>{props?.steps?.district?.value || props?.steps?.andress?.value?.district}</Text>
            </View>
            <View>
              <Text>Rua</Text>
              <Text>{props?.steps?.street?.value || props?.steps?.andress?.value?.street}</Text>
            </View>
            <View>
              <Text>Numero</Text>
              <Text>{props?.steps?.number?.value}</Text>
            </View>
          </View>
        </View>
      </View>
    );
}

const SimpleForm = () => {
    // const height = useHeaderHeight();

    const [fields, setFields] = React.useState({})

    React.useEffect(() => {
      console.log({ fields });
    }, [fields])

    const LoadingAwait = React.useCallback(props => {
      React.useEffect(() => {
        setTimeout(() => {
          props.triggerNextStep({ value: { state: 'SP', city: 'MAUÁ', district: 'JARDIM MARIA ENEIDA', street: "RUA ANTÔNIA DE OLIVEIRA" } });
        }, 3000);
      }, [])

      return null
    }, [])

    return (
      <ChatBot hideBotAvatar hideHeader hideUserAvatar 
      userFontColor={"black"} userBubbleColor={"#c4c9cd"}
      optionFontColor={"black"} optionBubbleColor={"#fafafa"}
      botFontColor={"#fafafa"} botBubbleColor={"#272527"} bubbleStyle={{ padding: 10 }}
      footerStyle={{ backgroundColor: '#242124', borderTop: 0 }}
      inputStyle={{ backgroundColor: 'rgba(0,0,0,.2)', color: '#fafafa' }}
      submitButtonStyle={{ backgroundColor: 'rgba(0,0,0,.3)'}}
      submitButtonContent={"Enviar"}
      placeholder={"Digite aqui..."}
      scrollViewProps={{ 
        contentContainerStyle: {
          paddingTop: 0 || STATUSBAR_HEIGHT,
          paddingBottom: 0 || STATUSBAR_HEIGHT,
          flexGrow: 1
        }
      }}
      contentStyle={{ backgroundColor: '#161316', borderBottom: 0, padding: 12 }}
      keyboardVerticalOffset={0}
        steps={[
          {
            id: '0',
            message: "Olá!😄",
            trigger: 'wellcome'
          },
          {
            id: 'wellcome',
            message: "Que bom ver você aqui",
            trigger: '1'
          },
          {
            id: '1',
            message: 'Qual é o seu nome?',
            trigger: 'name',
          },
          {
            id: 'name',
            user: true,
            trigger: '3',
          },
          {
            id: '3',
            message: 'Olá {previousValue}! Qual é o tipo de produto que deseja contratar?',
            trigger: 'product',
          },
          {
            id: 'product',
            options: [
              { value: 'analize', label: 'Analise de Crédito', trigger: 'email-quest' },
              { value: 'procedencia', label: 'Procedência Veicular', trigger: 'email-quest' },
            ],
          },
          {
            id: 'email-quest',
            message: 'Qual é o seu email?',
            trigger: 'email',
          },
          {
            id: 'email',
            user: true,
            trigger: 'cell-quest',
            inputAttributes: {
              textContentType: "emailAddress",
              keyboardType: "email-address",
            },
            validator: (value) => {
              if (!(/\S+@\S+\.\S+/).test(value)) {
                return 'formato de email invalido.';
              } 
              return true;
            },
          },
          {
            id: 'cell-quest',
            message: 'Qual é o seu número de celular?',
            trigger: 'cell',
          },
          {
            id: 'cell',
            user: true,
            trigger: 'phone-require-quest',
            inputAttributes: {
              textContentType: "telephoneNumber",
              keyboardType: "numeric",
              type: 'cel-phone',
              options: {
                maskType: 'BRL',
                withDDD: true,
                dddMask: '(99) '
              }
            },
            validator: (value) => {
              if (value.match(/\d/g).length!==11) {
                return 'telefone celular invalido.';
              } 
              return true;
            },
          },
          {
            id: 'phone-require-quest',
            message: 'Deseja informar o seu telefone?',
            trigger: 'phone-require',
          },
          {
            id: 'phone-require',
            options: [
              { label: 'Sim', trigger: 'phone-quest' },
              { label: 'Não', trigger: 'ceep-quest' },
            ],
          },
          {
            id: 'phone-quest',
            message: 'Qual é o seu número de telefone?',
            trigger: 'phone',
          },
          {
            id: 'phone',
            user: true,
            trigger: 'ceep-quest',
            inputAttributes: {
              textContentType: "telephoneNumber",
              keyboardType: "numeric",
              type: 'cel-phone',
              options: {
                maskType: 'BRL',
                withDDD: true,
                dddMask: '(99) '
              }
            },
            validator: (value) => {
              if (value?.match(/\d/g).length!==10) {
                return 'Formato de telefone invalido.';
              } 
              return true;
            },
          },
          {
            id: 'socialReason-quest',
            message: 'Informe a sua Razão Social',
            trigger: 'socialReason',
          },
          {
            id: 'socialReason',
            user: true,
            trigger: 'fantasyName-quest',
          },

          {
            id: 'fantasyName-quest',
            message: 'Informe o Nome Fantasia',
            trigger: 'socialReason',
          },
          {
            id: 'fantasyName',
            user: true,
            trigger: 'cnpj-quest',
          },

          {
            id: 'cnpj-quest',
            message: 'Informe o CNPJ',
            trigger: 'cnpj',
          },
          {
            id: 'cnpj',
            user: true,
            trigger: 'ceep-quest',
          },

          {
            id: 'ceep-quest',
            message: 'Informe o CEEP',
            trigger: 'ceep',
          },
          {
            id: 'ceep',
            user: true,
            trigger: ({ value, steps }) => 'andress',
            inputAttributes: {
              textContentType: "postalCode",
              keyboardType: "numeric",
              type: 'zip-code',
            },
            validator:  (value) => {
              // "09341-450" testa com traço
              if (!(/[0-9]{5}-[0-9]{3}/g).test(value)) {
                return 'Formato de ceep invalido.';
              } 
              return true;
            },
          },
          {
            id: 'andress',
            waitAction: true, metadata: { hide: true },
            component: <LoadingAwait />,
            trigger: 'number-quest',
          },
          //state: 'SP', city: 'MAUÁ', district: 'JARDIM MARIA ENEIDA', street: "RUA ANTÔNIA DE OLIVEIRA"
          {
            id: 'number-quest',
            message: 'Numero do endereço?',
            trigger: 'number',
          },
          {
            id: 'number',
            user: true,
            trigger: '7',
            inputAttributes: {
              keyboardType: "number-pad",
            },
          },
          {
            id: '7',
            message: 'Finaliza',
            trigger: 'review',
          },
          //state: 'SP', city: 'MAUÁ', district: 'JARDIM MARIA ENEIDA', street: "RUA ANTÔNIA DE OLIVEIRA"
          {
            id: 'state',
            user: true,
            trigger: 'update',
          },
          {
            id: 'city',
            user: true,
            trigger: 'update',
          },
          {
            id: 'district',
            user: true,
            trigger: 'update',
          },
          {
            id: 'street',
            user: true,
            trigger: 'update',
          },
          {
            id: 'review',
            component: <Review />,
            asMessage: true,
            trigger: 'update',
          },
          {
            id: 'update',
            message: 'Would you like to update some field?',
            trigger: 'update-question',
          },
          {
            id: 'update-question',
            options: [
              { label: 'Yes', trigger: 'update-yes' },
              { label: 'No', trigger: 'end-message' },
            ],
          },
          {
            id: 'update-yes',
            message: 'What field would you like to update?',
            trigger: 'update-fields',
          },
          //state: 'SP', city: 'MAUÁ', district: 'JARDIM MARIA ENEIDA', street: "RUA ANTÔNIA DE OLIVEIRA"
          {
            id: 'update-fields',
            options: [
              { label: 'Estado*', trigger: 'update-state' },
              { label: 'Cidade*', trigger: 'update-city' },
              { label: 'Bairro*', trigger: 'update-district' },
              { label: 'Rua*', trigger: 'update-street' },
              { label: 'Numero*', trigger: 'update-number' },
            ],
          },
          {
            id: 'update-state',
            update: 'state',
            trigger: '7',
          },
          {
            id: 'update-city',
            update: 'city',
            trigger: '7',
          },
          {
            id: 'update-district',
            update: 'district',
            trigger: '7',
          },
          {
            id: 'update-street',
            update: 'street',
            trigger: '7',
          },
          {
            id: 'update-number',
            update: 'number',
            trigger: '7',
          },
          {
            id: 'end-message',
            message: 'Thanks! Your data was submitted successfully!',
            end: true,
          },
        ]}

        handleEnd={({renderedSteps, steps, values }) => {
          const fields = renderedSteps.filter(step => step.value !== undefined).map(step => ({ [step.id]: step.value }))
          setFields(Object.assign(...fields))
        }}
      />

    );
}

export default SimpleForm;





