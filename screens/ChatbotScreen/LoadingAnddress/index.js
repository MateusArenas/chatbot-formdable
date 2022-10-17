import axios from 'axios';
import React from 'react';
import { Text } from 'react-native';

import { useIsMounted } from '../../../hooks/useIsMounted'

const LoadingAnddress = props => {
  // const [message, setMessage] = React.useState('');

  // const isMounted = useIsMounted();

  // React.useEffect(() => {
    axios.get(`https://viacep.com.br/ws/${props.steps['cep'].value}/json/`).then(({ data }) => {
      if (!data?.erro) {
        // if(isMounted.current) {
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
          // setMessage(`Dados relativos ao cep carregados. ✅`)
        // }
      } else {
        // if(isMounted.current) { 
          props.triggerNextStep({ trigger: 'cep-failure', value: false });
          // setMessage(`Falha ao carregar campos. 🚫`)
        // }
      }
    })
  // }, [])

  // if (!message) return props?.loadingComponent

  // return (
  //   <Text style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '500', color: 'black' }}>
  //     {message}
  //   </Text>
  // )
}

export default LoadingAnddress;
// export default React.memo(LoadingAnddress);