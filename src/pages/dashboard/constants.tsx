import {z} from 'zod';
import {StyleSheet} from 'react-native';
import {PopupType} from './page';
import {ResetDistance} from './components/resetDistance';
import {descriptionBox, input, seperator} from './components/popupHelpers';
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
import {commonValidation, stringToNumberValidation} from 'src/utils/validation';

const styles = StyleSheet.create({icon: {height: 20, width: 'auto', color: 'white'}});

export const CUSTOM_POPUPS_ID = {RESET_DISTANCE: 'resetDistance'};

export type MenuType = {
    icon: React.ReactNode;
    label: string;
    popup?: PopupType;
    link?: string;
    customPopupId?: (typeof CUSTOM_POPUPS_ID)[keyof typeof CUSTOM_POPUPS_ID];
};

export const POPUP_IDS = {
    SPECIFIC_DISTANCE: 'Specific Distance',
    ODOMETER: 'odometer',
    ASSIGN_DISTANCE: 'assign_distance',
    PRESET: 'preset',
    PETROL: 'petrol',
};

export type GetMemberType = {fullName: string; userID: number}[];

export const getMenuOptions = (): {header: string; items: MenuType[]}[] => [
    {
        header: 'Distance',
        items: [
            {icon: <List style={styles.icon} />, label: 'Presets', link: 'presets'},
            {
                icon: <DashboardIcon style={styles.icon} />,
                label: 'Add Specific Distance',
                popup: {
                    id: POPUP_IDS.SPECIFIC_DISTANCE,
                    children: [
                        input('Distance', 'Enter total distance', 'distance', {
                            keyboardType: 'number-pad',
                        }),
                    ],
                    buttons: [{label: 'Add Distance', isSubmitButton: true}],
                    validation: z.object({distance: stringToNumberValidation}),
                    successText:
                        '$distance has been successfully added to your account! Your current total distance is now $total_distance.',
                },
            },
            {
                icon: <Odometer style={styles.icon} />,
                label: 'Record Odometer',
                popup: {
                    id: POPUP_IDS.ODOMETER,
                    children: [
                        input('Start Odometer', 'Enter start odometer', 'odemeterStart', {
                            keyboardType: 'number-pad',
                        }),
                        input('End Odometer', 'Enter end odometer', 'odemeterEnd', {
                            keyboardType: 'number-pad',
                        }),
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
                                    .number({error: 'Please enter a valid number'})
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
            {
                icon: <Road style={styles.icon} />,
                label: 'Assign Distance',
                popup: {
                    id: POPUP_IDS.ASSIGN_DISTANCE,
                    children: [],
                    buttons: [{label: 'Add Distance', isSubmitButton: true}],
                    validation: z.object({
                        username: commonValidation,
                        totalDistance: stringToNumberValidation,
                    }),
                    successText:
                        'A request to add $distance has been sent to $username! They’ll get a notification to accept it, and once they do, it’ll be assigned. For now, it’s in draft mode.',
                },
            },
            {
                icon: <ResetArrow style={styles.icon} />,
                label: 'Reset Distance',
                customPopupId: CUSTOM_POPUPS_ID.RESET_DISTANCE,
            },
        ],
    },
    {
        header: 'Payments',
        items: [
            {
                icon: <Petrol style={styles.icon} />,
                label: 'Add Petrol',
                popup: {
                    id: POPUP_IDS.PETROL,
                    children: [
                        descriptionBox(
                            'Clicking the "Add Petrol" button will generate a payment log based on the distance tracked during your current session.',
                        ),
                        seperator(5),
                        input('Total Cost', 'Enter total cost of refueling', 'totalCost', {
                            keyboardType: 'numeric',
                        }),
                        input('Liters Filled', 'Enter amount of liters filled', 'litersFilled', {
                            keyboardType: 'numeric',
                        }),
                        input(
                            'Current Odometer',
                            'Enter the current odometer value',
                            'currentOdometer',
                            {
                                keyboardType: 'numeric',
                            },
                        ),
                    ],
                    buttons: [{label: 'Add Petrol', isSubmitButton: true}],
                    validation: z.object({
                        totalCost: stringToNumberValidation,
                        litersFilled: stringToNumberValidation,
                        currentOdometer: stringToNumberValidation,
                    }),
                    successText:
                        'A request to add $distance has been sent to $username! They’ll get a notification to accept it, and once they do, it’ll be assigned. For now, it’s in draft mode.',
                },
            },
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

export const getCustomPopups = (
    popupID: (typeof CUSTOM_POPUPS_ID)[keyof typeof CUSTOM_POPUPS_ID],
) => {
    switch (popupID) {
        case CUSTOM_POPUPS_ID.RESET_DISTANCE:
            return <ResetDistance />;

        default:
            break;
    }
};
