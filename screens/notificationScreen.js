import React, {Component} from "react";
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from "react-native"
import {ListItem} from "react-native-elements"
import firebase from "firebase";
import db from "../config"
import MyHeader from "../components/MyHeader";

export default class NotificationScreen extends React.Component{
    constructor(){
        super()
        this.state = {
            userId: firebase.auth().currentUser.email,
            allNotifications: []
        }
        this.requestRef = null;
    }

    getAllNotifications = () => {
        console.log(this.state.userId)
        this.requestRef = db.collection("all_notifications").where("target_user_id", "==", this.state.userId).onSnapshot((snapshot)=>{
            var allNotifications = [];
            snapshot.docs.map(doc => {
                var notifications = doc.data();
                notifications["doc_id"] = doc.id
                allNotifications.push(notifications);

                this.setState({
                    allNotifications: allNotifications
                })
            })
        })
    }

    componentDidMount(){
        this.getAllNotifications()
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ( {item, i} ) => { 
        return ( 
        <ListItem key={i} bottomDivider>
            <ListItem.Content>
                <ListItem.Title>From {item.donor_id}</ListItem.Title>
                <ListItem.Subtitle>{item.message}</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
        ) 
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <View style={{flex: 1}}>
                    <MyHeader title="Notifications"
                    navigation={this.props.navigation}/>

                    <View style={{flex: 1}}>
                        {this.state.allNotifications.length===0
                        ? (<View style={{flex: 1}}>
                            <Text>No Notifications</Text>
                        </View>)
                        : (<FlatList keyExtractor={this.keyExtractor}
                        data={this.state.allNotifications}
                        renderItem={this.renderItem}/>)}
                    </View>
                </View>
            </View>
        )
    }
}