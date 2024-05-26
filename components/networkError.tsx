import {Dimensions, View} from 'react-native';
import {Text} from './text';
import Colors from '../constants/Colors';
import Button from './button';

export default ({onRetry}: {onRetry: () => void}) => {
    return (
        <View
            style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('screen').height,
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 10000,
                backgroundColor: Colors.background,
                justifyContent: 'center',
                alignContent: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 16,
            }}
        >
            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>
                Unexpected Error
            </Text>
            <Text style={{textAlign: 'center'}}>
                We are having trouble connecting to our authentication servers. Please click the
                button to try again or come back at a later time
            </Text>
            <View
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                    marginTop: 15,
                }}
            >
                <Button
                    handleClick={onRetry}
                    text="Retry"
                    size="small"
                    textStyle={{textAlign: 'center'}}
                    style={{width: 100}}
                />
            </View>
        </View>
    );
};
