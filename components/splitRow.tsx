import {ReactNode} from 'react';
import {View} from 'react-native';

type PropsType = {
    elements: ReactNode[];
    gap?: number;
    style?: View['props']['style'];
    seperator?: ReactNode;
    withoutFade?: boolean;
};

export default ({elements, style, seperator}: PropsType) => {
    return (
        <View
            style={[
                {
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                },
                style,
            ]}
        >
            {elements.map((e, count) => (
                <>
                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        {e}
                    </View>
                    {count !== elements.length - 1 && seperator && seperator}
                </>
            ))}
        </View>
    );
};
