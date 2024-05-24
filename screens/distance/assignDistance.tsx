import Dropdown, {item} from '@components/Dropdown';
import {Box} from '@components/Themed';
import Input from '@components/input';
import {Text} from '@components/text';
import {sendPostRequest} from 'hooks/sendFetchRequest';
import {sendRequestToBackend} from 'hooks/sendRequestToBackend';
import {useContext, useEffect, useState} from 'react';

import SubmitButton from './submitButton';
import {AuthContext} from '../../hooks/context';

export default ({handleClose}: {handleClose: (alert?: string) => void}) => {
    const [usernames, setUsernames] = useState<item[]>([]);
    const {retrieveData} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState({name: '', distance: ''});
    const [errors, setErrors] = useState({name: '', distance: ''});

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        const res = await sendRequestToBackend({
            url: `group/get-members?authenticationKey=` + retrieveData?.authenticationKey,
        });
        if (res?.ok) {
            const data = await res.json();
            setUsernames(
                data.map((e: {fullName: string; userID: string}) => ({
                    name: e.fullName,
                    value: e.userID,
                })),
            );
        }
    };

    const handleSubmit = async () => {
        if (!values.name) {
            return setErrors({
                ...errors,
                name: 'Please choose a user to assign distance too!',
            });
        }
        if (!values.distance) {
            return setErrors({...errors, distance: 'Please enter a distance!'});
        }

        let distance: string = '';

        if (values.distance) {
            distance = values.distance;
        }

        if (parseFloat(distance) <= 0 || !/^[0-9.]*$/.test(distance))
            return setErrors({
                ...errors,
                distance: 'Please enter a distance above 0!',
            });
        setLoading(true);

        const res = await sendPostRequest(`distance/assign`, {
            userID: values.name,
            distance: values.distance,
            authenticationKey: retrieveData?.authenticationKey,
        });
        if (res?.ok) {
            setLoading(false);
            handleClose(
                'Successfully requested distance\nfrom ' +
                    usernames.filter(e => e.value === values.name)[0].name,
            );
        }
    };

    return (
        <>
            <Box style={{paddingHorizontal: 15, paddingVertical: 15, marginBottom: 25}}>
                <Text>
                    If you have distance that should be applied to another user then enter the
                    distance. This will prompt the user to accept the distance applied.
                </Text>
            </Box>
            <Dropdown
                label="User"
                placeholder="Choose a username"
                data={usernames}
                handleSelected={e => setValues({...values, name: e.value})}
                value={values.name}
                errorMessage={errors.name}
                hiddenValue
            />
            <Input
                handleInput={e => setValues({...values, distance: e})}
                label="Distance to apply"
                errorMessage={errors.distance}
                placeholder="Enter amount"
                keyboardType="numbers-and-punctuation"
                inputStyle={{paddingVertical: 10}}
                style={{marginBottom: 20}}
            />
            <SubmitButton
                text="Assign Distance"
                loading={loading}
                handleClick={handleSubmit}
                errors={errors.distance}
                distance={values.distance}
            />
        </>
    );
};
