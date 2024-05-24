import {useRef, useState} from 'react';

import Complete from './complete';
import JoinGroupForm from './joinGroupForm';
import {Alert} from '../hooks';

type PropsType = {
    firstSteps?: boolean;
    handleClose: () => void;
    handleCancel?: () => void;
    handleUpdate?: () => void;
};

export default ({firstSteps, handleClose, handleUpdate}: PropsType) => {
    const [stage, setStage] = useState(0);
    const groupID = useRef('');

    const createGroup = async (e?: {groupID?: string; message?: string}) => {
        if (e?.message) Alert('Notice:', e?.message);
        handleUpdate && handleUpdate();
        if (e?.groupID) groupID.current = e.groupID;
        setStage(1);
    };

    return (
        <>
            {stage == 0 && (
                <JoinGroupForm
                    firstSteps={firstSteps}
                    handleComplete={createGroup}
                    handleCancel={handleClose}
                />
            )}
            {stage === 1 && <Complete handleClose={handleClose} groupID={groupID.current} />}
        </>
    );
};
