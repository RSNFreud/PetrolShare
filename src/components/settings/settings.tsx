import {MyDetails} from './myDetails';
import {PageManager} from '@components/layout/pageManager';
import {DefaultSettings} from './default';
import {Logout} from './logout';
import {ChangePassword} from './changePassword';

export const Settings = () => {
    return (
        <PageManager pages={[<DefaultSettings />, <MyDetails />, <Logout />, <ChangePassword />]} />
    );
};
