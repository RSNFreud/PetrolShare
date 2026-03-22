import {StyleSheet, View} from 'react-native';
import React, {ComponentProps, FC} from 'react';
import {FlatSession} from '../hooks/useFetchLogs';
import {Text} from '@components/layout/text';
import {Colors} from '@constants/colors';
import {ButtonBase} from '@components/layout/buttonBase';
import {Chevron} from 'src/icons/chevron';

type PropsType = {
    page: number;
    data?: FlatSession;
    changePage: (page: number) => void;
    maxPage: number;
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

export const Navigation: FC<PropsType> = ({page, data, changePage, maxPage}) => {
    const isFirstPage = page === 0;

    if (!data || !data.sessionStart) return null;

    const getDate = (date?: string) => {
        if (!date) return new Date().toLocaleDateString();
        return new Date(Number(date)).toLocaleDateString();
    };

    const Button: FC<
        ComponentProps<typeof ButtonBase> & {icon?: ComponentProps<typeof Chevron>}
    > = ({icon, disabled, onPress}) => (
        <ButtonBase
            disabled={disabled}
            style={[styles.button, {backgroundColor: isFirstPage ? '#242B42' : Colors.secondary}]}
            onPress={onPress}
        >
            <Chevron color={isFirstPage ? '#7A7E93' : 'white'} style={icon?.style} />
        </ButtonBase>
    );

    return (
        <View style={styles.container}>
            <Button icon={{style: styles.previous}} disabled={maxPage === page} />

            <Text style={styles.text}>
                {getDate(data.sessionStart)} - {getDate(data.sessionEnd || '')}
            </Text>
            <Button disabled={page === 0} onPress={() => changePage(page - 1)} />
        </View>
    );
};
