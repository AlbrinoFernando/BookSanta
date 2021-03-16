import React, {Component} from "react";
import {createBottomTabNavigator} from "react-navigation-tabs"
import bookDonateScreen from "../screens/bookDonateScreen";
import bookRequestScreen from "../screens/bookRequestScreen";
import {AppStackNavigator} from "./StackNavigator";

export const AppTabNavigator = createBottomTabNavigator({
    donateBooks: {screen: AppStackNavigator},
    requestBooks: {screen: bookRequestScreen}
})