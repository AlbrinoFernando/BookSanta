import React, {Component} from "react";
import {View} from "react-native";
import {Header, Icon} from "react-native-elements"
import { DrawerActions } from "react-navigation-drawer";

const MyHeader = props=>{
    return(
        <Header
        centerComponent = {{text: props.title, style:{fontSize: 24, color: "white", fontWeight: "bold"}}}
        leftComponent = {<Icon name="bars" color="white" type="font-awesome" onPress={
            ()=>{
                props.navigation.toggleDrawer();
            }
        }/>}
        backgroundColor = "red"/>
    )
}

export default MyHeader;