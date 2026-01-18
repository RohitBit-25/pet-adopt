import React, { useRef } from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';

const ConfettiOverlay = ({ visible, onAnimationFinish }) => {
    const confettiRef = useRef();

    if (!visible) return null;

    return (
        <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100
        }}
            pointerEvents="none"
        >
            <LottieView
                ref={confettiRef}
                source={require('../../assets/lottie/confetti.json')}
                autoPlay
                loop={false}
                style={{ width: '100%', height: '100%' }}
                onAnimationFinish={onAnimationFinish}
            />
        </View>
    );
};

export default ConfettiOverlay; 