import {StyleSheet, View} from 'react-native';
import React, {FC} from 'react';
import {FlatSession} from '../hooks/useFetchLogs';
import {Text} from '@components/layout/text';
import {Colors} from '@constants/colors';
import {ButtonBase} from '@components/layout/buttonBase';
import {Chevron} from 'src/icons/chevron';

type PropsType = {
    page: number;
    data?: FlatSession;
    changePage: (page: number) => void;
};

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    button: {
        width: 30,
        height: 30,
        borderRadius: 4,
        backgroundColor: Colors.secondary,
        borderColor: Colors.border,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    previous: {
        transform: [{rotate: '180deg'}],
    },
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export const Navigation: FC<PropsType> = ({page, data, changePage}) => {
    const isFirstPage = page === 0;

    if (!data || !data.sessionStart) return null;

    const getDate = (date?: string) => {
        if (!date) return new Date().toLocaleDateString();
        return new Date(Number(date)).toLocaleDateString();
    };

    return (
        <View style={styles.container}>
            <ButtonBase style={styles.button} onPress={() => changePage(page + 1)}>
                <Chevron color={'white'} style={styles.previous} />
            </ButtonBase>
            <Text style={styles.text}>
                {getDate(data.sessionStart)} - {getDate(data.sessionEnd || '')}
            </Text>
            <ButtonBase
                disabled={page === 0}
                style={[
                    styles.button,
                    {backgroundColor: isFirstPage ? '#242B42' : Colors.secondary},
                ]}
                onPress={() => changePage(page - 1)}
            >
                <Chevron color={isFirstPage ? '#7A7E93' : 'white'} />
            </ButtonBase>
        </View>
    );
};
