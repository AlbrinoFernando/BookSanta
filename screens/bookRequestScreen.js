import React, {Component} from "react";
import {View, TouchableOpacity, StyleSheet, TextInput, Text, Alert, TouchableHighlight} from "react-native";
import MyHeader from "../components/MyHeader"
import firebase from "firebase"
import {BookSearch} from "react-native-google-books";
import db from "../config"
import { FlatList } from "react-native-gesture-handler";

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
            docId: "",
            requestedBookName: "",
            dataSource: "",
            showFlatlist: false
        }
    }

    async getBooksFromAPI(bookName){
        this.setState({
            bookName: bookName
        })

        if(bookName.length > 2){
            var book = await BookSearch.searchbook(bookName, "AIzaSyDJsdAFKSX7Tr6lKeKpcK6vCOta9yFFHqA");
            console.log(book)
            this.setState({
                dataSource: book.data,
                showFlatlist: true
            })
        }
    }

    renderItem = ({item, i}) => {
        var obj = {title: item.volumeInfo.title, 
            selfLink: item.selfLink, 
            buyLink: item.saleInfo.buyLink,
            imageLink: item.volumeInfo.imageLinks}

        return(<TouchableHighlight style={{alignItems: "center", padding: 10, width: "90%", backgroundColor: "#dddddd", alignSelf: "center"}}
        activeOpacity={0.6} underlayColor={"#dddddd"}
        onPress={
            ()=>{
                this.setState({
                    bookName: item.volumeInfo.title,
                    showFlatlist: false
                })
            }
        }>
            <Text>{item.volumeInfo.title}</Text>
        </TouchableHighlight>)
    }

    sendNotification = () => {
        var name, lastName, donorId, bookName;

        db.collection("users").where("email_id", "==", this.state.userId).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                name = doc.data().first_name;
                lastName = doc.data().last_name;

                db.collection("all_notifications").where("request_id", "==", this.state.requestId).get()
                .then(snapshot=>{
                    snapshot.forEach(doc=>{
                        donorId = doc.data().donor_id;
                        bookName = doc.data().book_name;

                        db.collection("all_notifications").add({
                            target_user_id: donorId,
                            book_name: bookName,
                            notification_status: "unread",
                            message: name + " " + lastName + "has recieved the book " + bookName + "!"
                        })
                    })
                })
            })
        })
    }

    recievedBooks = (bookName) => {
        db.collection("recieved_books").add({
            user_id: this.state.userId,
            request_id: this.state.requestId,
            book_status: "recieved",
            book_name: bookName
        })
    }

    updateBookRequestStatus = () => {
        db.collection("requested_books").doc(this.state.docId).update({
            book_status: "recieved"
        })

        db.collection("users").where("email_id", "==", this.state.userId).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                db.collection("users").doc(doc.id).update({
                    isBookRequestActive: false
                })
            })
        })
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
                    console.log(doc.data())
                    this.setState({
                        requestId: doc.data().request_id,
                        bookStatus: doc.data().book_status,
                        requestedBookName: doc.data().book_name,
                        docId: doc.id,
                    })
                }
            })
        })
    }

    addBookRequest = async (bookName, bookReason) => {
        var userId = this.state.userId;
        var randomRequestId = this.createUniqueId();

        var books = await BookSearch.searchbook(bookName, "AIzaSyDJsdAFKSX7Tr6lKeKpcK6vCOta9yFFHqA")

        db.collection("requested_books").add({
            "user_id": userId,
            "book_name": bookName,
            "book_reason": bookReason,
            "request_id": randomRequestId,
            "book_status": "requested",
            "image_link": books.data[0].volumeInfo.imageLinks.smallThumbnail
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
                <View>
                     <MyHeader title="Request Books"
                    navigation={this.props.navigation}/>

                    <Text>
                        {this.state.requestedBookName} 
                    </Text>

                    <Text>
                        {this.state.bookStatus}
                    </Text>

                    <TouchableOpacity style={{marginTop: 10}}
                    onPress={
                        ()=>{
                            this.updateBookRequestStatus();
                            this.recievedBooks(this.state.requestedBookName);
                            this.sendNotification();
                        }
                    }>
                        <Text>
                            I recieved the book
                        </Text>
                    </TouchableOpacity>
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
                            this.getBooksFromAPI(text);
                        }
                    }/>

                    {this.state.showFlatlist
                    ? (<FlatList data={this.state.dataSource} 
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        style={{marginTop: 10}}/>)
                    : (<View><TextInput style={styles.textInputChunky}
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
                    </View>)}
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