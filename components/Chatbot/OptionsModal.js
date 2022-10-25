import React from 'react';
import { View, Dimensions, Text, TouchableOpacity, ScrollView } from 'react-native';

import Gradient from "../Gradient";

import BottomSheetModal from './BottomSheetModal';
import Radiobox from './steps/common/Radiobox'
import Checkbox from './steps/common/Checkbox'

const OptionsModal = ({ visible, onDismiss, onSubmit, currentStep, state }) => {
  const [selecteds, setSelecteds] = React.useState([]);

  return (
    <BottomSheetModal visible={visible}
      onDismiss={() => {
        setSelecteds([]);
        onDismiss?.();
      }}
      >
          <View style={{ marginBottom: 24, marginTop: 8 }}>
            {currentStep?.title && <Text style={{ fontSize: 18, fontWeight: '500', textAlign: 'center' }}>{currentStep?.title}</Text>}
          </View>
          <View style={{ position: 'relative', borderRadius: 12, overflow: 'hidden' }}>

            <View style={{ width: '100%', height: 20, position: 'absolute', bottom: 0, zIndex: 1 }}>
              <Gradient colors={["#fefefe", "#fefefe"]} opacitys={[.6, 0]} 
              />
            </View>

            <ScrollView style={{ 
              maxHeight: (Dimensions.get('screen').height/2)-36,
              backgroundColor: 'rgba(0,0,0,.02)',
              paddingBottom: 20, 
            }}
            >
              {currentStep?.options?.map((option, index) => (
                <TouchableOpacity key={index} 
                  style={[
                    { padding: 8, paddingBottom: 12, paddingTop: 12, paddingHorizontal: 20 },
                    { borderBottomWidth: (index < (currentStep?.options.length-1)) ? 1.5 : 0, borderColor: 'rgba(0,0,0,.05)' }
                  ]}
                  onPress={() => {
                    const value = (option?.key || option?.value);
                    const selected = selecteds.find(selected => (selected === value));

                    if (currentStep?.type === "multiple") {
                      setSelecteds(selecteds => {
                        if (selected) {
                          return selecteds.filter(selected => (selected !== value));
                        } else {
                          return [...selecteds, value];
                        }
                      })
                    } else {
                      if (selected) {
                        setSelecteds([]);
                      } else {
                        setSelecteds([value])
                      }
                    }
                  }}
                >
                  {(
                        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <View>
                            <Text style={{ fontSize: 16, fontWeight: '500' }}>{option?.label}</Text>
                            {!!option?.field && (
                              <Text style={{ fontSize: 14, marginTop: 4, fontWeight: '500', opacity: .5 }}>
                                { 
                                  Array.isArray(state?.previousSteps.find(step => step.id === option?.field)?.value) ?
                                  state?.previousSteps.find(step => step.id === option?.field)?.value?.join(" + ")
                                  : state?.previousSteps.find(step => step.id === option?.field)?.value
                                || "Não informado."}
                              </Text>
                            )}
                          </View>
                          {(currentStep?.type === "multiple" ? (
                            <Checkbox color={selecteds.find(selected => (selected === (option?.key || option?.value))) ? '#0474fe' : 'black'} 
                              size={24}
                              marked={!!selecteds.find(selected => (selected === (option?.key || option?.value)))}
                            />
                          ) : (
                            <Radiobox color={selecteds.find(selected => (selected === (option?.key || option?.value))) ? '#0474fe' : 'black'} 
                              size={24}
                              marked={!!selecteds.find(selected => (selected === (option?.key || option?.value)))}
                            />
                          ))}
                        </View>
                    ) 
                  }
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
            <TouchableOpacity style={[
              { flexGrow: 1, padding: 18, borderRadius: 20, backgroundColor: '#0474fe' },
              !selecteds.length && { opacity: .5, backgroundColor: "black" }
            ]}
              // disabled={!selecteds.length}
              onPress={() => {
                if (selecteds.length) {
                  if (!currentStep?.type === "multiple") {
                    const { key, value, trigger } = currentStep?.options.find(option => {
                      const selected = selecteds.find(selected => (selected === (option?.key || option?.value)));
                      return (option?.key || option?.value) === selected;
                    });
                    onSubmit?.({ key, value, trigger, id: currentStep.id })
                  } else {
                    const options = selecteds.map(selected => {
                      const option = currentStep?.options?.find(option => (selected === (option?.key || option?.value)));
                      return option;
                    });

                    const key = selecteds.join('+');
                    const value = options.map(option => option.value);
                    const label = options.map(option => option.label).join(options.length > 1 ? ' + ' : '');

                    console.log({ key, value, label });

                    onSubmit?.({ key, value, type: "multiple", label, id: currentStep.id  })
                  }
                }
                onDismiss?.();
              }}>
              <Text style={{ textAlign: 'center', textTransform: 'uppercase', fontWeight: '500', fontSize: 14, color: 'white' }}>{!selecteds.length ? "Voltar" : 'Confirmar'}</Text>
            </TouchableOpacity>
    </BottomSheetModal>
  )
}

export default OptionsModal;