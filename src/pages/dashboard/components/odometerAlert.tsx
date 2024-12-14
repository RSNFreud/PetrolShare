import {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {AlertBoxText} from '@components/layout/alertBox';
import {Checkbox} from '@components/layout/checkbox';

const styles = StyleSheet.create({
    container: {
        gap: 20,
    },
});

type PropsType = {
    setIsChecked: () => void;
    isChecked: boolean;
};

export const OdometerAlert: FC<PropsType> = ({isChecked, setIsChecked}) => {
    return (
        <View style={styles.container}>
            <AlertBoxText text="We have automatically applied your previous odometer value." />
            <Checkbox
                label="Don't show this again"
                isChecked={isChecked}
                handleChange={setIsChecked}
            />
        </View>
    );
};
