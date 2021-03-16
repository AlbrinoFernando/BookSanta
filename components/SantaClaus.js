import React, {Component} from "react";
import LottieView from "lottie-react-native"

export default class SantaClaus extends React.Component{
    render(){
        return(
            <LottieView source={require("../assets/santa.json")}
            style={{width: "60%", alignSelf:"center"}} autoPlay loop/>
        )
    }
}