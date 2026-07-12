import {AppContext} from '@components/appContext/context';
import {defaultValues} from '@constants/common';
import {FC, useContext, useEffect, useState} from 'react';
import {DataType, returnValuesFromObject, validate} from 'src/hooks/common';
import {commonValidation} from 'src/utils/validation';
import z from 'zod';
import {GroupPageTwo} from './pageTwo';
import {Button} from '@components/layout/button';
import {GroupPageOne} from './pageOne';
import {ConfirmLeave} from '../confirmLeave';
import {useValidationRequest} from 'src/hooks/useValidationRequest';
import {DescriptionBox} from '@components/layout/descriptionBox';
import {ENDPOINTS} from '@constants/endpoints';
import {useDispatch, useSelector} from 'react-redux';
import {updateData} from '@pages/login/reducers/auth';
import {Text} from '@components/layout/text';
import {getUserData} from 'src/selectors/common';
import {GroupInformation} from '../groupInformation';
import {PageContext, PageManager} from '@components/layout/pageManager';

type PropsType = {
    isCreating?: boolean;
};

const validation = (page: number) =>
    z.object({
        distance: commonValidation,
        petrol: commonValidation,
        ...(page === 1 && {
            currency: commonValidation,
        }),
    });

enum SCREEN {
    default = 0,
    pageOne = 1,
    pageTwo = 2,
}

export const GroupSettings: FC<PropsType> = ({isCreating}) => {
    const {setPopupData, isNewUser} = useContext(AppContext);
    const {page, setPage} = useContext(PageContext);
    const dispatch = useDispatch();
    const [data, setData] = useState<DataType>({
        distance: defaultValues,
        petrol: defaultValues,
        currency: defaultValues,
    });
    const {isLoading, sendRequest} = useValidationRequest();
    const userData = useSelector(getUserData);

    const handleInput = (data: DataType) => {
        setData(prevData => ({...prevData, ...data}));
    };

    const handleContinue = async () => {
        const isValid = validate(validation(page), data, setData);

        if (!isValid) return;

        if (isCreating || page !== 1) {
            setPage(page + 1);
            return;
        }
        const parsedData = returnValuesFromObject(data);
        const res = await sendRequest(ENDPOINTS.EDIT_SETTINGS, parsedData);
        if (!res?.ok) return;

        dispatch(updateData());
        setPopupData({
            content: (
                <Text style={{lineHeight: 21}}>
                    Your group settings have been successfully updated and your group distance has
                    been reset.
                </Text>
            ),
            minContentHeight: 0,
            stickyButton: null,
        });
    };

    const createGroup = async () => {
        const isValid = validate(validation(page), data, setData);

        if (!isValid) return;
        const parsedData = returnValuesFromObject(data);

        const res = await sendRequest(ENDPOINTS.CREATE_GROUP, parsedData);

        if (!res?.ok) return;

        const groupID = await res.text();
        dispatch(updateData());

        setPopupData({
            content: <GroupInformation groupID={groupID} isGroupCreation isSticky />,
            stickyButton: null,
            minContentHeight: 0,
        });
    };

    const getButtons = () => {
        switch (page) {
            case SCREEN.pageTwo:
                return (
                    <>
                        <Button onPress={createGroup} loading={isLoading}>
                            Create New Group
                        </Button>
                        <Button variant="ghost" onPress={() => setPopupData({isVisible: false})}>
                            Cancel
                        </Button>
                    </>
                );
            case SCREEN.pageOne:
                return (
                    <>
                        <Button
                            onPress={isNewUser ? createGroup : handleContinue}
                            loading={isLoading}
                        >
                            {isCreating ? 'Continue' : 'Save Settings'}
                        </Button>
                        <Button variant="ghost" onPress={() => setPage(0)}>
                            Back
                        </Button>
                    </>
                );
            case SCREEN.default:
                return (
                    <>
                        <Button onPress={handleContinue}>Continue</Button>
                        {isNewUser ? (
                            <Button variant="ghost" onPress={() => setPage(0)}>
                                Return to Menu
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                onPress={() => setPopupData({isVisible: false})}
                            >
                                Cancel
                            </Button>
                        )}
                    </>
                );
            default:
                return null;
        }
    };

    useEffect(() => {
        setPopupData({
            stickyButton: getButtons(),
            minContentHeight: 456,
        });
    }, [data, page, isLoading]);

    useEffect(() => {
        setData({
            distance: {
                error: '',
                value: userData.distance || '',
            },
            currency: {
                error: '',
                value: userData.currency || '',
            },
            petrol: {
                error: '',
                value: userData.petrol || '',
            },
        });
    }, [userData]);

    return (
        <>
            {!isCreating && (
                <DescriptionBox
                    style={{marginBottom: 20}}
                    content="By changing group settings you will reset your current tracked session."
                />
            )}
            <PageManager
                pages={[
                    <GroupPageOne isCreating={isCreating} data={data} setData={handleInput} />,
                    <GroupPageTwo data={data} setData={handleInput} />,
                    <ConfirmLeave />,
                ]}
            />
        </>
    );
};

export const GroupSettingsWrapper: FC<PropsType> = props => {
    return (
        <PageManager pages={[<GroupSettings {...props} />]}>
            <GroupSettings />
        </PageManager>
    );
};
