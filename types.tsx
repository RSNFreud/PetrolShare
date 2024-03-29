/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
    // interface Params extends Route {
    //   groupID?: string
    // }
  }
}

export type RootStackParamList = {
  Settings: NavigatorScreenParams<RootTabParamList> | undefined
  AddDistance: NavigatorScreenParams<RootTabParamList> | undefined
  AddSchedule: NavigatorScreenParams<RootTabParamList> | undefined
  AddPetrol: NavigatorScreenParams<RootTabParamList> | undefined
  AddPreset: NavigatorScreenParams<RootTabParamList> | undefined
  History: NavigatorScreenParams<RootTabParamList> | undefined
  AddManual: NavigatorScreenParams<RootTabParamList> | undefined
  Payments: NavigatorScreenParams<RootTabParamList> | undefined
  Login: NavigatorScreenParams<RootTabParamList> | undefined
  Dashboard: NavigatorScreenParams<RootTabParamList> | undefined
  PublicInvoice: any
  NotFound: any
}

export type RootStackScreenProps<
  Screen extends keyof RootStackParamList
> = NativeStackScreenProps<RootStackParamList, Screen>

export type RootTabParamList = {
  Dashboard: { groupID?: string }
  PublicInvoice: { paymentID?: string }
  Payments: { id?: string }
  TabTwo: undefined
}

export type RootTabScreenProps<
  Screen extends keyof RootTabParamList
> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>
