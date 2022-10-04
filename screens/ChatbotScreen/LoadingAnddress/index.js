import React from 'react';
import { Text } from 'react-native';

import axios from 'axios';

const LoadingAnddress = props => {
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
}

export default React.memo(LoadingAnddress);