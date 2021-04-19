import React, {Component} from "react";
import {View, Dimensions, Animated} from "react-native";
import {ListItem} from "react-native-elements";
import {SwipeListView} from "react-native-swipe-list-view";
import db from "../config";
import firebase from "firebase";

export default class SwipableFlatList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            allNotifications: this.props.allNotifications
        }
    }

    updateNotification = (notification) => {
        db.collection("all_notifications").doc(notification.doc_id).update({
            notification_status: "read"
        })
    }

    onSwipeValueChange = (swipeData) => {
        var allNotifications = this.state.allNotifications;

        const {key, value} = swipeData;

        if(value < -Dimensions.get("window").width){
            const newData = [...allNotifications]
            this.updateNotification(allNotifications[key])
            newData.splice(key, 1)

            this.setState({
                allNotifications: newData
            })
        }
    } 

    renderItem = (data) => {
        <Animated.View>
            <ListItem
            title={data.item.book_name}
            bottomDivider/>
        </Animated.View>
    }

    renderHiddenItem = () => {
        <View>
            <Text>
                Mark As Read
            </Text>
        </View>
    }

    render(){
        return(
            <View>

            </View>
        )
    }
}