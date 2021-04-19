import React, {Component} from "react";
import {createDrawerNavigator} from "react-navigation-drawer";
import {AppTabNavigator} from "./AppTabNavigator";
import CustomSideBarMenu from "./CustomSidebarMenu"
import SettingsScreen from "../screens/settingsScreen";
import MyDonationScreen from "../screens/myDonationScreen";
import NotificationScreen from "../screens/notificationScreen";

export const AppDrawerNavigator = createDrawerNavigator({
    home: {screen: AppTabNavigator},
    settings: {screen: SettingsScreen},
    myDonations: {screen: MyDonationScreen},
    notifications: {screen: NotificationScreen}
}, 
{
    contentComponent: CustomSideBarMenu
},
{
    initialRouteName: "home"
})