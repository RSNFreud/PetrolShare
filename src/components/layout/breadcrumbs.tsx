import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {Href, Link} from 'expo-router';
import Svg, {SvgProps, Path} from 'react-native-svg';
import {Text} from './text';

type PropsType = {
    pages: {label: string; href?: Href}[];
};

const styles = StyleSheet.create({
    text: {
        fontSize: 14,
        lineHeight: 18,
    },
    container: {
        gap: 5,
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        paddingTop: 20,
        paddingBottom: 30,
    },
    chevron: {
        marginTop: 1,
    },
});

const Chevron = (props: SvgProps) => (
    <Svg width={7} height={7} fill="none" {...props}>
        <Path
            fill="currentColor"
            d="M5.783 3.68.923 1.786V.48L6.76 3.064v.8l-.978-.184ZM.923 5.348l4.874-1.935.964-.143v.792L.923 6.654V5.348Z"
        />
    </Svg>
);

export const Breadcrumbs: FC<PropsType> = ({pages}) => {
    const renderLabel = (label: string, isBold: boolean, href?: Href) => {
        const text = (
            <Text bold={isBold} style={styles.text}>
                {label}
            </Text>
        );
        if (!href) return text;
        return <Link href={href}>{text}</Link>;
    };

    return (
        <View style={styles.container}>
            {pages.map(({label, href}, index) => (
                <React.Fragment key={label}>
                    {renderLabel(label, index !== pages.length - 1, href)}
                    {index !== pages.length - 1 && (
                        <View style={styles.chevron}>
                            <Chevron color="white" style={styles.chevron} />
                        </View>
                    )}
                </React.Fragment>
            ))}
        </View>
    );
};
