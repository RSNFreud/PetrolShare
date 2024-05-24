import React from 'react';

import {PropsType} from './default';
import Envelope from '../../assets/icons/envelope';
import Password from '../../assets/icons/password';
import Person from '../../assets/icons/person';
import {LongButton} from '../Themed';
import Button from '../button';

export default ({handleChange}: PropsType) => {
    return (
        <>
            <LongButton
                text="Change Email"
                icon={<Envelope width="24" height="24" />}
                handleClick={() => handleChange('Email')}
            />
            <LongButton
                text="Change Password"
                icon={<Password width="24" height="24" />}
                handleClick={() => handleChange('Password')}
            />
            <LongButton
                text="Change Name"
                icon={<Person width="24" height="18" />}
                handleClick={() => handleChange('Name')}
            />
            <Button
                variant="ghost"
                text="Back"
                handleClick={() => handleChange('')}
                style={{paddingHorizontal: 20}}
            />
        </>
    );
};
