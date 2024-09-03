import {ComponentProps, FC} from 'react';
import {Text as DefaultText} from 'react-native';

type PropsType = ComponentProps<typeof DefaultText> & {bold?: boolean};

export const DEFAULT_TEXT_PROPS = {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
};

export const Text: FC<PropsType> = ({children, style, bold, ...props}) => {
    let fontSize = 16; // Default font size

    // Check if style is an array or an object and extract fontSize if possible
    if (Array.isArray(style)) {
        for (const s of style) {
            if (s && typeof s === 'object' && 'fontSize' in s && s.fontSize !== undefined) {
                fontSize = s.fontSize as number;
                break;
            }
        }
    } else if (style && typeof style === 'object' && 'fontSize' in style) {
        fontSize = style.fontSize as number;
    }

    const combinedStyles: ComponentProps<typeof DefaultText>['style'] = [
        {
            ...DEFAULT_TEXT_PROPS,
            fontFamily: bold ? 'Roboto-Bold' : 'Roboto-Regular',
            fontWeight: bold ? 'bold' : 600,
            lineHeight: fontSize * 1.1 || 16,
        },
        style,
    ];

    return <DefaultText style={combinedStyles}>{children}</DefaultText>;
};
