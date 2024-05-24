import {Box} from '@components/Themed';
import Input from '@components/input';
import {Text} from '@components/text';
import {useRouter} from 'expo-router';
import {sendPostRequest} from 'hooks/sendFetchRequest';
import {useContext, useEffect, useState} from 'react';

import SubmitButton from './submitButton';
import {deleteItem, setItem} from '../../hooks';
import {AuthContext} from '../../hooks/context';

export default ({
    previousData,
    handleClose,
}: {
    previousData?: {
        startValue: string;
        endValue: string;
    };
    handleClose: (alert?: string) => void;
}) => {
    const [data, setData] = useState({
        ...previousData,
    });
    const [errors, setErrors] = useState('');
    const [distance, setDistance] = useState('');
    const [loading, setLoading] = useState(false);
    const {retrieveData} = useContext(AuthContext);
    const {navigate} = useRouter();

    useEffect(() => {
        if (previousData) {
            setData({...previousData});
        }
    }, [previousData]);

    useEffect(() => {
        if (data.startValue && data.endValue) {
            const start = parseFloat(data.startValue);
            const end = parseFloat(data.endValue);
            if (isNaN(start) || isNaN(end)) return;
            if (end - start < 0) return;
            setDistance((end - start).toString());
        } else {
            setDistance('');
        }
    }, [data]);

    const handleSubmit = async () => {
        setErrors('');
        if (!data.startValue) {
            return setErrors('Please enter a start value');
        }

        let distance: number = 0;

        if (data.startValue && data.endValue) {
            distance = parseFloat(data.endValue) - parseFloat(data.startValue);
        }

        if (data.startValue && !data.endValue) {
            handleClose(
                'Saved your distance as a draft! Access it by clicking on Record Odometer again!',
            );
            setItem('draft', JSON.stringify(data));
            navigate('/');
            return;
        }
        if (distance <= 0 || isNaN(distance)) return setErrors('Please enter a distance above 0!');

        if (!retrieveData) return;
        setLoading(true);
        const res = await sendPostRequest(`distance/add`, {
            distance,
            authenticationKey: retrieveData?.authenticationKey,
        });
        if (res?.ok) {
            setLoading(false);
            handleClose('Distance successfully updated!');
            deleteItem('draft');
        }
    };

    return (
        <>
            <Box style={{paddingHorizontal: 15, paddingVertical: 15, marginBottom: 25}}>
                <Text>
                    The odometer is the readout typically displayed behind the steering wheel in an
                    LED readout. It is a series of numbers displaying the total amount of distance
                    the car has travelled.
                </Text>
            </Box>
            <Input
                placeholder="Enter odemetor start value"
                label="Start Odometer"
                keyboardType="numeric"
                value={data.startValue}
                handleInput={e => setData({...data, startValue: e})}
                style={{marginBottom: 20}}
            />
            <Input
                placeholder="Enter odemetor end value"
                label="End Odometer"
                keyboardType="numeric"
                value={data.endValue}
                handleInput={e => setData({...data, endValue: e})}
                style={{marginBottom: 30}}
            />
            <SubmitButton
                text={data.startValue && !data.endValue ? 'Save Draft' : 'Add Distance'}
                loading={loading}
                handleClick={handleSubmit}
                errors={errors}
                distance={distance}
            />
        </>
    );
};
