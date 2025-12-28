import {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {DataType} from './invoiceLogs';
import {Input} from '@components/layout/input';
import {Dropdown} from '@components/layout/dropdown/dropdown';
import {getUserData} from 'src/selectors/common';
import {useMemberRequest} from 'src/hooks/useMemberRequest';
import {Button} from '@components/layout/button';

type PropsType = {
    data: DataType;
};

const styles = StyleSheet.create({
    container: {
        gap: 15,
        marginBottom: 20,
    },
});

export const AssignDistance: FC<PropsType> = ({data}) => {
    const {userID} = useSelector(getUserData);
    const members = useMemberRequest(userID, true);

    return (
        <>
            <View style={styles.container}>
                <Input
                    label="Distance to Apply:"
                    placeholder={`Enter Amount (Max: ${data?.distance})`}
                    keyboardType="numeric"
                />
                <Dropdown label="User:" placeholder="Choose a user" items={members} />
            </View>
            <Button>Assign Distance</Button>
        </>
    );
};
