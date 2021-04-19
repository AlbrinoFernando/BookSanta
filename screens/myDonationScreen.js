import React, {Component} from "react";
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from "react-native"
import {ListItem} from "react-native-elements"
import firebase from "firebase";
import db from "../config"
import MyHeader from "../components/MyHeader";

export default class MyDonationScreen extends React.Component{
    constructor(){
        super()
        this.state = {
            userId: firebase.auth().currentUser.email,
            allDonations: []
        }
        this.requestRef = null;
    }

    getAllDonations = () => {
        this.requestRef = db.collection("all_donations").where("donor_id", "==", this.state.userId).onSnapshot((snapshot)=>{
            // var donations = snapshot.docs.map(document => document.data())
            // this.setState({
            //     allDonations: donations
            // })
            var allDonations = [];
            snapshot.docs.map(doc => {
                var donations = doc.data();
                donations["doc_id"] = doc.id
                allDonations.push(donations);

                this.setState({
                    allDonations: allDonations
                })
            })
        })
    }

    sendNotification = (bookDetails, requestStatus) => {
        var requestId = bookDetails.request_id;
        var donorId = bookDetails.donor_id;
        
        db.collection("all_notifications").where("request_id", "==", requestId).where("donor_id", "==", donorId).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                var message = ""
                if(request_status === "Book Sent"){
                    message = donorId + " sent you a book!"
                }else{
                    message = donorId + " has shown interest in donating a book!"
                }

                db.collection("all_notifications").doc(doc.id).update({
                    message: message,
                    notification_status: "unread",
                    date: firebase.firestore.FieldValue.serverTimestamp(),

                })
            })
        })
    }

    sendBook = (bookDetails) => {
        var id = bookDetails.request_id;
        console.log(bookDetails)
        if(bookDetails.request_status === "Book Sent"){
            db.collection("all_donations").doc(bookDetails.doc_id).update({
                request_status: "Donor Interested"
            })
        this.sendNotification(bookDetails, bookDetails.request_status);
            //this.sendNotificiation(bookDetails, requestStatus);
        }else{
            db.collection("all_donations").doc(bookDetails.doc_id).update({
                request_status: "Book Sent"
            })
            this.sendNotification(bookDetails, bookDetails.request_status);
        }
    }

    componentDidMount(){
        this.getAllDonations()
        console.log(this.state.allDonations.length)
    }

    keyExtractor = (item, index) => index.toString()

    // renderItem = ({item, i}) => (<ListItem
    // key={i}
    // title={item.book_name}/>)

    renderItem = ( {item, i} ) => { 
        return ( 
        <ListItem key={i} bottomDivider>
            <ListItem.Content>
                <ListItem.Title>{item.book_name}</ListItem.Title>
                <ListItem.Subtitle>Requested by {item.requested_by}</ListItem.Subtitle>
            </ListItem.Content>

            <TouchableOpacity style={{justifyContent:"flex-end"}}
            onPress = {
                () => {
                    this.sendBook(item);
                }
            }>
                <Text style={{color:'green', fontWeight: "bold"}}>
                    {item.request_status === "Book Sent"
                    ? "Book Sent"
                    : "Send Book"
                    }    
                </Text> 
            </TouchableOpacity> 
        </ListItem>
        ) 
    }

    render(){
        return(
            <View style={{flex: 1}}>
            <MyHeader title="Donate Books"
            navigation={this.props.navigation}/>
            <View style={{flex: 1}}>
                {this.state.allDonations.length===0
                ? (<View style={{flex: 1}}>
                    <Text>No Books Requested</Text>
                </View>)
                : (<FlatList keyExtractor={this.keyExtractor}
                data={this.state.allDonations}
                renderItem={this.renderItem}/>)}
            </View>
            </View>
        )
    }
}