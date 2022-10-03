// import { useHeaderHeight } from '@react-navigation/stack';
import axios from 'axios';
import { cnpj, cpf } from 'cpf-cnpj-validator';
import React, { Component } from 'react';
import { validate } from 'react-email-validator';
import { Alert, Button, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { NativeModules, Platform, StatusBar } from 'react-native';
import * as FeatherIcon from 'react-native-feather';
import ConfirmGoogleCaptcha from 'react-native-google-recaptcha-v2';
import WebView from 'react-native-webview';

import ChatBot from '../components';
import Gradient from '../components/Gradient'

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
  
  return (
    <View style={{ flex: 1 }}>
      {props.fields?.map(field => (
        <View key={field.value}
          style={{  flex: 1 }}
        >
          <Text style={{ color: 'white', opacity: .6, fontSize: 18 }}>{field?.label + "\n gne"}: </Text>
          <Text style={{ color: 'white', fontSize: 16, marginBottom: 8 }}>{state?.[field?.value]?.value}</Text>
        </View>
      ))}
    </View>
  );
}

const SimpleForm = () => {
    // const height = useHeaderHeight();
    const [fields, setFields] = React.useState({})
    const [recaptcha, setRecaptcha] = React.useState(false)

    const captchaFormRef = React.useRef(null);

    async function onSubmitFormData (obj) {
      const bodyFormData = new FormData();
      Object.keys(obj).forEach(key => bodyFormData.append(key, obj[key]))
      const { data } = await axios({
        method: 'post',
        url: 'http://10.0.2.2/credconsultas_api/request/cadastro-test.php',
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    const LoadingAwait = React.useCallback(props => {
      const [message, setMessage] = React.useState('');
      React.useEffect(() => {
        axios.get(`https://viacep.com.br/ws/${props.steps['cep'].value}/json/`).then(({ data }) => {
          if (!data?.erro) {
            props.triggerNextStep({ 
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
            props.triggerNextStep({ trigger: 'cep-failure' });
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


    return (
      <>
      <StatusBar barStyle="light-content"  backgroundColor="black" />
      <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Gradient colors={['black', '#161316', '#161316']} opacitys={[1, .975, 1]} >
          <ChatBot style={{ backgroundColor: 'transparent', flex: 1 }} botDelay={400} hideBotAvatar hideHeader hideUserAvatar 
          userFontColor={"black"} userBubbleColor={"#ebeff5"}
          optionFontColor={"black"} optionBubbleColor={"#fafafa"}
          botFontColor={"#fafafa"} botBubbleColor={"#272527"} bubbleStyle={{ padding: 10, opacity: .7 }}
          submitButtonTextComponent={props => (
            <FeatherIcon.Send style={{ opacity: .8}} color="#ebeff5" width={24} height={24} />
          )}
          footerStyle={{ 
            backgroundColor: '#242124', borderTop: 0, padding: 12, 
          }}
          inputStyle={{ 
            backgroundColor: 'rgba(0,0,0,.2)', 
            borderRadius: 20, borderTopRightRadius: 0, borderBottomRightRadius: 0,
            color: '#fafafa', fontSize: 16, flex: 1,
            paddingLeft: 18,
          }}
          submitButtonStyle={{ 
            backgroundColor: 'rgba(0,0,0,.3)', fontSize: 16,  
            borderRadius: 20, borderTopLeftRadius: 0, borderBottomLeftRadius: 0,
            padding: 20, paddingLeft: 16
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
          steps={[
            {
              id: '0',
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
                { value: 'null-1', label: 'Sim', trigger: 'phone-quest' },
                { value: 'null-2', label: 'Não', trigger: 'socialReason-quest' },
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
              message: 'Informe o CNPJ',
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
              message: 'Informe o CEP',
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
                  <View style={{ flexDirection: 'row', paddingRight: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>{'Carregando campos.  '}</Text>
                    <Text style={{ position: 'absolute', right: 0, fontSize: 16, fontWeight: '500', color: 'black' }}>⏳</Text>
                  </View>,
                  <View style={{ flexDirection: 'row', paddingRight: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>{'Carregando campos.. '}</Text>
                    <Text style={{ transform: [{ rotate: '45deg' }], position: 'absolute', right: 0, fontSize: 16, fontWeight: '500', color: 'black' }}>⏳</Text>
                  </View>,
                  <View style={{ flexDirection: 'row', paddingRight: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>{'Carregando campos...'}</Text>
                    <Text style={{ position: 'absolute', right: 0, fontSize: 16, fontWeight: '500', color: 'black' }}>⏳</Text>
                  </View>,
                  <View style={{ flexDirection: 'row', paddingRight: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>{'Carregando campos.. '}</Text>
                    <Text style={{ transform: [{ rotate: '-45deg' }], position: 'absolute', right: 0, fontSize: 16, fontWeight: '500', color: 'black' }}>⏳</Text>
                  </View>,
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
              message: 'Há um complemento?',
              trigger: 'complement-require',
            },
            {
              id: 'complement-require',
              options: [
                { value: 'null-1', label: 'Sim', trigger: 'complement-quest' },
                { value: 'null-2', label: 'Não', trigger: '7' },
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
              message: 'Deseja atualizar algum campo? 🆙',
              trigger: 'update-init-question',
            },
            {
              id: 'update-init-question',
              options: [
                { value: 'null-1', label: 'Sim', trigger: 'update-init-yes' },
                { value: 'null-2', label: 'Não', trigger: 'review' },
              ],
            },
            {
              id: 'update-init-yes',
              message: 'Qual campo você deseja atualizar?',
              trigger: 'update-init-fields',
            },
            //state: 'SP', city: 'MAUÁ', district: 'JARDIM MARIA ENEIDA', street: "RUA ANTÔNIA DE OLIVEIRA"
            {
              id: 'update-init-fields',
              options: [
                { value: 'null-1', label: 'Nome*', trigger: 'update-name' },
                { value: 'null-2', label: 'Email*', trigger: 'update-email' },
                { value: 'null-3', label: 'Nome Fantasia*', trigger: 'update-fantasyName' },
                { value: 'null-4', label: 'Razão Social*', trigger: 'update-socialReason' },
                { value: 'null-5', label: 'Tipo de Produto*', trigger: 'update-product' },
                { value: 'null-6', label: 'CNPJ*', trigger: 'update-cnpj' },
                { value: 'null-7', label: 'Telefone*', trigger: 'update-cell' },
                { value: 'null-8', label: 'Telefone (2)', trigger: 'update-phone' },
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
                { label: "Rua", value: "street" }, 
                { label: "Número", value: "number" }, 
                { label: "Complemento", value: "complement" }, 
              ]} />,
              asMessage: true,
              trigger: 'update',
            },
            {
              id: 'update',
              message: 'Deseja atualizar algum campo? 🆙',
              trigger: 'update-question',
            },
            {
              id: 'update-question',
              options: [
                { value: 'null-1', label: 'Sim', trigger: 'update-yes' },
                { value: 'null-2', label: 'Não', trigger: 'end-message' },
              ],
            },
            {
              id: 'update-yes',
              message: 'Qual campo você deseja atualizar? 🆙',
              trigger: 'update-fields',
            },
            //state: 'SP', city: 'MAUÁ', district: 'JARDIM MARIA ENEIDA', street: "RUA ANTÔNIA DE OLIVEIRA"
            {
              id: 'update-fields',
              options: [
                { value: 'null-1', label: "CEP*", trigger: "update-cep" }, 
                { value: 'null-2', label: 'Estado*', trigger: 'update-state' },
                { value: 'null-3', label: 'Cidade*', trigger: 'update-city' },
                { value: 'null-4', label: 'Bairro*', trigger: 'update-district' },
                { value: 'null-5', label: 'Rua*', trigger: 'update-street' },
                { value: 'null-6', label: 'Número*', trigger: 'update-number' },
                { value: 'null-7', label: "Complemento", trigger: "update-complement" }, 
              ],
            },
            {
              id: 'update-cep',
              update: 'cep',
              trigger: ({ previousValue }) => !previousValue ? 'andress-reload' : 'andress-update-fields-quest',
            },
            {
              id: 'andress-update-fields-quest',
              message: 'Deseja atualizar (estado, cidade, bairro, rua, número e complemento) com base no CEP: {previousValue} ? 🔄🆙',
              trigger: 'andress-update-fields-require',
            },
            {
              id: 'andress-update-fields-require',
              options: [
                { value: 'null-1', label: 'Sim', trigger: 'andress-reload' },
                { value: 'null-2', label: 'Não', trigger: '7' },
              ],
            },
            {
              id: 'andress-reload',
              waitAction: { 
                text: [
                  <View style={{ flexDirection: 'row', paddingRight: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>{'Carregando campos.  '}</Text>
                    <Text style={{ position: 'absolute', right: 0, fontSize: 16, fontWeight: '500', color: 'black' }}>⏳</Text>
                  </View>,
                  <View style={{ flexDirection: 'row', paddingRight: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>{'Carregando campos.. '}</Text>
                    <Text style={{ transform: [{ rotate: '45deg' }], position: 'absolute', right: 0, fontSize: 16, fontWeight: '500', color: 'black' }}>⏳</Text>
                  </View>,
                  <View style={{ flexDirection: 'row', paddingRight: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>{'Carregando campos...'}</Text>
                    <Text style={{ position: 'absolute', right: 0, fontSize: 16, fontWeight: '500', color: 'black' }}>⏳</Text>
                  </View>,
                  <View style={{ flexDirection: 'row', paddingRight: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>{'Carregando campos.. '}</Text>
                    <Text style={{ transform: [{ rotate: '-45deg' }], position: 'absolute', right: 0, fontSize: 16, fontWeight: '500', color: 'black' }}>⏳</Text>
                  </View>,
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
              update: 'number',
              trigger: '7',
            },
            {
              id: 'end-message',
              message: 'Agora confirme que você não é um Robô 🤖',
              trigger: 'captcha',
            },
            {
              id: 'captcha',
              waitAction: true,
              // component: <ReCAPTCHALoadingAwait 
              //   onPress={() => captchaFormRef.current.show()}
              //   children={<Text style={{ textAlign: 'center', color: '#3266FF', textDecorationLine: 'underline', fontWeight: '500', fontSize: 16 }}>{'Não sou um robô'}</Text>}
              //   style={{ flex: 1 }}
              //   textColor='#fff'
              // />,
              component: <CaptchaComponent />,
              trigger: 'completed-message',
            },
            {
              id: 'completed-message',
              message: 'Obrigado! Seus dados foram enviados com sucesso! 🎉',
              end: true,
            }
          ]}

          handleEnd={({renderedSteps, steps, values }) => {
            const fieldsWithValues = renderedSteps
            .filter(item => item.value !== undefined)
            .filter(item => item.value?.split?.('-')?.[0] !== "null");
            const fields = Object.assign(...fieldsWithValues.map(step => ({ [step.id]: step.value })));
            setFields(fields);
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
              "produto_credito": fields['product'] === "analize",
              "produto_veicular": fields['product'] === "procedencia",
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
            // captchaFormRef?.current?.hide?.();
            setCaptchaOpen(false);
            setHidden(true);
            return;
        } else {
          console.log('Verified code from Google', event.nativeEvent.data);
          setCaptchaOpen(false);
          setTimeout(() => {
              setHidden(true);
              props.triggerNextStep({ value: true, trigger: 'completed-message' });
                // captchaFormRef?.current?.hide?.();
                // do what ever you want here
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
            width: 120, height: 76, backgroundColor: 'transparent', 
            position: 'absolute', zIndex: 2,
            right: 0, bottom: 0
          }} />
        </TouchableWithoutFeedback>}
        {captchaOpen && 
          <View style={{ 
            width: '100%', height: 40, backgroundColor: '#f9f9f9', 
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
            { backgroundColor: 'transparent', width: '100%', height: 76, transform: [{ scale: 1.05 }] },
            captchaOpen && {  width: '100%', height: 292 *2 }
          ]}
          source={{
            html: `<!DOCTYPE html>
            <html>
            <head> 
              <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta http-equiv="X-UA-Compatible" content="ie=edge"> 
              <script src="https://recaptcha.google.com/recaptcha/api.js?explicit&hl=${'pt-BR'}"></script> 
              <style>
                html, body {
                  overflow: hidden !important;
                }
                * {
                  padding: 0 !important;
                  margin: 0 !important;
                  box-sizing: border-box;
                  border-width: 0 !important;
                }
                #rc-anchor-container {
                  margin: 0 !important;
                  border: 0 !important;
                }
                #captcha iframe {
                  position: relative;
                  box-shadow: none !important;
                  border: 0px;
                }  
                .rc-anchor-pt {
                  display: none !important;
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
                <div style="text-align: center;">
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