import {Seperator} from '@components/Themed';
import Button from '@components/button';
import Input from '@components/input';
import Layout from '@components/layout';
import {Text} from '@components/text';
import {router, useRouter} from 'expo-router';
import {sendPostRequest} from 'hooks/sendFetchRequest';
import React, {useContext, useState} from 'react';
import {Pressable, TouchableWithoutFeedback, View} from 'react-native';
import {ErrorType} from 'types';

import ForgotPassword from './forgotPassword';
import {AuthContext} from '../../hooks/context';
import testID from '../../hooks/testID';

export default () => {
    const [visible, setVisible] = useState(false);
    const navigation = useRouter();
    const [formData, setFormData] = useState<{emailAddress: string; password: string}>({
        emailAddress: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<ErrorType>({
        emailAddress: '',
        password: '',
        verification: '',
    });

    const [verificationEmailSent, setVerificationEmailSent] = useState(false);

    const {signIn, isLoggedIn} = useContext(AuthContext);

    const handleSubmit = () => {
        const errors: ErrorType = {emailAddress: '', password: ''};

        Object.entries(formData).map(([key, value]) => {
            errors[key] = value ? '' : 'Please fill out this field!';

            if (
                key === 'emailAddress' &&
                value &&
                !/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)
            ) {
                errors[key] = 'Please enter a valid email!';
            }
        });
        setFormErrors(errors);

        if (Object.values(errors).filter(e => e.length).length === 0) {
            handleLogin();
        }
    };

    const handleLogin = async () => {
        if (!signIn) return;
        setVerificationEmailSent(false);
        setFormErrors({emailAddress: '', password: '', verification: ''});
        setLoading(true);
        const signedIn = await signIn({...formData});

        if (!signedIn.valid) {
            setLoading(false);
            setFormErrors({emailAddress: '', password: '', verification: signedIn.message || ''});
        } else router.navigate('/');
    };

    const resendVerification = async () => {
        try {
            const res = await sendPostRequest(
                `resend`,
                {emailAddress: formData.emailAddress},
                true,
            );

            if (res?.ok) {
                setVerificationEmailSent(true);
            }
        } catch (err) {
            console.log('====================================');
            console.log('Error found:', err);
            console.log('====================================');
        }
    };

    if (isLoggedIn) return <></>;

    return (
        <Layout>
            <Input
                testID={testID('emailaddress')}
                autoComplete="username"
                nativeID="emailaddress"
                keyboardType="email-address"
                handleInput={e => setFormData({...formData, emailAddress: e})}
                placeholder="Enter email address"
                label="Email:"
                value={formData.emailAddress}
                errorMessage={formErrors.emailAddress}
                style={{marginBottom: 20}}
            />
            <Input
                autoComplete="current-password"
                password
                testID={testID('password')}
                value={formData.password}
                nativeID="password"
                placeholder="Enter password"
                label="Password:"
                errorMessage={formErrors.password}
                style={{marginBottom: 15}}
                handleInput={e => setFormData({...formData, password: e})}
            />
            {!!formErrors.verification && (
                <View
                    style={{
                        marginTop: 5,
                        marginBottom: 15,
                        backgroundColor: verificationEmailSent ? '#484848' : '#EECFCF',
                        borderRadius: 4,
                        paddingHorizontal: 20,
                        paddingVertical: 15,
                    }}
                >
                    {verificationEmailSent ? (
                        <Text style={{color: 'white', fontSize: 16, fontWeight: '400'}}>
                            Successfully resent the verification email to the address provided!
                            Click{' '}
                            <TouchableWithoutFeedback onPress={resendVerification}>
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: 16,
                                        fontWeight: '400',
                                        textDecorationStyle: 'solid',
                                        textDecorationLine: 'underline',
                                    }}
                                >
                                    here
                                </Text>
                            </TouchableWithoutFeedback>{' '}
                            to send it again{' '}
                        </Text>
                    ) : (
                        <Text style={{color: '#7B1D1D', fontSize: 16, fontWeight: '400'}}>
                            {formErrors.verification === 'Please verify your account!' ? (
                                <>
                                    Please verify your account by clicking the link in the email we
                                    sent! Click{' '}
                                    <TouchableWithoutFeedback onPress={resendVerification}>
                                        <Text
                                            style={{
                                                color: '#7B1D1D',
                                                fontSize: 16,
                                                textDecorationStyle: 'solid',
                                                textDecorationLine: 'underline',
                                                fontWeight: '400',
                                            }}
                                        >
                                            here
                                        </Text>
                                    </TouchableWithoutFeedback>{' '}
                                    to resend your verification email.
                                </>
                            ) : (
                                formErrors.verification
                            )}
                        </Text>
                    )}
                </View>
            )}
            <Pressable
                onPress={() => setVisible(true)}
                style={{paddingBottom: 30}}
                android_disableSound
            >
                <Text style={{fontSize: 16, textDecorationLine: 'underline'}}>
                    Forgot my password...
                </Text>
            </Pressable>
            <Button loading={loading} handleClick={() => handleSubmit()} text="Submit" />

            <Seperator style={{marginVertical: 30}} />
            <Button
                // @ts-expect-error
                handleClick={() => navigation.navigate('register')}
                variant="ghost"
                text="Register"
            />
            <ForgotPassword
                emailAddress={formData.emailAddress}
                visible={visible}
                setVisible={e => setVisible(e)}
            />
        </Layout>
    );
};
