import React, {Component} from "react";
import {View} from "react-native";
import {Header, Icon, Badge} from "react-native-elements"
import { DrawerActions } from "react-navigation-drawer";
import db from "../config";
import firebase from "firebase"

export default class MyHeader extends Component{
    constructor(props){
        super(props)

        this.state = {
            value: 0,
            userId: firebase.auth().currentUser.email
        }
    }

getUnreadNotifications = () => {
    db.collection("all_notifications").where("notification_status", "==", "unread")
    .where("target_user_id", "==", this.state.userId).onSnapshot(snapshot=>{
        var unreadNotifications = snapshot.docs.map(doc=>{
            doc.data()
        })
        
        this.setState({
            value: unreadNotifications.length
        })
    })
}

componentDidMount(){
    this.getUnreadNotifications();
}

 BellIconWithBadge = () =>{
    return(
        <View>
            <Icon name="bell" color="white" type="font-awesome"
            onPress={
                ()=>{
                    this.props.navigation.navigate("NotificationScreen");
                }
            }/>
            <Badge value={this.state.value} containerStyle={{position: "absolute", top: -4, right: -4}}/>
        </View>
    )
}

render(){
    return(
        <Header
        centerComponent = {{text: this.props.title, style:{fontSize: 24, color: "white", fontWeight: "bold"}}}
        leftComponent = {<Icon name="bars" color="white" type="font-awesome" onPress={
            ()=>{
                this.props.navigation.toggleDrawer();
            }
        }/>}
        rightComponent = {<this.BellIconWithBadge {...this.props}/>}
        backgroundColor = "red"/>
        )
    }
}
