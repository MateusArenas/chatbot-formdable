import axios from 'axios';
import { cnpj, cpf } from 'cpf-cnpj-validator';
import React, { Component } from 'react';
import { validate } from 'react-email-validator';
import { Text, View } from 'react-native';
import { NativeModules, Platform, StatusBar } from 'react-native';

// import { useHeaderHeight } from '@react-navigation/stack';
import ChatBot from '../components';
import Gradient from '../components/Gradient'

const { StatusBarManager } = NativeModules;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

const Review = React.memo((props) => {
  const [state, setState] = React.useState({})
  React.useEffect(() => { setState(props.steps) }, [])
  return (
    <View style={{ width: '100%' }}>
      {props.fields?.map(field => (
        <View key={field.value}
          style={{  width: '100%'}}
        >
          <Text style={{ color: 'white', opacity: .5, fontSize: 16 }}>{field?.label}: </Text>
          <Text style={{ color: 'white', fontSize: 16 }}>{state?.[field?.value]?.value}</Text>
        </View>
      ))}
    </View>
  );
})

const SimpleForm = () => {
    // const height = useHeaderHeight();
    const [fields, setFields] = React.useState({})

    React.useEffect(() => {
      console.log({ fields });
    }, [fields])

    const LoadingAwait = React.useCallback(props => {
      React.useEffect(() => {
        axios.get(`https://viacep.com.br/ws/${props.steps['cep'].value}/json/`).then(({ data }) => {
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
        })
      }, [])

      return null
    }, [])

    return (
      <>
      <StatusBar barStyle="light-content"  backgroundColor="black" />
      <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Gradient colors={['black', '#161316', '#161316']} opacitys={[1, .975, 1]} >
          <ChatBot style={{ backgroundColor: 'transparent' }} botDelay={250} hideBotAvatar hideHeader hideUserAvatar 
          userFontColor={"black"} userBubbleColor={"#6f6c6c"}
          optionFontColor={"black"} optionBubbleColor={"#fafafa"}
          botFontColor={"#fafafa"} botBubbleColor={"#272527"} bubbleStyle={{ padding: 10, opacity: .7 }}
          footerStyle={{ backgroundColor: '#242124', borderTop: 0 }}
          inputStyle={{ backgroundColor: 'rgba(0,0,0,.2)', color: '#fafafa', fontSize: 16 }}
          submitButtonStyle={{ backgroundColor: 'rgba(0,0,0,.3)', fontSize: 16 }}
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
              message: "Olá!😄",
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
              options: [
                { value: 'yes', label: 'Sim', trigger: 'phone-quest' },
                { value: 'no', label: 'Não', trigger: 'socialReason-quest' },
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
              inputAttributes: { type: 'cnpj' },
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
              id: 'andress',
              waitAction: true, metadata: { hide: true },
              component: <LoadingAwait />,
              trigger: 'number-quest',
            },
            //state: 'SP', city: 'MAUÁ', district: 'JARDIM MARIA ENEIDA', street: "RUA ANTÔNIA DE OLIVEIRA"
            {
              id: 'number-quest',
              message: 'Número do endereço?',
              trigger: 'number',
            },
            {
              id: 'number',
              user: true,
              trigger: 'complement-require-quest',
              inputAttributes: { keyboardType: "number-pad" },
              validator:  (value) => {
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
                { value: 'yes', label: 'Sim', trigger: 'complement-quest' },
                { value: 'no', label: 'Não', trigger: '7' },
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
              trigger: '7',
            },
            {
              id: '7',
              message: 'Vamos lá falta pouco!😉',
              trigger: 'review-init',
            },
            //aqui
            {
              id: 'review-init',
              component: <Review fields={[
                { label: "Nome", value: "name" }, 
                { label: "Email", value: "email" }, 
                { label: "Nome Fantasia", value: "fantasyName" }, 
                { label: "Razão Social", value: "socialReason" }, 
                { label: "Tipo de Produto", value: "product" }, 
                { label: "CNPJ", value: "cnpj" }, 
              ]} />,
              asMessage: true,
              trigger: 'update-init',
            },
            {
              id: 'update-init',
              message: 'Deseja atualizar algum campo?',
              trigger: 'update-init-question',
            },
            {
              id: 'update-init-question',
              options: [
                { value: 'yes', label: 'Sim', trigger: 'update-init-yes' },
                { value: 'no', label: 'Não', trigger: 'review' },
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
                { value: 'update-name', label: 'Nome*', trigger: 'update-name' },
                { value: 'update-email', label: 'Email*', trigger: 'update-email' },
                { value: 'update-fantasyName', label: 'Nome Fantasia*', trigger: 'update-fantasyName' },
                { value: 'update-socialReason', label: 'Razão Social*', trigger: 'update-socialReason' },
                { value: 'update-product', label: 'Tipo de Produto*', trigger: 'update-product' },
                { value: 'update-cnpj', label: 'CNPJ*', trigger: 'update-cnpj' },
                
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
            //fim aqui
            //state: 'SP', city: 'MAUÁ', district: 'JARDIM MARIA ENEIDA', street: "RUA ANTÔNIA DE OLIVEIRA"

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
              component: <Review fields={[
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
              message: 'Deseja atualizar algum campo?',
              trigger: 'update-question',
            },
            {
              id: 'update-question',
              options: [
                { value: 'yes', label: 'Sim', trigger: 'update-yes' },
                { value: 'no', label: 'Não', trigger: 'end-message' },
              ],
            },
            {
              id: 'update-yes',
              message: 'Qual campo você deseja atualizar?',
              trigger: 'update-fields',
            },
            //state: 'SP', city: 'MAUÁ', district: 'JARDIM MARIA ENEIDA', street: "RUA ANTÔNIA DE OLIVEIRA"
            {
              id: 'update-fields',
              options: [
                { value: 'update-cep', label: "CEP*", trigger: "update-cep" }, 
                { value: 'update-state', label: 'Estado*', trigger: 'update-state' },
                { value: 'update-city', label: 'Cidade*', trigger: 'update-city' },
                { value: 'update-district', label: 'Bairro*', trigger: 'update-district' },
                { value: 'update-street', label: 'Rua*', trigger: 'update-street' },
                { value: 'update-number', label: 'Número*', trigger: 'update-number' },
                { value: 'update-complement', label: "Complemento", trigger: "update-complement" }, 
              ],
            },
            {
              id: 'update-cep',
              update: 'cep',
              trigger: 'andress-update-fields-quest',
            },
            {
              id: 'andress-update-fields-quest',
              message: 'Deseja atualizar (estado, cidade, bairro, rua, número e complemento) com base no CEP: {previousValue} ?',
              trigger: 'andress-update-fields-require',
            },
            {
              id: 'andress-update-fields-require',
              options: [
                { value: 'yes-7', label: 'Sim', trigger: 'andress-reload' },
                { value: 'no-1', label: 'Não', trigger: '7' },
              ],
            },
            {
              id: 'andress-reload',
              waitAction: true, metadata: { hide: true },
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
              message: 'Obrigado! Seus dados foram enviados com sucesso!🎉',
              end: true,
            },
          ]}

          handleEnd={({renderedSteps, steps, values }) => {
            const fields = renderedSteps.filter(step => step.value !== undefined).map(step => ({ [step.id]: step.value }))
            setFields(Object.assign(...fields))
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