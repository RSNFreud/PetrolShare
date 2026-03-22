import {AppContext} from '@components/appContext/context';
import {Button} from '@components/layout/button';
import {useContext} from 'react';
import {StartScreen} from './startScreen';

export const ReturnToMenu = () => {
    const {setPopupData} = useContext(AppContext);

    return (
        <Button variant="ghost" onPress={() => setPopupData({content: <StartScreen />})}>
            Return to Menu
        </Button>
    );
};
