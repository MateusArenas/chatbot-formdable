import { useHeaderHeight } from '@react-navigation/elements';
import axios from 'axios';
import { cnpj, cpf } from 'cpf-cnpj-validator';
import React, { Component } from 'react';
import { validate } from 'react-email-validator';
import { ActivityIndicator, Alert, Animated, Image, TouchableOpacity, View } from 'react-native';
import { Linking, NativeModules, Platform, StatusBar } from 'react-native';
import * as FeatherIcon from 'react-native-feather';

import { BottomSheetModal } from '../../components/Chatbot/BottomSheetModal'
import DotsLoading from '../../components/Chatbot/steps/common/DotsLoading'

const { StatusBarManager } = NativeModules;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : (StatusBarManager?.HEIGHT || 0);

import asyncLoadingLastSession, { 
  setLastSession, 
  clearLastSession, 
  RELOAD_LAST_SESSION_KEY 
} from './LoadingLastSession'
import DataReview from './DataReview';
import LoadingAnddress from './LoadingAnddress'
import CaptchaComponent from './CaptchaComponent'
import SubmitDataAction from './SubmitDataAction'

// import api from '../../service/api';

import ChatBot from '../../components/Chatbot';
import Gradient from '../../components/Gradient';
import ContactWhatsappAction from './ContactWhatsappAction';
import LoadingCNPJ from './LoadingCNPJ';

