import {View} from 'react-native';

import Button from './button';
import {Text} from './text';

type DefaultType = {
    setModal: (modal: string) => void;
};

export default ({setModal}: DefaultType) => {
    return (
        <View>
            <Text style={{fontSize: 18, fontWeight: '700', marginBottom: 20}}>
                Welcome to PetrolShare!
            </Text>
            <Text style={{fontSize: 16, marginBottom: 30, lineHeight: 24}}>
                To start using the app, either select{' '}
                <Text style={{fontWeight: 'bold'}}>Join Group</Text> and enter the code or link
                provided by a group member (click the copy button on the dashboard to get it), or
                select <Text style={{fontWeight: 'bold'}}>Create Group</Text>.
            </Text>
            <Button
                style={{marginBottom: 20}}
                handleClick={() => setModal('CreateGroup')}
                text="Create Group"
            />
            <Button handleClick={() => setModal('JoinGroup')} text="Join Group" />
        </View>
    );
};
