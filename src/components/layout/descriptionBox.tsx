import {StyleSheet, View} from 'react-native';
import {Text} from './text';
import {Colors} from '@constants/colors';
import {ComponentProps} from 'react';

const styles = StyleSheet.create({
    container: {
        gap: 10,
        borderRadius: 4,
        borderColor: Colors.border,
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderStyle: 'solid',
        flexDirection: 'row',
    },
    text: {
        fontSize: 14,
        lineHeight: 18,
    },
    textContainer: {
        paddingVertical: 8,
        paddingRight: 10,
        flexShrink: 1,
    },
    verticalLine: {
        width: 4,
        backgroundColor: Colors.highlight,
        height: '100%',
    },
});

export const DescriptionBox = ({
    content,
    style,
    ...rest
}: {content: string} & ComponentProps<typeof View>) => (
    <View style={[style, styles.container]} {...rest}>
        <View style={styles.verticalLine} />
        <View style={styles.textContainer}>
            <Text style={styles.text}>{content}</Text>
        </View>
    </View>
);
