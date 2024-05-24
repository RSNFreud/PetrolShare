import Button from '@components/button';
import {Text} from '@components/text';
import {useContext} from 'react';
import {View} from 'react-native';

import {AuthContext} from 'hooks/context';

type PropsType = {
    loading: boolean;
    text?: string;
    style?: 'regular' | 'ghost';
    handleClick: () => void;
    errors: string;
    distance: string;
    disabled?: boolean;
};

export default ({loading, handleClick, disabled, errors, distance, text, style}: PropsType) => {
    const {retrieveData} = useContext(AuthContext);

    return (
        <>
            <Button
                disabled={disabled}
                loading={loading}
                handleClick={handleClick}
                variant={style}
                text={`${text || 'Add Distance'} ${
                    distance ? `(${distance} ${retrieveData?.distance || ''})` : ''
                }`}
            />
            {!!errors && (
                <View
                    style={{
                        marginTop: 15,
                        backgroundColor: '#EECFCF',
                        borderRadius: 4,
                        paddingHorizontal: 20,
                        paddingVertical: 15,
                    }}
                >
                    <Text style={{color: '#7B1D1D', fontSize: 16, fontWeight: '400'}}>
                        {errors}
                    </Text>
                </View>
            )}
        </>
    );
};
