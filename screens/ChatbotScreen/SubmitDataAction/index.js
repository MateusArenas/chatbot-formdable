import axios from 'axios';
import React from 'react';

// import api from '../../../service/api';
import { clearLastSession } from '../LoadingLastSession'

const SubmitDataAction = props => {
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
      "produto_credito": fields['product'].find(key => key === 'analize') || fields['product'].find(key => (key === 'analize') || (key === 'procedencia')),
      "produto_veicular": fields['product'].find(key => key === 'procedencia') || fields['product'].find(key => (key === 'analize') || (key === 'procedencia')),
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
              props.triggerNextStep({ trigger: 'submit-data-failure-message' });
            } else if (data?.success) {
              clearLastSession();
              props.triggerNextStep({});
            }
        }).catch(err => {
            console.log({ err });
            props.triggerNextStep({ trigger: 'submit-data-failure-message' });
        });
}

export default SubmitDataAction;