import {Breadcrumbs} from '@components/layout/breadcrumbs';
import {Text} from '@components/layout/text';

export const Presets = () => {
    return (
        <>
            <Breadcrumbs pages={[{label: 'Dashboard', href: '..'}, {label: 'Presets'}]} />
            <Text>Test!</Text>
        </>
    );
};
