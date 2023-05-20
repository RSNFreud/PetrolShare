import React from "react"
import { TouchableWithoutFeedback, View } from "react-native"
import Svg, { Path } from "react-native-svg"
import { Text } from "./Themed"
import Colors from "../constants/Colors"
import { BottomTabBarProps } from "@react-navigation/bottom-tabs"

type BottonNavPropTypes = {
    icon: JSX.Element,
    text: string,
    active?: boolean
    handleClick?: () => void
}

const icon = (route: string) => {
    switch (route) {
        case "Dashboard":
            return <Svg width="20" height="20" viewBox='0 0 18 20' fill="none">
                <Path
                    fill="#fff"
                    d="M.111 20V6.667L9 0l8.889 6.667V20h-6.667v-7.778H6.778V20H.11z"
                ></Path>
            </Svg>
        case 'Payments':
            return <Svg
                width="15"
                height="20"
                fill="none"
                viewBox="0 0 15 20"
            >
                <Path
                    fill="#fff"
                    d="M2.5 0A2.502 2.502 0 000 2.5v15C0 18.879 1.121 20 2.5 20h10c1.379 0 2.5-1.121 2.5-2.5V6.25h-5A1.25 1.25 0 018.75 5V0H2.5zM10 0v5h5l-5-5zM2.5 3.125c0-.344.281-.625.625-.625h2.5c.344 0 .625.281.625.625a.627.627 0 01-.625.625h-2.5a.627.627 0 01-.625-.625zm0 2.5c0-.344.281-.625.625-.625h2.5c.344 0 .625.281.625.625a.627.627 0 01-.625.625h-2.5a.627.627 0 01-.625-.625zm5 2.813c.344 0 .625.28.625.624v.676c.332.047.652.121.941.2a.625.625 0 11-.324 1.207c-.433-.118-.86-.204-1.254-.207-.328-.004-.68.07-.922.214-.222.133-.316.286-.316.5 0 .145.05.254.285.395.27.16.649.277 1.14.426l.02.004c.442.132.989.296 1.418.57.473.297.875.77.887 1.492.012.754-.375 1.3-.895 1.625-.3.188-.64.297-.98.355v.669a.627.627 0 01-.625.625.627.627 0 01-.625-.625v-.696a8.355 8.355 0 01-1.207-.348 17.423 17.423 0 01-.242-.081.624.624 0 11.394-1.184c.098.031.188.062.278.094.53.18.96.328 1.418.34.355.011.699-.067.925-.208.2-.125.309-.285.305-.546-.004-.18-.07-.305-.3-.454-.266-.168-.645-.289-1.133-.437l-.063-.02c-.43-.128-.95-.285-1.36-.535-.468-.281-.882-.738-.886-1.457-.004-.758.422-1.281.93-1.582.293-.172.617-.281.941-.34v-.671c0-.344.281-.626.625-.626z"
                ></Path>
            </Svg>
        case 'History':
            return <Svg width="20" height="20" fill="none">
                <Path
                    fill="#fff"
                    d="M10 20c-2.556 0-4.783-.847-6.681-2.542C1.42 15.763.333 13.648.056 11.11h2.277c.26 1.926 1.116 3.519 2.57 4.778 1.454 1.26 3.153 1.889 5.097 1.889 2.167 0 4.005-.755 5.514-2.265 1.51-1.51 2.265-3.347 2.264-5.513 0-2.167-.755-4.005-2.265-5.514-1.51-1.51-3.347-2.265-5.513-2.264a7.5 7.5 0 00-3.583.89A8.257 8.257 0 003.61 5.555h3.056v2.222H0V1.11h2.222v2.611a9.7 9.7 0 013.46-2.75A9.924 9.924 0 0110 0c1.389 0 2.69.264 3.903.792A10.178 10.178 0 0117.07 2.93a10.2 10.2 0 012.139 3.167A9.656 9.656 0 0120 10c0 1.389-.264 2.69-.792 3.903a10.18 10.18 0 01-2.138 3.167 10.186 10.186 0 01-3.167 2.139A9.656 9.656 0 0110 20zm3.111-5.333L8.89 10.444v-6h2.222v5.112l3.556 3.555-1.556 1.556z"
                ></Path>
            </Svg>
        default:
            return <></>
    }
}

const BottomNavItem = ({ icon, text, active, handleClick }: BottonNavPropTypes) => (
    <TouchableWithoutFeedback onPress={handleClick}>
        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: active ? 1 : 0.5, paddingVertical: 15, paddingHorizontal: 5, flex: 1 }}>
            {icon}
            <Text style={{ marginTop: 10, fontSize: 14, fontWeight: 'bold' }}>{text}</Text>
        </View>
    </TouchableWithoutFeedback>
)

export default ({ state, descriptors, navigation }: BottomTabBarProps) => {

    return <View style={{ backgroundColor: Colors.secondary, width: '100%', display: 'flex', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 25 }}>
        {state?.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label = typeof options.tabBarLabel !== 'string'
                ? route.name
                : options.tabBarLabel;

            const isFocused = state.index === index;

            const onPress = () => {
                if (!isFocused) {
                    navigation.navigate(route.name);
                }
            };

            return (
                <BottomNavItem
                    key={route.name}
                    active={isFocused}
                    text={label}
                    handleClick={onPress}
                    icon={icon(route.name)}
                />
            );
        })}
    </View>
}