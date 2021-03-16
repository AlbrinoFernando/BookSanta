import React, {Component} from "react";
import {createDrawerNavigator} from "react-navigation-drawer";
import {AppTabNavigator} from "./AppTabNavigator";
import CustomSideBarMenu from "./CustomSidebarMenu"
import SettingsScreen from "../screens/settingsScreen";
import MyDonationScreen from "../screens/myDonationScreen";

export const AppDrawerNavigator = createDrawerNavigator({
    home: {screen: AppTabNavigator},
    settings: {screen: SettingsScreen},
    myDonations: {screen: MyDonationScreen}
}, 
{
    contentComponent: CustomSideBarMenu
},
{
    initialRouteName: "home"
})