const SimpleForm = () => {
    const height = useHeaderHeight();

    const theme = {
      light: {
        gradientColors: ['white', '#ece9e4', '#ece9e4'],
        gradientOpacitys: [1, .8, .8],
        optionFontColor: "#2c2a2a", optionBubbleColor: "#fafafa",
        userFontColor: "#fafafa", userBubbleColor: "#0073f2",
        botFontColor: "#2c353e", botBubbleColor: "#fafafa",
        sendIconColor: "#fafafa",
        footerBackgroundColor: '#ffffff',
        inputTextColor: '#2c2a2a',
        inputBackgroundColor: 'rgba(0,0,0,.025)',
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


    return (
      <>
      <StatusBar barStyle="light-content"  backgroundColor="black" />
      <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Gradient colors={theme['light'].gradientColors} opacitys={theme['light'].gradientOpacitys} >
          <ChatBot style={{ backgroundColor: 'transparent', flex: 1 }} 
          botDelay={400} 
          inputAttributes={{
            placeholderTextColor: theme['light'].inputPlaceholderTextColor,
            keyboardAppearance: 'light'
          }}
          // hideBotAvatar 
          // headerComponent={
          //   <View style={{ 
          //     height: 80, width: "100%", backgroundColor: 'gray',
          //     alignItems: 'flex-end', justifyContent: 'space-between',
          //   }}
          //   >
          //     <View style={{ flex: 1, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'red' }}>
          //       <TouchableOpacity onPress={() => {}}>
          //         <FeatherIcon.MessageCircle 
          //             width={24} height={24} 
          //             color={theme['light'].sendIconColor} 
          //         />
          //       </TouchableOpacity>
          //     </View>
          //   </View>
          // }
          hideHeader={false} 
          hideUserAvatar 
          userFontColor={theme['light'].userFontColor} 
          userBubbleColor={theme['light'].userBubbleColor}
          optionFontColor={theme['light'].optionFontColor} 
          optionBubbleColor={theme['light'].optionBubbleColor}
          botFontColor={theme['light'].botFontColor} 
          botBubbleColor={theme['light'].botBubbleColor} 
          bubbleStyle={{ padding: 10, opacity: 1 }}
          submitButtonTextComponent={props => (
            <FeatherIcon.Send style={{ opacity: 1 }} 
              width={24} height={24} 
              color={theme['light'].sendIconColor} 
            />
          )}
          footerStyle={{ 
            borderTop: 0, padding: 12, 
            backgroundColor: theme['light'].footerBackgroundColor, 
            position: 'relative', 
          }}
          inputStyle={{ 
            backgroundColor: theme['light'].inputBackgroundColor,
            borderWidth: 1, borderColor: "rgba(0,0,0,.05)",
            borderRadius: 20, 
            color: theme['light'].inputTextColor, fontSize: 16, 
            flex: 1,
            paddingLeft: 18,
          }}
          submitButtonStyle={{ 
            // backgroundColor: "#0474fe", 
            // fontSize: 16,  
            // borderWidth: 1, borderColor: "white", borderLeftWidth: 0,
            // borderRadius: 20, 
            // borderTopLeftRadius: 0, borderBottomLeftRadius: 0,
            // padding: 20, paddingLeft: 16,
            // margin: 10, marginLeft: 0,
            // position: "relative"
          }}
          submitButtonContent={"Enviar"}
          placeholder={"Digite aqui..."}
          scrollViewProps={{ 
            contentContainerStyle: {
              paddingTop: height || STATUSBAR_HEIGHT,
              paddingBottom: 0 || STATUSBAR_HEIGHT,
              flexGrow: 1, justifyContent: 'flex-end',
            }
          }}
          contentStyle={{ backgroundColor: 'transparent', borderBottom: 0, padding: 12 }}
          keyboardVerticalOffset={0}
          handleStep={({ step, data, ...props }) => {
            setLastSession({ step, overwrite: data?.overwrite, ...props })
            // console.log({ step, overwrite: data?.overwrite });
          }}
          steps={[
            {
              id: 'reload-last-session',
              waitAction: true,
              replace: true,
              event: props => asyncLoadingLastSession(props),
              trigger: 'initialize',
            },
            {
              id: RELOAD_LAST_SESSION_KEY,
              message: "Deseja continuar com os dados anteriores ou iniciar uma nova consulta?",
              trigger: 'reload-last-session-require'
            },
            {
              id: 'reload-last-session-require',
              title: 'Deseja continuar com os dados anteriores ou iniciar uma nova consulta?',
              inputAttributes: {
                placeholder: "Escolha uma opção",
              },
              options: [
                { key: "1", label: 'Refazer', trigger: 'redo' },
                { key: "2", label: 'Continuar', trigger: ({ steps }) => steps['lastTrigger']?.value, primary: true },
              ],
            },
            {
              id: "redo",
              replace: true,
              waitAction: true, 
              event: props => clearLastSession().then(() => props.triggerNextStep({})),
              trigger: 'initialize'
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
            { /////                      TESTE
              id: 'changes',
              title: 'Qual campo você quer mudar?',
              type: "unique",
              options: [
                { key: '1', label: 'Name*', field: "name", trigger: "update-name" },
                { key: '2', label: 'Email*', field: "email", trigger: "update-email"  },
                { key: '3', label: 'Nome Fantasia*', field: "fantasyName", trigger: "update-fantasyName"  },
                { key: '4', label: 'Razão Social*', field: "socialReason", trigger: "update-socialReason"  },
                { key: '5', label: 'Tipo de Produto*', field: "product", trigger: "update-product"  },
                { key: '6', label: 'CNPJ*', field: "cnpj", trigger: "update-cnpj"  },
                { key: '7', label: 'Telefone*', field: "cell", trigger: "update-cell"  },
                { key: '8', label: 'Telefone (2)', field: "cell", trigger: "update-phone"  },
                { key: '9', label: "CEP*", field: "cep", trigger: "update-cep" }, 
                { key: '10', label: 'Estado*', field: "state", trigger: 'update-state' },
                { key: '11', label: 'Cidade*', field: "city", trigger: 'update-city' },
                { key: '12', label: 'Bairro*', field: "district", trigger: 'update-district' },
                { key: '13', label: 'Logradouro*', field: "street", trigger: 'update-street' },
                { key: '14', label: 'Número*', field: "number", trigger: 'update-number' },
                { key: '15', label: "Complemento", field: "complement", trigger: "update-complement" }, 
              ],
            }, ///                      TESTE FIM
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
              message: 'Olá {previousValue}! Quais produtos deseja contratar?',
              trigger: 'product',
            },
            {
              id: 'product',
              title: 'Quais produtos você quer contratar?',
              type: "multiple",
              trigger: 'email-quest',
              options: [
                { value: 'analize', label: 'Análise de Crédito' },
                { value: 'procedencia', label: 'Procedência Veicular' },
                // { value: 'analize+procedencia', label: 'Análise de Crédito + Procedência Veicular', trigger: 'email-quest' },
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
                { key: "1", label: "Não", trigger: 'cnpj-quest' },
                { key: "2", label: "Sim", trigger: 'phone-quest', primary: true },
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
              trigger: 'cnpj-quest',
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
              trigger: 'cnpj-get',
            },
            {
              id: 'cnpj-get',
              replace: true,
              waitAction: true, 
              event: LoadingCNPJ,
              trigger: 'andress-update-fields-quest',
            },
            { 
              id: 'cnpj-failure',
              message: 'CNPJ não encontrado, porfavor insira um válido.',
              trigger: 'update-cnpj',
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
              message: 'CEP não encontrado, porfavor insira um válido.',
              trigger: 'update-cep',
            },
            {
              id: 'andress',
              replace: true,
              waitAction: true, 
              event: LoadingAnddress,
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
                { key: '1', label: "Não", trigger: '7' },
                { key: '2', label: "Sim", trigger: 'complement-quest', primary: true },
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
              trigger: 'update-init',
            },
            {
              id: 'update-init',
              message: 'Deseja atualizar algum campo ou continuar?',
              trigger: 'update-init-question',
            },
            {
              id: 'update-init-question',
              options: [
                { key: '1', label: 'Atualizar', trigger: 'changes', freeze: true },
                { key: '2', label: 'Continuar', trigger: 'end-message', primary: true },
              ],
            },
            // {
            //   id: 'update-init-yes',
            //   message: 'Qual campo deseja atualizar?',
            //   trigger: 'update-init-fields',
            // },
            {
              id: 'update-name',
              update: 'name',
              trigger: 'update-init',
            },
            {
              id: 'update-email',
              update: 'email',
              trigger: 'update-init',
            },
            {
              id: 'update-fantasyName',
              update: 'fantasyName',
              trigger: 'update-init',
            },
            {
              id: 'update-socialReason',
              update: 'socialReason',
              trigger: 'update-init',
            },
            {
              id: 'update-product',
              update: 'product',
              trigger: 'update-init',
            },
            {
              id: 'update-cnpj',
              update: 'cnpj',
              trigger: 'update-init',
            },
            {
              id: 'update-cell',
              update: 'cell',
              trigger: 'update-init',
            },
            {
              id: 'update-phone',
              update: 'phone',
              trigger: 'update-init',
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
              trigger: 'update-init',
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
              trigger: 'update-init',
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
              trigger: 'update-init',
            },
            // {
            //   id: 'update-yes',
            //   message: 'Qual campo deseja atualizar? 🆙',
            //   trigger: 'update-fields',
            // },
            {
              id: 'update-cep',
              update: 'cep',
              trigger: ({ steps }) => {
                const askwantchange = ['state', 'city', 'district', 'street'].reduce((acc, key) => (acc&&steps[key]?.value), true);
                return !askwantchange ? 'andress' : 'andress-update-fields-quest'
              },
            },
            {
              id: 'andress-update-fields-quest',
              message: ({ steps, previousValue }) => `Deseja atualizar os campos de endereço com base no CEP ${steps["cep"]?.value || previousValue} ?`,
              trigger: 'andress-update-fields-require',
            },
            {
              id: 'andress-update-fields-require',
              options: [
                { key: '1', label: "Não", trigger: ({ steps }) => (!!steps["andress"]?.value) ? '7' : "cep-quest" },
                { key: '2', label: "Sim", trigger: 'andress', primary: true },
              ],
            },
            {
              id: 'andress-reload',
              waitAction: true, 
              event: LoadingAnddress,
              replace: true,
              trigger: '7',
            },
            {
              id: 'state',
              user: true,
              inputAttributes: { autoFoucus: true },
              suggestions: allStates,
              validator: (value) => {
                if (!allStates.includes(value)) {
                  return 'Selecione um dos apresentados.';
                } 
                return true;
              },
              trigger: 'update-init',
              // options: allStates.map(state => ({
              //   value: state, label: state, trigger: 'update-init'
              // })),
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
              id: 'update-complement',
              update: 'complement',
              trigger: '7',
            },
            {
              id: 'end-message',
              message: 'Resolva o captcha para avançar',
              trigger: 'captcha',
            },
            {
              id: 'captcha-failure',
              message: 'Porfavor resolva o captcha para avançar.',
              trigger: 'end-message',
            },
            {
              id: 'captcha',
              waitAction: true, 
              replace: true,
              component: <CaptchaComponent />,
              trigger: 'captcha-completed',
            },
            {
              id: 'captcha-completed',
              message: 'Ok você não é um robô.\npodemos continuar',
              trigger: 'submit-data',
            },
            {
              id: 'submit-data',
              waitAction: true, 
              replace: true,
              event: SubmitDataAction,
              trigger: 'completed-message',
            },
            {
              id: 'submit-data-failure-message',
              link: value => ContactWhatsappAction("5511963763329", "oi"),
              message: 'Não foi possível enviar os seus dados, tente mais tarde ou entre em contato conosco.\n{link:+55 (11) 96376-3329}',
              trigger: 'submit-data-failure-action',
            },
            {
              id: 'submit-data-failure-action',
              inputAttributes: { placeholder: "Escolha uma opção" },
              options: [
                { key: "1", label: 'Revisar campos', trigger: 'update-init' },
                { key: "2", label: 'Tentar novamente', trigger: 'captcha', primary: true },
                // { key: "3", label: 'Entrar em contato', trigger: 'rca-whatsapp' },
              ],
            },
            // {
            //   id: 'rca-whatsapp',
            //   waitAction: true, 
            //   // component: (
            //   //   <ContactWhatsappAction phone={"5511963763329"} text={"oi"} />
            //   // ),
            //   replace: true,
            //   trigger: 'submit-data-failure-message',
            // },
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
            // const fieldsWithValues = renderedSteps
            // .filter(item => item.value !== undefined)
            // .filter(item => item.value?.split?.('-')?.[0] !== "null");
            // const fields = Object.assign(...fieldsWithValues.map(step => ({ [step.id]: step.value })));     
            // onSubmitFormData({
            //   "captcha": fields['captcha'],
            //   "fantasia": fields['fantasyName'],
            //   "razao": fields['socialReason'],
            //   "cnpj": fields['cnpj'],
            //   "celular": fields['cell'],
            //   "email": fields['email'],
            //   "cep": fields['cep'],
            //   "logradouro": fields['street'],
            //   "numero": fields['number'],
            //   "bairro": fields['district'],
            //   "cidade": fields['city'],
            //   "estado": fields['state'],
            //   "produto_credito": fields['product'] === 'analize' || fields['product'] === 'analize+procedencia',
            //   "produto_veicular": fields['product'] === 'procedencia' || fields['product'] === 'analize+procedencia',
            //   "contato": fields['name'],
            //   "complemento": fields['complement'] || ""
            // });
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




