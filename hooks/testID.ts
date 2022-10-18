import { Platform } from 'react-native';

const appIdentifier = 'com.rsnfreud.petrolshare';

export default (testID: string) => {
    if (!testID) {
        return undefined;
    }

    const prefix = `${appIdentifier}:id/`;
    const hasPrefix = testID.startsWith(prefix);

    return Platform.select({
        android: !hasPrefix ? `${prefix}${testID}` : testID,
        ios: hasPrefix ? testID.slice(prefix.length) : testID,
        web: !hasPrefix ? `${prefix}${testID}` : testID,
    });
}

