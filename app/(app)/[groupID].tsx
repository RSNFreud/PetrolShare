import {useRouter} from 'expo-router';
import {useEffect} from 'react';
import Dashboard from 'screens/dashboard';

export default function Page() {
    const {replace} = useRouter();

    useEffect(() => {
        replace('/');
    }, []);
    return <Dashboard />;
}
