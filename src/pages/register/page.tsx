import React, {useState} from 'react';
import {StepOne} from './components/stepOne';
import {StepTwo} from './components/stepTwo';
import {Header} from '@components/layout/baseHeader';

type FormValues = {
    error?: string;
    value: string;
};
const defaultValues = {
    error: '',
    value: '',
};

export const Register = () => {
    const [step, setStep] = useState<number>(0);
    const [data, setData] = useState<{
        name: FormValues;
        email: FormValues;
        password: FormValues;
        confirmPassword: FormValues;
    }>({
        name: defaultValues,
        email: defaultValues,
        password: defaultValues,
        confirmPassword: defaultValues,
    });

    const updateData = (data: {[key: string]: FormValues}) => {
        setData(prevState => ({...prevState, ...data}));
    };

    const commonProps = {
        data,
        setData: updateData,
        setStep,
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <StepTwo {...commonProps} />;

            default:
                return <StepOne {...commonProps} />;
        }
    };

    return (
        <>
            <Header />
            {renderStep()}
        </>
    );
};
