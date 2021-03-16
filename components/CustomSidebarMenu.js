import React, {Component} from "react"
import {Text, View, TouchableOpacity, StyleSheet} from "react-native";
import {DrawerItems} from "react-navigation-drawer"
import firebase from "firebase"

export default class CustomSideBarMenu extends React.Component{
    render(){
        return(
            <View style={{flex: 1}}>
                <View style={{flex: 0.8, marginTop: 20}}>
                    <DrawerItems {...this.props}/>
                </View>

                <View>
                    <TouchableOpacity onPress={
                        ()=>{
                            this.props.navigation.navigate("welcomeScreen")
                            firebase.auth().signOut();
                        }
                    }>
                        <Text>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}