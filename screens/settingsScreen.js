import React, {Component} from "react"
import {View, StyleSheet, Text, TouchableOpacity, TextInput, Alert} from "react-native"
import MyHeader from "../components/MyHeader"
import db from "../config";
import firebase from "firebase"

export default class SettingsScreen extends React.Component{
    constructor(){
        super();

        this.state = {
            firstName: "",
            lastName: "",
            address: "",
            contact: "",
            docId: ""
        }
    }

    getUserDetails = () => {
        var email = firebase.auth().currentUser.email;
        const userDetails = db.collection("users").where("email_id", "==", email).get().then(snapshot=>{
            snapshot.forEach(doc=>{
                var data = doc.data();
                this.setState({
                    firstName: data.first_name,
                    lastName: data.last_name,
                    address: data.address,
                    contact: data.contact,
                    docId: doc.id
                })
            })
        });
    }

    updateDetails = () => {
        db.collection("users").doc(this.state.docId).update({
            "first_name": this.state.firstName,
            "last_name": this.state.lastName,
            "address": this.state.address,
            "contact": this.state.contact
        })

        Alert.alert("Profile updated successfully!")
    }

    componentDidMount(){
        this.getUserDetails()
    }

    render(){
        return(
            <View>
                <MyHeader title="Settings"
                navigation={this.props.navigation}/>

                <TextInput style={styles.textInput}
                placeholder="First Name"
                onChangeText={
                    (text)=>{
                        this.setState({
                            firstName: text
                        })
                    }
                }
                value={this.state.firstName}/>
                <TextInput style={styles.textInput}
                placeholder="Last Name"
                onChangeText={
                    (text)=>{
                        this.setState({
                            lastName: text
                        })
                    }
                }
                value={this.state.lastName}/>

                <TextInput style={styles.textInput}
                placeholder="Address"
                multiline={true}
                onChangeText={
                    (text)=>{
                        this.setState({
                            address: text
                        })
                    }
                }
                value={this.state.address}/>
                <TextInput style={styles.textInput}
                placeholder="Contact Info"
                keyboardType="number-pad"
                maxLength={10}
                onChangeText={
                    (text)=>{
                        this.setState({
                            contact: text
                        })
                    }
                }
                value={this.state.contact}/>

                <TouchableOpacity style={styles.button}
                onPress={
                    ()=>{
                        this.updateDetails()
                    }
                }>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textInput:{
        borderColor: "black",
        borderWidth: 4,
        borderStyle: "solid",
        width: "80%",
        alignSelf: "center",
        height: 50,
        fontSize: 20,
        marginTop: 25
    },

    button:{
        alignSelf: "center",
        marginTop: 25,
        backgroundColor: "orange",
        padding: 10
    },

    buttonText:{
        fontSize: 25
    }
})