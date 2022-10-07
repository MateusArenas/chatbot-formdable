import React from 'react';
import { Text } from 'react-native';
import axios from 'axios';

// import api from '../../../service/api';
import { clearLastSession } from '../LoadingLastSession'
import { useIsMounted } from '../../../hooks/useIsMounted'

const SubmitDataAction = props => {
  const [message, setMessage] = React.useState('');
  const isMounted = useIsMounted();

  React.useEffect(() => {
   
    const fields = Object.keys(props?.steps)
    .filter(key => props?.steps[key]?.value !== undefined)
    .reduce((acc, key) => ({ ...acc, [key]: props?.steps[key]?.value }), {});  

    const obj = {
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
    };
    // console.log({ obj });
    const bodyFormData = new FormData();
    //transform obj in formdata and check if false value for filter.
    Object.keys(obj).forEach(key => obj[key] && bodyFormData.append(key, obj[key]))

    // api.post('/cadastro', bodyFormData, { 
      //     headers: { "Content-Type": "multipart/form-data" }
      // })
        axios({
          method: 'post',
          url: 'http://10.0.2.2/credconsultas_api/cadastro',
          data: bodyFormData,
          headers: { 
            "Content-Type": "multipart/form-data",
            'token': ''
          },
        })
        .then(({ data }) => {
            console.log({ res: data });
            if (data?.warning || !data?.success) {
                if(isMounted.current) {
                    const alertText = (data?.warning || data?.error) || '';
                    setMessage(`Falha ao enviar dados. 🚫${alertText ? "\n\n"+alertText : ''}`)
                    props.triggerNextStep({ trigger: 'submit-data-failure-message' });
                } 
            } else if (data?.success) {
                if(isMounted.current) {
                    setMessage(`Dados enviados com sucesso. ✅`)
                    clearLastSession();
                    props.triggerNextStep({});
                }
            }
        }).catch(err => {
            if(isMounted.current) {
                console.log({ err });
                setMessage(`Falha ao enviar dados. 🚫`)
                props.triggerNextStep({ trigger: 'submit-data-failure-message' });
            }
        });
      // const { data } = await api.post('/cadastro', bodyFormData, { 
      //   headers: { "Content-Type": "multipart/form-data" }
      // })
  }, [])

  if (!message) return props?.loadingComponent

  return (
    <Text style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '500', color: 'black' }}>
      {message}
    </Text>
  )
}

export default React.memo(SubmitDataAction);