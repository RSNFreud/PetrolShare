import {useLocalSearchParams} from 'expo-router';
import Invoice from 'screens/invoices/invoice';

export default () => {
    const {id} = useLocalSearchParams();

    return <Invoice isPublic invoiceID={String(id)} />;
};
