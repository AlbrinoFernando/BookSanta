import React, {Component} from "react";
import {View, Text} from "react-native";
import firebase from "firebase";
import db from "../config";
import { TouchableOpacity } from "react-native";
import {Card} from "react-native-elements";
import MyHeader from "../components/MyHeader";

export default class RecieverDetailsScreen extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            userId: firebase.auth().currentUser.email,
            recieverId: this.props.navigation.getParam('details')["user_id"],
            requestId: this.props.navigation.getParam('details')["request_id"],
            bookName: this.props.navigation.getParam('details')["book_name"],
            bookDetails: this.props.navigation.getParam('details')["book_reason"],

            recieverName: "",
            recieverContact: "",
            recieverAddress: "",
            recieverRequestDocId: ""
        }
    }

    updateBookStatus(){
        db.collection("all_donations").add({
            book_name: this.state.bookName,
            request_id: this.state.requestId,
            requested_by: this.state.recieverName,
            donor_id: this.state.userId,
            request_status: "Donor Interested"
        })
    }

    addNotification = () => {
        var message = this.state.userId + " has shown interest in donating " + this.state.bookName;
        db.collection("all_notifications").add({
            target_user_id: this.state.recieverId,
            donor_id: this.state.userId,
            request_id: this.state.requestId,
            book_name: this.state.bookName,
            date: firebase.firestore.FieldValue.serverTimestamp(),
            notification_status: "unread",
            message: message
        })
    }

    getRecieverDetails(){
        //console.log(this.state.recieverId)

        db.collection("users").where("email_id", "==" , this.state.recieverId).get().then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                    recieverName: doc.data().first_name,
                    recieverAddress: doc.data().address,
                    recieverContact: doc.data().contact
                })
            })
        });

        db.collection("requested_books").where("request_id", "==", this.state.requestId).get().then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                    recieverRequestDocId: doc.id
                })
            })
        })
    }

    componentDidMount(){
        this.getRecieverDetails();
    }

    render(){
        return(
            <View>
                <MyHeader title="Donate Books"
                navigation={this.props.navigation}/>
                
                <View>
                    <Card title="Book Information" titleStyle={{fontSize: 20}}>
                        <Card>
                            <Text>
                                Book Name: {this.state.bookName}
                            </Text>
                        </Card>
                        <Card>
                            <Text>
                                Request Reason: {this.state.bookDetails}
                            </Text>
                        </Card>
                    </Card>
                </View>

                <View>
                    <Card title="Reciever Information" titleStyle={{fontSize: 20}}>
                        <Card>
                            <Text>
                                Reciever Name: {this.state.recieverName}
                            </Text>
                        </Card>
                        <Card>
                            <Text>
                                Contact Info: {this.state.recieverContact}
                            </Text>
                        </Card>
                        <Card>
                            <Text>
                                Address: {this.state.recieverAddress}
                            </Text>
                        </Card>
                    </Card>
                </View>

                <View style={{alignItems: "center", marginTop: 20}}>
                    {
                        this.state.recieverId !== this.state.userId
                        ? (<TouchableOpacity onPress={
                            ()=>{
                                this.updateBookStatus()
                                this.addNotification()
                                this.props.navigation.navigate("MyDonationScreen")
                            }
                        }>
                            <Text style={{fontSize: 25}}>I want to donate</Text>
                        </TouchableOpacity>)

                        : (<View></View>)
                    }
                </View>
            </View>
        )
    }
}