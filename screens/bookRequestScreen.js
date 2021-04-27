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
            bookReason: "",
            isBookRequestActive: "",
            bookStatus: "",
            requestId: "",
            userDocId: "",
            docId: ""
        }
    }

    createUniqueId(){
        return(
            Math.random().toString(36).substring(7)
        )
    }

    getIsBookRequestActive(){
        db.collection("users").where("email_id", "==", this.state.userId)
        .onSnapshot(snapshot=>{
            snapshot.forEach(doc=>{
                console.log(doc.data())
                console.log("e")

                this.setState({
                    isBookRequestActive: doc.data().isBookRequestActive,
                    userDocId: doc.id
                })
            })
        })
    }

    getBookRequest = () => {

        var bookRequest = db.collection("requested_books")
        .where("user_id", "==", this.state.userId).get().then(snapshot=>{
            snapshot.forEach(doc=>{
                if(doc.data().book_status !== "recieved"){
                    this.setState({
                        requestId: doc.data().request_id,
                        bookStatus: doc.data().bookStatus,
                        docId: doc.id,

                    })
                }
            })
        })
    }

    addBookRequest= async (bookName, bookReason) => {
        var userId = this.state.userId;
        var randomRequestId = this.createUniqueId();

        db.collection("requested_books").add({
            "user_id": userId,
            "book_name": bookName,
            "book_reason": bookReason,
            "request_id": randomRequestId
        })

        var bookRequested = this.state.bookName;

        await this.getBookRequest();

        db.collection("users").where("email_id", "==", userId).get().then()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                db.collection("users").doc(doc.id).update({
                    isBookRequestActive: true
                })
            })
        })

        this.setState({
            bookName: "",
            bookReason: ""
        })

        return Alert.alert(bookRequested + " was successfully requested!")
    }

    componentDidMount(){
        this.getBookRequest();
        this.getIsBookRequestActive();
    }

    render(){
        if(this.state.isBookRequestActive === true){
            return(
                <View style={{flex: 1, justifyContent: "center"}}>
                    <Text>
                        {this.state.bookName} 
                    </Text>

                    <Text>
                        {this.state.bookStatus}
                    </Text>
                </View>
            )
        }else{
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