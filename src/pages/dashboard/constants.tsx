import {MISSING_VALUE} from '@constants/common';
import {AddUser} from 'src/icons/add-user';
import {Cog} from 'src/icons/cog';
import {DashboardIcon} from 'src/icons/dashboard';
import {Invoice} from 'src/icons/invoice';
import {List} from 'src/icons/list';
import {Odometer} from 'src/icons/odometer';
import {History} from 'src/icons/history';
import {Pencil} from 'src/icons/pencil';
import {Petrol} from 'src/icons/petrol';
import {Plus} from 'src/icons/plus';
import {ResetArrow} from 'src/icons/reset-arrow';
import {Road} from 'src/icons/road';
import {stringToNumberValidation} from 'src/utils/validation';
import {z} from 'zod';
import {PopupType} from './page';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    icon: {
        height: 20,
        width: 'auto',
        color: 'white',
    },
});

export type MenuType = {
    icon: React.ReactNode;
    label: string;
    popup?: PopupType;
    link?: string;
};

export const POPUP_IDS = {
    SPECIFIC_DISTANCE: 'Specific Distance',
    ODOMETER: 'odometer',
};

export const MENU_OPTIONS: {
    header: string;
    items: MenuType[];
}[] = [
    {
        header: 'Distance',
        items: [
            {icon: <List style={styles.icon} />, label: 'Presets'},
            {
                icon: <DashboardIcon style={styles.icon} />,
                label: 'Add Specific Distance',
                popup: {
                    id: POPUP_IDS.SPECIFIC_DISTANCE,
                    inputs: [
                        {
                            label: 'Distance',
                            placeholder: 'Enter total distance',
                            id: 'distance',
                            props: {
                                keyboardType: 'number-pad',
                            },
                        },
                    ],
                    buttons: [{label: 'Add Distance', isSubmitButton: true}],
                    validation: z.object({
                        distance: stringToNumberValidation,
                    }),
                    successText:
                        '$distance has been successfully added to your account! Your current total distance is now $total_distance.',
                },
            },
            {
                icon: <Odometer style={styles.icon} />,
                label: 'Record Odometer',
                popup: {
                    id: POPUP_IDS.ODOMETER,
                    inputs: [
                        {
                            label: 'Start Odometer',
                            placeholder: 'Enter start odometer',
                            id: 'odemeterStart',
                            props: {
                                keyboardType: 'number-pad',
                            },
                        },
                        {
                            label: 'End Odometer',
                            placeholder: 'Enter end odometer',
                            id: 'odemeterEnd',
                            props: {
                                keyboardType: 'number-pad',
                            },
                        },
                    ],
                    buttons: [{label: 'Add Distance', isSubmitButton: true, isDraftButton: true}],
                    validation: z.object({
                        odemeterStart: stringToNumberValidation,
                        odemeterEnd: z
                            .string()
                            .transform(val => (val === '' ? undefined : parseInt(val)))
                            .optional()
                            .pipe(
                                z
                                    .number({
                                        invalid_type_error: 'Please enter a valid number',
                                    })
                                    .nonnegative(MISSING_VALUE)
                                    .optional(),
                            ),
                    }),
                    pretext:
                        'The odometer, usually shown on the LED display behind the steering wheel, indicates the total distance the car has traveled.',
                    successText:
                        '$distance has been successfully added to your account! Your current total distance is now $total_distance.',
                },
            },
            {icon: <Road style={styles.icon} />, label: 'Assign Distance'},
            {icon: <ResetArrow style={styles.icon} />, label: 'Reset Distance'},
        ],
    },
    {
        header: 'Payments',
        items: [
            {icon: <Petrol style={styles.icon} />, label: 'Add Petrol'},
            {icon: <Invoice style={styles.icon} />, label: 'Invoices'},
            {icon: <History style={styles.icon} />, label: 'History'},
        ],
    },
    {
        header: 'Group',
        items: [
            {icon: <AddUser style={styles.icon} />, label: 'Invite User'},
            {icon: <Pencil style={styles.icon} />, label: 'Create Group'},
            {icon: <Plus style={styles.icon} />, label: 'Join Group'},
            {icon: <Cog style={styles.icon} />, label: 'Group Settings'},
        ],
    },
];
