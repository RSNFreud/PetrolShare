import {sendPostRequest} from 'hooks/sendFetchRequest';
import React, {useState, useContext} from 'react';

import {PropsType} from './default';
import {setItem} from '../../hooks';
import {AuthContext} from '../../hooks/context';
import Button from '../button';
import Input from '../input';

export default ({handleClose, handleChange, handleUpdate}: PropsType) => {
    const [name, setName] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState('');
    const {retrieveData} = useContext(AuthContext);

    const validateForm = async () => {
        if (!name) return setErrors('Please enter a valid name');
        setLoading(true);
        const res = await sendPostRequest(`user/change-name`, {
            authenticationKey: retrieveData?.authenticationKey,
            newName: name,
        });
        if (res?.ok) {
            setLoading(false);
            handleUpdate && handleUpdate();
            handleClose();
            setItem('delayedAlert', 'Your name has been\nsuccessfully updated!');
        }
    };

    return (
        <>
            <Input
                label="Name"
                handleInput={e => setName(e)}
                value={name}
                errorMessage={errors}
                placeholder="Enter a new name"
                style={{marginBottom: 20}}
            />
            <Button
                handleClick={validateForm}
                loading={loading}
                style={{marginBottom: 15}}
                text="Change name"
            />
            <Button handleClick={() => handleChange('Settings')} variant="ghost" text="Back" />
        </>
    );
};
