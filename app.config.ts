import { ExpoConfig, ConfigContext } from '@expo/config';
import * as dotenv from 'dotenv';

// initialize dotenv
dotenv.config();

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "PetrolShare",
    slug: "PetrolShare",
    android: {
        ...config.android,
        googleServicesFile: process.env.GOOGLE_SERVICES,
    },
    ios: {
        ...config.ios,
        googleServicesFile: process.env.APPLE_SERVICES,
    },
});