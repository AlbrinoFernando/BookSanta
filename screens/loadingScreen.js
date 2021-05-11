import React, {Component} from "react";
import {View, Text, ActivityIndicator} from "react-native";
import firebase from "firebase";

export default class LoadingScreen extends React.Component{
    checkIfLoggedIn = () => {
        firebase.auth().onAuthStateChanged(function(user){
          if(user){
            this.props.navigation.navigate("drawer")
          }else{
            this.props.navigate.navigate("welcomeScreen")
          }
        }.bind(this))
      }

    componentDidMount(){
        this.checkIfLoggedIn();
    }

    render(){
        return(
            <View>
                <ActivityIndicator size="large"/>
            </View>
        )
    }
}