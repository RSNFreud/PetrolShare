import {AppContext} from '@components/appContext/context';
import {DeletePopup} from '@components/deletePopup';
import {useContext} from 'react';

export const CreateGroup = () => {
    const {setPopupData} = useContext(AppContext);

    const onSubmit = () => {};

    return (
        <DeletePopup
            onDelete={onSubmit}
            title="Are you sure you want to leave the group?"
            content="You are about to create a new group. If you are the last member in your current group, your data will be lost and cannot be restored. Please confirm to continue."
        />
    );
};
