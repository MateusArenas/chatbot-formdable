import React from 'react';
import { Text } from 'react-native';

const Review = (props) => {
  const [state, setState] = React.useState({});
  React.useEffect(() => { setState(props.steps) }, []);

  const uninformed = "Não informado.";
  const text = props.fields.reduce((fulltext, field) => fulltext+field?.label+": "+"\n"+(state?.[field?.value]?.value||uninformed)+"\n\n","");

  return (
    <>
      <Text style={{ color: '#2c353e', opacity: .9, fontSize: 16 }}>{props.title+'\n\n'}</Text>
      <Text style={{ color: '#2c353e', opacity: .9, fontSize: 16 }}>{text.substring(0, text.length - 2)}</Text>
    </>
  )
}

export default React.memo(Review);
