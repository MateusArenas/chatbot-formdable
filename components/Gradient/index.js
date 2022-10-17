import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

const Gradient = ({ 
    colors=['rgb(255, 255, 255)', 'rgb(0,102,84)'], 
    opacitys=[1, 1],
    children,
    style,
}) => {
    return (
        <View style={[ { flex: 1 }, style ]} >
            <Svg height="100%" width="100%" style={ StyleSheet.absoluteFillObject }>
                <Defs>
                    <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        {colors?.map((color, index) => (
                            <Stop key={index} offset={index} stopColor={color} stopOpacity={opacitys?.[index] || 1}/>
                        ))}
                    </LinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#grad)"/>
            </Svg>
            { children }
        </View>
    );
};

export default Gradient;