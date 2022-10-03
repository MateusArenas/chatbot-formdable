// import { useHeaderHeight } from '@react-navigation/stack';
import axios from 'axios';
import { cnpj, cpf } from 'cpf-cnpj-validator';
import React, { Component } from 'react';
import { validate } from 'react-email-validator';
import { Alert, Button, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { NativeModules, Platform, StatusBar } from 'react-native';
import * as FeatherIcon from 'react-native-feather';
import WebView from 'react-native-webview';
// import api from '../service/api';

const STORAGE_CHATBOT_KEY = "RCA_CHATBOT-1.2.8";
import AsyncStorage from '@react-native-async-storage/async-storage'

import ChatBot from '../components';
import Gradient from '../components/Gradient';

const { StatusBarManager } = NativeModules;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

const Review = (props) => {
  const [state, setState] = React.useState({});
  React.useEffect(() => { setState(props.steps) }, []);

  const uninformed = "Não informado.";
  const text = props.fields.reduce((fulltext, field) => fulltext+field?.label+": "+"\n"+(state?.[field?.value]?.value||uninformed)+"\n\n","");

  return (
    <>
      <Text style={{ color: 'white', opacity: .9, fontSize: 16 }}>{props.title+'\n\n'}</Text>
      <Text style={{ color: 'white', opacity: .9, fontSize: 16 }}>{text.substring(0, text.length - 2)}</Text>
    </>
  )
}

const SimpleForm = () => {
    // const height = useHeaderHeight();

    async function onSubmitFormData (obj) {
      console.log({ obj });
      const bodyFormData = new FormData();
      //transform obj in formdata and check if false value for filter.
      Object.keys(obj).forEach(key => obj[key] && bodyFormData.append(key, obj[key]))
      try {
        const { data } = await axios({
          method: 'post',
          url: 'http://10.0.2.2/credconsultas_api/cadastro',
          data: bodyFormData,
          headers: { 
            "Content-Type": "multipart/form-data",
            'token': '26d7c43e-504f-4bab-8177-8392fd4839ee'
          },
        });
        // const { data } = await api.post('/cadastro', bodyFormData, { 
        //   headers: { "Content-Type": "multipart/form-data" }
        // })
        console.log({ res: data });
      } catch (err) {
        console.log({ err });
      }
    }

    const LoadingAwait = React.useCallback(props => {
      const [message, setMessage] = React.useState('');
      React.useEffect(() => {
        axios.get(`https://viacep.com.br/ws/${props.steps['cep'].value}/json/`).then(({ data }) => {
          if (!data?.erro) {
            props.triggerNextStep({ 
              value: true,
              defaultTrigger: '7',
              overwrite: { 
                state: data.uf, 
                city: data.localidade, 
                district: data.bairro, 
                street: data.logradouro,
                complement: data.complemento,
              },
            });
            setMessage(`Dados relativos ao cep carregados. ✅`)
          } else {
            props.triggerNextStep({ trigger: 'cep-failure', value: false });
            setMessage(`Falha ao carregar campos. 🚫`)
          }
        })
      }, [])

      return (
        <Text style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '500', color: 'black' }}>
          {message}
        </Text>
      )
    }, [])

    const theme = {
      light: {
        gradientColors: ['white', '#ece9e4', '#ece9e4'],
        gradientOpacitys: [1, .8, .8],
        userFontColor: "#2c2a2a", userBubbleColor: "#f6f6f6",
        optionFontColor: "#2c2a2a", optionBubbleColor: "#fafafa",
        botFontColor: "#fafafa", botBubbleColor: "#272527",
        sendIconColor: "#2c2a2a",
        footerBackgroundColor: '#f6f6f6',
        inputTextColor: '#2c2a2a',
        inputBackgroundColor: '#ffffff',
        inputPlaceholderTextColor: '#625e5e'
      },
      // dark: {
      //   gradientColors: ['black', '#161316', '#161316'],
      //   gradientOpacitys: [1, .975, 1],
      //   userFontColor: "black", userBubbleColor: "#ebeff5",
      //   optionFontColor: "black", optionBubbleColor: "#fafafa",
      //   botFontColor: "#fafafa", botBubbleColor: "#272527",
      //   sendIconColor: "#ebeff5",
      //   footerBackgroundColor: '#242124',
      //   inputTextColor: '#fafafa',
      //   inputPlaceholderTextColor: '#ffffff6e'
      // }
    };


    // const [defaultState, setDefaultState] = React.useState({
    //   renderedSteps: [],
    //   previousSteps: [],
    //   currentStep: {},
    //   previousStep: {},
    //   steps: {},
    //   editable: false,
    //   inputValue: '',
    //   inputInvalid: false,
    //   defaultUserSettings: {},
    // })

    // React.useEffect(() => {
    //   get('test-01').then(json => {
    //     const data = JSON.parse(json)
    //     setDefaultState(data);
    //   })
    // }, [])

    const LoadingLastSession = React.useCallback(props => {
      React.useEffect(() => {
        AsyncStorage.getItem(STORAGE_CHATBOT_KEY).then(storageValue => {
          if (storageValue) {
            let defaultData = JSON.parse(storageValue);

            console.log({ defaultData });

            console.log({
              overwrite: defaultData.overwrite,
              trigger: defaultData.lastTrigger
            });

            props.triggerNextStep({ 
              value: true,
              defaultTrigger: '7',
              overwrite: {
                ...defaultData.overwrite,
                ['lastTrigger']: defaultData.lastTrigger
              },
              // trigger: defaultData.lastTrigger
              trigger: 'reload-last-session-message'
            });
          } else {
            props.triggerNextStep({ value: false, trigger: 'initialize' });
          }
        });
      }, [])

      return null;
    }, [])

    async function handleStep (step, data) {
      if (step?.value || data?.overwrite) {
        const storageValue = await AsyncStorage.getItem(STORAGE_CHATBOT_KEY);

          let defaultData = {};
          if (storageValue) {
            defaultData = JSON.parse(storageValue);
          } 

          const stepOverwrite = data?.overwrite || {};

          await AsyncStorage.setItem(STORAGE_CHATBOT_KEY, JSON.stringify({
            lastTrigger: step?.trigger,
            overwrite: { 
              ...defaultData?.overwrite,
              ...stepOverwrite,  
              [step?.id]: step?.value,
            }
          }))
      }
    }

    
    return (
      <>
      <StatusBar barStyle="light-content"  backgroundColor="black" />
      <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Gradient colors={theme['light'].gradientColors} opacitys={theme['light'].gradientOpacitys} >
          <ChatBot style={{ backgroundColor: 'transparent', flex: 1 }} 
          // defaultState={defaultState}
          // storageKey={'test-01'}
          botDelay={400} 
          inputAttributes={{
            placeholderTextColor: theme['light'].inputPlaceholderTextColor,
            keyboardAppearance: 'light'
          }}
          hideBotAvatar hideHeader hideUserAvatar 
          userFontColor={theme['light'].userFontColor} 
          userBubbleColor={theme['light'].userBubbleColor}
          optionFontColor={theme['light'].optionFontColor} 
          optionBubbleColor={theme['light'].optionBubbleColor}
          botFontColor={theme['light'].botFontColor} 
          botBubbleColor={theme['light'].botBubbleColor} 
          bubbleStyle={{ padding: 10, opacity: .8 }}
          submitButtonTextComponent={props => (
            <FeatherIcon.Send style={{ opacity: .8}} 
              width={24} height={24} 
              color={theme['light'].sendIconColor} 
            />
          )}
          footerStyle={{ 
            borderTop: 0, padding: 12, 
            backgroundColor: theme['light'].footerBackgroundColor, 
          }}
          inputStyle={{ 
            backgroundColor: theme['light'].inputBackgroundColor, 
            borderWidth: 1, borderColor: "rgba(0,0,0,.15)",
            borderRadius: 20, borderTopRightRadius: 0, borderBottomRightRadius: 0,
            color: theme['light'].inputTextColor, fontSize: 16, flex: 1,
            paddingLeft: 18,
          }}
          submitButtonStyle={{ 
            backgroundColor: 'rgba(0,0,0,.1)', fontSize: 16,  
            borderRadius: 20, 
            borderTopLeftRadius: 0, borderBottomLeftRadius: 0,
            padding: 20, paddingLeft: 16,
            margin: 10, marginLeft: 0
          }}
          submitButtonContent={"Enviar"}
          placeholder={"Digite aqui..."}
          scrollViewProps={{ 
            contentContainerStyle: {
              paddingTop: 0 || STATUSBAR_HEIGHT,
              paddingBottom: 0 || STATUSBAR_HEIGHT,
              flexGrow: 1, justifyContent: 'flex-end',
            }
          }}
          contentStyle={{ backgroundColor: 'transparent', borderBottom: 0, padding: 12 }}
          keyboardVerticalOffset={0}
          handleStep={handleStep}
          steps={[
            {
              id: 'reload-last-session',
              waitAction: { 
                text: [
                  "Carregando sessão.   🕐",
                  "Carregando sessão..  🕒",
                  "Carregando sessão... 🕔",
                  "Carregando sessão..  🕗",
                  "Carregando sessão.   🕘",
                  "Carregando sessão..  🕚",
                  "Carregando sessão... 🕛",
                ],
                delay: 200
              }, 
              replace: true,
              component: <LoadingLastSession />,
              trigger: 'initialize',
            },
            {
              id: 'reload-last-session-message',
              message: "Deseja continuar com os dados anteriores ou iniciar uma nova consulta?",
              trigger: 'reload-last-session-require'
            },
            {
              id: 'reload-last-session-require',
              inputAttributes: {
                placeholder: "Escolha uma opção",
              },
              options: [
                { key: "1", label: 'Continuar', trigger: ({ steps }) => steps['lastTrigger']?.value },
                { key: "2", label: 'Refazer', trigger: 'initialize' },
              ],
            },
            {
              id: 'initialize',
              message: "Olá! 😄",
              trigger: 'wellcome'
            },
            {
              id: 'wellcome',
              message: "Que bom ver você aqui",
              trigger: 'name-quest'
            },
            {
              id: 'name-quest',
              message: 'Qual é o seu nome?',
              trigger: 'name',
            },
            {
              id: 'name',
              user: true,
              inputAttributes: { autoFoucus: true },
              //testa se caso só tenhas espaços sem nenhum outro caractere
              validator: (value) => {
                if ((/^\s*$/).test(value)) {
                  return 'Formato inválido.';
                } 
                return true;
              },
              trigger: 'product-quest',
            },
            {
              id: 'product-quest',
              message: 'Olá {previousValue}! Qual é o tipo de produto que deseja contratar?',
              trigger: 'product',
            },
            {
              id: 'product',
              options: [
                { value: 'analize', label: 'Análise de Crédito', trigger: 'email-quest' },
                { value: 'procedencia', label: 'Procedência Veicular', trigger: 'email-quest' },
                { value: 'analize+procedencia', label: 'Análise de Crédito + Procedência Veicular', trigger: 'email-quest' },
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
                placeholder: "Seu endereço de email",
              },
              validator: (value) => {
                if (!(/\S+@\S+\.\S+/).test(value)) {
                  return 'Formato de email inválido.';
                } 
                if (!validate(value)) {
                  return 'E-mail do comprador inválido';
                } 
                return true;
              },
            },
            {
              id: 'cell-quest',
              message: 'Qual é o seu número de telefone?',
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
                placeholder: "(__) ____-____",
                options: {
                  maskType: 'BRL',
                  withDDD: true,
                  dddMask: '(99) '
                }
              },
              validator: (value) => {
                if (value.match(/\d/g).length < 10) {
                  return 'telefone celular inválido.';
                }
                const ddd = value.match(/[ ]?\(?\d+\)?[]?/)?.[0];
                if (ddd) {
                  if(!allDDDs.map(dddNumber => `(${dddNumber})`).includes(ddd)) {
                    return 'DDD inválido.';
                  }
                } else {
                  return 'Não há DDD no número.';
                }
                return true;
              },
            },
            {
              id: 'phone-require-quest',
              message: 'Deseja informar outro telefone de contato?',
              trigger: 'phone-require',
            },
            {
              id: 'phone-require',
              inputAttributes: {
                placeholder: "Escolha uma opção",
              },
              options: [
                { key: "1", label: 'Sim', trigger: 'phone-quest' },
                { key: "2", label: 'Não', trigger: 'socialReason-quest' },
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
              trigger: 'socialReason-quest',
              inputAttributes: {
                textContentType: "telephoneNumber",
                keyboardType: "numeric",
                type: 'cel-phone',
                placeholder: "(__) ____-____",
                options: {
                  maskType: 'BRL',
                  withDDD: true,
                  dddMask: '(99) '
                }
              },
              validator: (value) => {
                if (value.match(/\d/g).length < 10) {
                  return 'telefone celular inválido.';
                }
                const ddd = value.match(/[ ]?\(?\d+\)?[]?/)?.[0];
                if (ddd) {
                  if(!allDDDs.map(dddNumber => `(${dddNumber})`).includes(ddd)) {
                    return 'DDD inválido.';
                  }
                } else {
                  return 'Não há DDD no número.';
                }
                return true;
              },
            },
            {
              id: 'socialReason-quest',
              message: 'Informe a Razão Social',
              trigger: 'socialReason',
            },
            {
              id: 'socialReason',
              user: true,
              //testa se caso só tenhas espaços sem nenhum outro caractere
              validator: (value) => {
                if ((/^\s*$/).test(value)) {
                  return 'Formato inválido.';
                } 
                return true;
              },
              trigger: 'fantasyName-quest',
            },

            {
              id: 'fantasyName-quest',
              message: 'Informe o Nome Fantasia',
              trigger: 'fantasyName',
            },
            {
              id: 'fantasyName',
              user: true,
              //testa se caso só tenhas espaços sem nenhum outro caractere
              validator: (value) => {
                if ((/^\s*$/).test(value)) {
                  return 'Formato inválido.';
                } 
                return true;
              },
              trigger: 'cnpj-quest',
            },

            {
              id: 'cnpj-quest',
              message: 'Informe o CNPJ da empresa',
              trigger: 'cnpj',
            },
            {
              id: 'cnpj',
              user: true,
              inputAttributes: { 
                type: 'cnpj',
                placeholder: "__.___.___/____-__",
              },
              validator:  (value) => {
                if (!cnpj.isValid(value)) {
                  return 'cnpj inválido.';
                } 
                return true;
              },
              trigger: 'cep-quest',
            },

            {
              id: 'cep-quest',
              message: 'Informe o CEP do endereço',
              trigger: 'cep',
            },
            {
              id: 'cep',
              user: true,
              trigger: 'andress',
              inputAttributes: {
                textContentType: "postalCode",
                placeholder: "_____-___",
                keyboardType: "numeric",
                type: 'zip-code',
              },
              validator:  (value) => {
                if (!(/[0-9]{5}-[0-9]{3}/g).test(value)) {
                  return 'Formato de cep inválido.';
                } 
                return true;
              },
            },
            { 
              id: 'cep-failure',
              message: 'CEP não encontrado, porfavor insira um cep existente.',
              trigger: 'update-cep',
            },
            {
              id: 'andress',
              waitAction: { 
                text: [
                  "Carregando campos.   🕐",
                  "Carregando campos..  🕒",
                  "Carregando campos... 🕔",
                  "Carregando campos..  🕗",
                  "Carregando campos.   🕘",
                  "Carregando campos..  🕚",
                  "Carregando campos... 🕛",
                  // "Carregando campos.  🕐🕒🕔🕗🕘🕚🕛",
                ],
                delay: 200
              }, 
              component: <LoadingAwait />,
              trigger: 'number-quest',
            },
            //state: 'SP', city: 'MAUÁ', district: 'JARDIM MARIA ENEIDA', street: "RUA ANTÔNIA DE OLIVEIRA"
            {
              id: 'number-quest',
              message: 'Número de endereço',
              trigger: 'number',
            },
            {
              id: 'number',
              user: true,
              trigger: 'complement-require-quest',
              inputAttributes: { keyboardType: "number-pad" },
              validator:  (value) => {
                //testa se caso só tenhas espaços sem nenhum outro caractere
                if ((/^\s*$/).test(value)) {
                  return 'Formato inválido.';
                } 
                if (!(new RegExp('^[0-9]*$')).test(value)) {
                  return 'Somente números.';
                } 
                return true;
              },
            },
            {
              id: 'complement-require-quest',
              message: ({ steps }) => {
                const complement = steps?.['complement']?.value;
                if (complement) {
                  return `Deseja sobrescrever o complemento "${complement}"?`;
                }
                return 'Há um complemento?'
              },
              trigger: 'complement-require',
            },
            {
              id: 'complement-require',
              options: [
                { key: '1', label: 'Sim', trigger: 'complement-quest' },
                { key: '2', label: 'Não', trigger: '7' },
              ],
            },
            {
              id: 'complement-quest',
              message: 'Insira o complemento',
              trigger: 'complement',
            },
            {
              id: 'complement',
              user: true,
              //testa se caso só tenhas espaços sem nenhum outro caractere
              validator: (value) => {
                if ((/^\s*$/).test(value)) {
                  return 'Formato inválido.';
                } 
                return true;
              },
              trigger: '7',
            },
            {
              id: '7',
              message: 'Vamos lá falta pouco! 😉',
              trigger: 'review-init',
            },
            //aqui
            {
              id: 'review-init',
              component: <Review title={'Dados Principais 📄'} fields={[
                { label: "Nome", value: "name" }, 
                { label: "Email", value: "email" }, 
                { label: "Nome Fantasia", value: "fantasyName" }, 
                { label: "Razão Social", value: "socialReason" }, 
                { label: "Tipo de Produto", value: "product" }, 
                { label: "CNPJ", value: "cnpj" }, 
                { label: "Telefone", value: "cell" }, 
                { label: "Telefone (2)", value: "phone" }, 
              ]} />,
              asMessage: true,
              trigger: 'update-init',
            },
            {
              id: 'update-init',
              message: 'Deseja atualizar algum campo ou continuar? 🆙',
              trigger: 'update-init-question',
            },
            {
              id: 'update-init-question',
              options: [
                { key: '1', label: 'Atualizar', trigger: 'update-init-yes' },
                { key: '2', label: 'Continuar', trigger: 'review' },
              ],
            },
            {
              id: 'update-init-yes',
              message: 'Qual campo deseja atualizar?',
              trigger: 'update-init-fields',
            },
            //state: 'SP', city: 'MAUÁ', district: 'JARDIM MARIA ENEIDA', street: "RUA ANTÔNIA DE OLIVEIRA"
            {
              id: 'update-init-fields',
              options: [
                { key: '1', label: 'Nome*', trigger: 'update-name' },
                { key: '2', label: 'Email*', trigger: 'update-email' },
                { key: '3', label: 'Nome Fantasia*', trigger: 'update-fantasyName' },
                { key: '4', label: 'Razão Social*', trigger: 'update-socialReason' },
                { key: '5', label: 'Tipo de Produto*', trigger: 'update-product' },
                { key: '6', label: 'CNPJ*', trigger: 'update-cnpj' },
                { key: '7', label: 'Telefone*', trigger: 'update-cell' },
                { key: '8', label: 'Telefone (2)', trigger: 'update-phone' },
              ],
            },
            {
              id: 'update-name',
              update: 'name',
              trigger: 'review-init',
            },
            {
              id: 'update-email',
              update: 'email',
              trigger: 'review-init',
            },
            {
              id: 'update-fantasyName',
              update: 'fantasyName',
              trigger: 'review-init',
            },
            {
              id: 'update-socialReason',
              update: 'socialReason',
              trigger: 'review-init',
            },
            {
              id: 'update-product',
              update: 'product',
              trigger: 'review-init',
            },
            {
              id: 'update-cnpj',
              update: 'cnpj',
              trigger: 'review-init',
            },
            {
              id: 'update-cell',
              update: 'cell',
              trigger: 'review-init',
            },
            {
              id: 'update-phone',
              update: 'phone',
              trigger: 'review-init',
            },
            //fim aqui
            //state: 'SP', city: 'MAUÁ', district: 'JARDIM MARIA ENEIDA', street: "RUA ANTÔNIA DE OLIVEIRA"

            {
              id: 'city',
              user: true,
              //testa se caso só tenhas espaços sem nenhum outro caractere
              validator: (value) => {
                if ((/^\s*$/).test(value)) {
                  return 'Formato inválido.';
                } 
                return true;
              },
              trigger: 'update',
            },
            {
              id: 'district',
              //testa se caso só tenhas espaços sem nenhum outro caractere
              validator: (value) => {
                if ((/^\s*$/).test(value)) {
                  return 'Formato inválido.';
                } 
                return true;
              },
              user: true,
              trigger: 'update',
            },
            {
              id: 'street',
              //testa se caso só tenhas espaços sem nenhum outro caractere
              validator: (value) => {
                if ((/^\s*$/).test(value)) {
                  return 'Formato inválido.';
                } 
                return true;
              },
              user: true,
              trigger: 'update',
            },
            {
              id: 'review',
              component: <Review title={'Dados de Localização 📍'} fields={[
                { label: "CEP", value: "cep" }, 
                { label: "Estado", value: "state" }, 
                { label: "Cidade", value: "city" }, 
                { label: "Bairro", value: "district" }, 
                { label: "Logradouro", value: "street" }, 
                { label: "Número", value: "number" }, 
                { label: "Complemento", value: "complement" }, 
              ]} />,
              asMessage: true,
              trigger: 'update',
            },
            {
              id: 'update',
              message: 'Deseja atualizar algum campo ou continuar? 🆙',
              trigger: 'update-question',
            },
            {
              id: 'update-question',
              options: [
                { key: '1', label: 'Atualizar', trigger: 'update-yes' },
                { key: '2', label: 'Continuar', trigger: 'end-message' },
              ],
            },
            {
              id: 'update-yes',
              message: 'Qual campo deseja atualizar? 🆙',
              trigger: 'update-fields',
            },
            //state: 'SP', city: 'MAUÁ', district: 'JARDIM MARIA ENEIDA', street: "RUA ANTÔNIA DE OLIVEIRA"
            {
              id: 'update-fields',
              options: [
                { key: '1', label: "CEP*", trigger: "update-cep" }, 
                { key: '2', label: 'Estado*', trigger: 'update-state' },
                { key: '3', label: 'Cidade*', trigger: 'update-city' },
                { key: '4', label: 'Bairro*', trigger: 'update-district' },
                { key: '5', label: 'Logradouro*', trigger: 'update-street' },
                { key: '6', label: 'Número*', trigger: 'update-number' },
                { key: '7', label: "Complemento", trigger: "update-complement" }, 
              ],
            },
            {
              id: 'update-cep',
              update: 'cep',
              trigger: ({ steps, ...props }) => {
                const askwantchange = ['state', 'city', 'district', 'street'].reduce((acc, key) => (acc&&steps[key]?.value), true);
                return !askwantchange ? 'andress' : 'andress-update-fields-quest'
              },
            },
            {
              id: 'andress-update-fields-quest',
              message: 'Deseja atualizar (estado, cidade, bairro, rua, número e complemento) com base no CEP: {previousValue} ? 🔄🆙',
              trigger: 'andress-update-fields-require',
            },
            {
              id: 'andress-update-fields-require',
              options: [
                { key: '1', label: 'Sim', trigger: 'andress-reload' },
                { key: '2', label: 'Não', trigger: '7' },
              ],
            },
            {
              id: 'andress-reload',
              waitAction: { 
                text: [
                  "Carregando campos.   🕐",
                  "Carregando campos..  🕒",
                  "Carregando campos... 🕔",
                  "Carregando campos..  🕗",
                  "Carregando campos.   🕘",
                  "Carregando campos..  🕚",
                  "Carregando campos... 🕛",
                  // "Carregando campos.  🕐🕒🕔🕗🕘🕚🕛",
                ],
                delay: 200
              }, 
              component: <LoadingAwait />,
              trigger: '7',
            },
            {
              id: 'update-state',
              update: 'state',
              trigger: '7',
            },
            {
              id: 'state',
              options: allStates.map(state => ({
                value: state, label: state, trigger: 'update'
              })),
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
              id: 'update-complement',
              update: 'complement',
              trigger: '7',
            },
            {
              id: 'end-message',
              message: 'Agora confirme que você não é um Robô 🤖',
              trigger: 'captcha',
            },
            {
              id: 'captcha-failure',
              message: 'Porfavor resolva o CAPTCHA para avançar.',
              trigger: 'end-message',
            },
            {
              id: 'captcha',
              waitAction: { 
                text: [
                  "Carregando captcha.   🕐",
                  "Carregando captcha..  🕒",
                  "Carregando captcha... 🕔",
                  "Carregando captcha..  🕗",
                  "Carregando captcha.   🕘",
                  "Carregando captcha..  🕚",
                  "Carregando captcha... 🕛",
                  // "Carregando captcha.  🕐🕒🕔🕗🕘🕚🕛",
                ],
                delay: 200
              }, 
              component: <CaptchaComponent />,
              trigger: 'completed-message',
            },
            {
              id: 'completed-message',
              message: 'Obrigado! Seus dados foram enviados com sucesso! 🎉',
              trigger: 'completed-wait-contact',
            },
            {
              id: 'completed-wait-contact',
              message: 'Aguarde o nosso contato. ☎️',
              end: true,
            }
          ]}

          handleEnd={({renderedSteps, steps, values }) => {
            const fieldsWithValues = renderedSteps
            .filter(item => item.value !== undefined)
            .filter(item => item.value?.split?.('-')?.[0] !== "null");
            const fields = Object.assign(...fieldsWithValues.map(step => ({ [step.id]: step.value })));     
            onSubmitFormData({
              "captcha": fields['captcha'],
              "fantasia": fields['fantasyName'],
              "razao": fields['socialReason'],
              "cnpj": fields['cnpj'],
              "celular": fields['cell'],
              "email": fields['email'],
              "cep": fields['cep'],
              "logradouro": fields['street'],
              "numero": fields['number'],
              "bairro": fields['district'],
              "cidade": fields['city'],
              "estado": fields['state'],
              "produto_credito": fields['product'] === 'analize' || fields['product'] === 'analize+procedencia',
              "produto_veicular": fields['product'] === 'procedencia' || fields['product'] === 'analize+procedencia',
              "contato": fields['name'],
              "complemento": fields['complement'] || ""
            });
          }}
          />
      </Gradient>
      
        </View>
        
      </>
    );
}

