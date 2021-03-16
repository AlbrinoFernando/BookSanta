import React, {Component} from "react";
import {View, TouchableOpacity, StyleSheet, TextInput, Text, Alert} from "react-native";
import MyHeader from "../components/MyHeader"
import firebase from "firebase"
import db from "../config"

export default class BookRequestScreen extends React.Component{
    constructor(){
        super();

        this.state = {
            userId: firebase.auth().currentUser.email,
            bookName: "",
            bookReason: ""
        }
    }

    createUniqueId(){
        return(
            Math.random().toString(36).substring(7)
        )
    }

    addBookRequest=(bookName, bookReason)=>{
        var userId = this.state.userId;
        var randomRequestId = this.createUniqueId();

        db.collection("requested_books").add({
            "user_id": userId,
            "book_name": bookName,
            "book_reason": bookReason,
            "request_id": randomRequestId
        })

        var bookRequested = this.state.bookName;

        this.setState({
            bookName: "",
            bookReason: ""
        })

        return Alert.alert(bookRequested + " was successfully requested!")
    }

    render(){
        return(
            <View>
                <MyHeader title="Request Books"
                navigation={this.props.navigation}/>

                <TextInput style={styles.textInputThin}
                placeholder="Book To Request"
                value={this.state.bookName}
                onChangeText={
                    (text)=>{
                        this.setState({
                            bookName: text
                        })
                    }
                }/>

                <TextInput style={styles.textInputChunky}
                value={this.state.bookReason}
                placeholder="Why You're Requesting It"
                multiline
                numberOfLines={8}
                onChangeText={
                    (text)=>{
                        this.setState({
                            bookReason: text
                        })
                    }
                }/>

                <TouchableOpacity style={styles.button}
                onPress={
                    ()=>{
                        this.addBookRequest(this.state.bookName, this.state.bookReason)
                    }
                }>
                    <Text style={styles.buttonText}>
                        Request Book
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textInputThin:{
        borderStyle: "solid",
        borderColor: "black",
        borderWidth: 3.5,

        margin: 10,

        width: "80%",
        alignSelf: "center",
        height: 40,
        fontSize: 20
    },
    textInputChunky:{
        borderStyle: "solid",
        borderColor: "black",
        borderWidth: 3.5,

        margin: 10,

        width: "80%",
        alignSelf: "center",
        height: 400,
        fontSize: 20
    },
    button:{
        alignSelf: "center"
    },
    buttonText:{
        fontSize: 20
    }
})