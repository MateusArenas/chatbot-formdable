import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loading from '../common/Loading';
import CustomStepContainer from './CustomStepContainer';

const CustomStep = props => {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const { delay } = props;
    const { waitAction } = props.step;
    setTimeout(() => {
      setLoading(false);
      if (!waitAction) {
        props.triggerNextStep();
      }
    }, delay);

  }, [props]);

  const renderComponent = React.useCallback(() => {
    const { step, steps, previousStep, triggerNextStep } = props;
    const { component } = step;
    return React.cloneElement(component, {
      step,
      steps,
      previousStep,
      triggerNextStep,
    });
  }, [])

    return (
      <CustomStepContainer
        className="rsc-cs"
        style={[props?.style, props?.step?.metadata?.hide && { 
          backgroundColor: 'transparent', borderColor: 'transparent',
          display: loading ? 'flex' : 'none'
        } ]}
      >
        {
          loading ? (
            <Loading
              color={props?.step?.loadingColor}
              custom={true}
            />
          ) : renderComponent()
        }
      </CustomStepContainer>
    );
}

export default React.memo(CustomStep);

