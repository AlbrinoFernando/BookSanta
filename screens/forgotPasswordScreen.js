import React, {Component} from "react";
import {View, Text, TouchableOpacity, 
    StyleSheet, TextInput, Alert, Modal, 
    ScrollView, KeyboardAvoidingView} from "react-native"
import db from "../config"
import SantaClaus from "../components/SantaClaus"
import firebase from "firebase";

export default class ForgotPasswordScreen extends React.Component{
  constructor(){
    super();

    this.state = {
      emailId: "",
    }
  }

  resetPassword = (email) => {
    firebase.auth().sendPasswordResetEmail(email).then(function() {
      Alert.alert("Recovery Email Sent!")
      this.props.navigation.navigate("welcomeScreen")
    }).catch(function(error) {
      Alert.alert("Email not found!")
    });
  }

  render(){
    return(
      <View style={styles.container}>

        <Text style={styles.title}>         Book Santa{"\n"}
        Password Recovery</Text>
        
        <SantaClaus/>
            <View style={{marginTop: 50}}></View>
            <TextInput style={styles.textInput}
            placeholder="The Email You Used To Register"
            onChangeText={
                (text)=>{
                this.setState({
                    emailId: text
                })
                }
            }/>

            <TouchableOpacity style={styles.signInButton}
            onPress={()=>{
                this.resetPassword(this.state.emailId)
            }}>
            <Text style={styles.signInButtonText}>Send Recovery Email</Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.signUpButton}
             onPress={()=>{
              this.props.navigation.navigate("welcomeScreen")
            }}>
                <Text style={styles.signUpButtonText}>Back to login</Text>
            </TouchableOpacity>
          </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    paddingTop: "10%",
    flex: 1,
    backgroundColor: "#f8be85"
  },
  title:{
    alignSelf: "center",
    fontSize: 32,
    fontWeight: "bold",
  }, 
  textInput:{
    width: "75%",
    alignSelf: "center",
    borderStyle: "solid",
    borderWidth: 5,
    borderColor: "black",
    borderRadius: 5,
    height: 40,
    margin: 20,
    backgroundColor: "white"
  },
  signInButton:{
    alignSelf: "center",
    backgroundColor: "#f74020",
    padding: 10,
    borderRadius: 50,
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 4,
  },
  signUpButton:{
    alignSelf: "center",
    marginBottom: 50,
  },
  signInButtonText:{
    fontSize: 25,
  },
  signUpButtonText:{
    fontSize: 22,
    textDecorationLine: "underline"
  },
  buttonContainer:{
    flex: 1,
    justifyContent: "flex-end"
  },
  modalContainer:{ 
    flex:1, 
    borderRadius:20, 
    justifyContent:'center', 
    alignItems:'center', 
    backgroundColor:"#ffff", 
    marginRight:30, 
    marginLeft: 30, 
    marginTop:80, 
    marginBottom:80, 
  },

})