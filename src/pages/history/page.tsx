import {useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {useFetchLogs} from './hooks/useFetchLogs';
import {Navigation} from './components/navigation';
import {Summary} from './components/summary';
import {HistoryData} from './components/historyData';
import {Breadcrumbs} from '@components/layout/breadcrumbs';
import {Colors} from '@constants/colors';
import {NoLogsFound} from './components/noLogsFound';

const styles = StyleSheet.create({
    fullPageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        gap: 5,
    },
});

export const History = () => {
    const {isLoading, data, refetch} = useFetchLogs();
    const [page, setPage] = useState(0);

    if (isLoading)
        return (
            <>
                <Breadcrumbs pages={[{label: 'Dashboard', href: '/'}, {label: 'History'}]} />
                <View style={styles.fullPageContainer}>
                    <ActivityIndicator size="large" color={Colors.tertiary} />
                </View>
            </>
        );

    const currentData = data?.[page];

    return (
        <>
            <Breadcrumbs pages={[{label: 'Dashboard', href: '/'}, {label: 'History'}]} />
            <Navigation page={page} data={currentData} changePage={setPage} />
            {currentData?.logs.length ? (
                <>
                    <Summary data={currentData} />
                    <HistoryData data={currentData} isEditable={page === 0} refetch={refetch} />
                </>
            ) : (
                <NoLogsFound />
            )}
        </>
    );
};