export default SimpleForm;


const allDDDs = [
  // Centro-Oeste
  '61',
  '62', '64',
  '65', '66',
  '67',

// Nordeste
  '82',
   '71', '73', '74', '75', '77',
  '85', '88',
  '98', '99',
  '83',
  '81','87',
  '86', '89',
  '84',
  '79',

// Norte
'68',
'96',
'92', '97',
'91', '93', '94',
'69',
'95',
'63',

// Sudeste
'27', '28',
'31', '32', '33', '34', '35', '37', '38',
'21', '22', '24',
'11', '12', '13', '14', '15', '16', '17', '18', '19',

// Sul
'41', '42', '43', '44', '45', '46',
'51', '53', '54', '55',
'47', '48', '49',
];



const allStates = [
'AC',
'AL',
'AP',
'AM',
'BA',
'CE',
'DF',
'ES',
'GO',
'MA',
'MT',
'MS',
'MG',
'PA',
'PB',
'PR',
'PE',
'PI',
'RJ',
'RN',
'RS',
'RO',
'RR',
'SC',
'SP',
'SE',
'TO',
]


const CaptchaComponent = props => {
  const [captchaOpen, setCaptchaOpen] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);

  const onMessage = event => {
      setCaptchaOpen(true);


      if (event && event.nativeEvent.data) {
        if (['cancel', 'error', 'expired',].includes(event.nativeEvent.data)) {
            setCaptchaOpen(false);
            setHidden(true);
            props.triggerNextStep({ value: false, trigger: 'captcha-failure' });
            return;
        } else {
          console.log('Verified code from Google', event.nativeEvent.data);
          setCaptchaOpen(false);
          setTimeout(() => {
              setHidden(true);
              props.triggerNextStep({ value: event.nativeEvent.data, trigger: 'completed-message' });
            }, 1500);
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
              <script src="https://recaptcha.google.com/recaptcha/api.js?explicit&hl=${'pt-BR'}"></script> 
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
                    data-sitekey="${"6Lfzv0QiAAAAAGOMRt6AELvUwzcRQgj8H4DgkwiL"}" data-callback="onDataCallback"  
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
            baseUrl: 'https://www.google.com/recaptcha/api/siteverify?',
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}