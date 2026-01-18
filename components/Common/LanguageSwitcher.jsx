import React from 'react';
import { View, Button } from 'react-native';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const currentLang = i18n.language;

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 12 }}>
            <Button
                title="English"
                onPress={() => i18n.changeLanguage('en')}
                color={currentLang === 'en' ? '#667eea' : undefined}
            />
            <View style={{ width: 12 }} />
            <Button
                title="Español"
                onPress={() => i18n.changeLanguage('es')}
                color={currentLang === 'es' ? '#667eea' : undefined}
            />
        </View>
    );
};

export default LanguageSwitcher; 