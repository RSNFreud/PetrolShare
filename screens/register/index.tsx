import {Box, FlexFull} from '@components/Themed';
import Button from '@components/button';
import Input from '@components/input';
import Layout from '@components/layout';
import {Text} from '@components/text';
import {useRouter} from 'expo-router';
import {sendPostRequest} from 'hooks/sendFetchRequest';
import React, {useContext, useState} from 'react';
import {View} from 'react-native';

import {Stage} from './stage';
import {StepBar} from './stepBar';
import {AuthContext} from '../../hooks/context';

export const Register = React.memo(() => {
    const {register} = useContext(AuthContext);

    const [stage, setStage] = useState(0);
    const navigation = useRouter();
    const [previousStage, setPreviousStage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [direction, setDirection] = useState('left' as 'left' | 'right');

    const [formData, setFormData] = useState({
        fullName: '',
        emailAddress: '',
        password: '',
        confirmPassword: '',
    } as any);
    const [formErrors, setFormErrors] = useState({
        fullName: '',
        emailAddress: '',
        password: '',
        confirmPassword: '',
    });

    const validateStage = (elements: any[], submitAction: () => any) => {
        const errors: any = {};

        for (let i = 0; i < elements.length; i++) {
            const e = elements[i];
            if (!(e in formData)) return;
            const value = formData[e];
            if (!value) errors[e] = 'Please complete this field!';
            if (e === 'emailAddress' && value && !/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)) {
                errors[e] = 'Please enter a valid email!';
            }

            if (e === 'password' && value.length < 6) {
                errors[e] = 'Please enter a password longer than 6 characters';
            }
            if (e === 'confirmPassword' && value !== formData['password']) {
                errors[e] = 'The password you entered does not match';
            }
        }

        setFormErrors({...errors});
        if (Object.values(errors).filter(e => (e as string).length).length === 0) submitAction();
    };

    const stageProps = {stage, direction, isLoading, previousStage};

    const nextPage = () => {
        if (isLoading) setIsLoading(false);

        const currentPage = stage;
        setStage(currentPage + 1);

        setDirection('right');
        setPreviousStage(currentPage);

        setTimeout(() => {
            setIsLoading(true);
        }, 400);
    };

    const previousPage = () => {
        if (isLoading) setIsLoading(false);

        const currentPage = stage;
        setStage(currentPage - 1);

        setDirection('left');
        setPreviousStage(currentPage);

        setTimeout(() => {
            setIsLoading(true);
        }, 400);
    };

    const handleRegister = async () => {
        if (register) {
            const res = await sendPostRequest('user/register', {
                fullName: formData['fullName'],
                emailAddress: formData['emailAddress'],
                password: formData['password'],
            });
            if (res?.ok) {
                const data = await res.text();
                setFormData({...formData, key: data});
                nextPage();
            } else {
                previousPage();
                setFormErrors({...formErrors, emailAddress: 'This email address already exists!'});
            }
        }
    };

    const Steps = [
        <>
            <View>
                <Input
                    handleInput={e => setFormData({...formData, fullName: e})}
                    placeholder="Enter your name"
                    label="Full Name:"
                    style={{marginBottom: 20}}
                    value={formData['fullName']}
                    errorMessage={formErrors['fullName']}
                />
                <Input
                    handleInput={e => setFormData({...formData, emailAddress: e})}
                    placeholder="Enter email address"
                    label="Email:"
                    keyboardType="email-address"
                    style={{marginBottom: 20}}
                    value={formData['emailAddress']}
                    errorMessage={formErrors['emailAddress']}
                />
            </View>
            <View>
                <Button
                    style={{marginBottom: 20}}
                    handleClick={() => {
                        validateStage(['fullName', 'emailAddress'], () => nextPage());
                    }}
                    text="Continue"
                />
                <Button
                    variant="ghost"
                    // @ts-expect-error
                    handleClick={() => navigation.navigate('login')}
                    text="Cancel"
                />
            </View>
        </>,
        <>
            <View>
                <Input
                    handleInput={e => setFormData({...formData, password: e})}
                    value={formData['password']}
                    errorMessage={formErrors['password']}
                    placeholder="Enter your password"
                    label="Password:"
                    password
                    style={{marginBottom: 20}}
                />
                <Input
                    handleInput={e => setFormData({...formData, confirmPassword: e})}
                    value={formData['confirmPassword']}
                    errorMessage={formErrors['confirmPassword']}
                    placeholder="Confirm your password"
                    style={{marginBottom: 20}}
                    label="Confirm Password:"
                    password
                />
            </View>
            <View>
                <Button
                    style={{marginBottom: 20}}
                    handleClick={() =>
                        validateStage(['password', 'confirmPassword'], () => handleRegister())
                    }
                    text="Submit"
                />
                <Button variant="ghost" handleClick={() => previousPage()} text="Back" />
            </View>
        </>,
        <>
            <Box>
                <>
                    <Text style={{fontSize: 16, lineHeight: 25}}>
                        Thank you for registering for PetrolShare{' '}
                        <Text style={{fontWeight: 'bold'}}>
                            {formData['fullName'] || 'Username'}
                        </Text>
                        .{'\n\n'}Please check your email for a confirmation email to activate your
                        account.
                    </Text>
                </>
            </Box>
            <Button
                // @ts-expect-error
                handleClick={() => navigation.navigate('')}
                style={{marginTop: 25}}
                text="Back to Login"
            />
        </>,
    ];

    return (
        <Layout>
            <FlexFull>
                <StepBar stage={stage} />
                <View style={{position: 'relative', flex: 1, minHeight: '100%'}}>
                    {Steps.map((children, count) => (
                        <Stage {...stageProps} pageNumber={count} key={'stage ' + count}>
                            {children}
                        </Stage>
                    ))}
                </View>
            </FlexFull>
        </Layout>
    );
});
