import React, {Component} from "react";
import {View, Text, TouchableOpacity, 
    StyleSheet, TextInput, Alert, Modal, 
    ScrollView, KeyboardAvoidingView} from "react-native"
import db from "../config"
import SantaClaus from "../components/SantaClaus"
import firebase from "firebase";

export default class WelcomeScreen extends React.Component{
  constructor(){
    super();

    this.state = {
      emailId: "",
      password: "",
      address: "",
      contact: "",
      confirmPassword: "",
      isModalVisible: false
    }
  }

  userSignUp=(email, password, confirmPassword)=>{
    if(password !== confirmPassword){
      return Alert.alert("Your passwords don't match!")
    }else{
      firebase.auth().createUserWithEmailAndPassword(email, password).then(()=>{
        db.collection("users").add({
          email_id: this.state.emailId,
          first_name: this.state.firstName,
          last_name: this.state.lastName,
          address: this.state.address,
          contact: this.state.contact
        })
        return Alert.alert("User added succesfully!", "", [{
            text: "Okay",
            onPress: ()=>{
              this.setState({
                isModalVisible: false
              })
            }
          }])
      })
    }
  }

  showModal=()=>{
      return(
        <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isModalVisible}>
            <View style={styles.modalContainer}>
                <ScrollView style={{width: "100%"}}>
                    <KeyboardAvoidingView style={{flex: 1, 
                        justifyContent: "center", alignItems: "center"}}>
                        <TextInput style={styles.textInput}
                        placeholder="email Id"
                            onChangeText={
                                (text)=>{
                                this.setState({
                                    emailId: text
                                })
                                }
                            }/>

                            <TextInput style={styles.textInput}
                        placeholder="first name"
                            onChangeText={
                                (text)=>{
                                this.setState({
                                    firstName: text
                                })
                                }
                            }/>

                            <TextInput style={styles.textInput}
                        placeholder="last name"
                            onChangeText={
                                (text)=>{
                                this.setState({
                                    lastName: text
                                })
                                }
                            }/>

                            <TextInput style={styles.textInput}
                            placeholder="address"
                            multiline={true}
                            onChangeText={
                                (text)=>{
                                this.setState({
                                    address: text
                                })
                                }
                            }/>

                            <TextInput style={styles.textInput}
                            placeholder="contact"
                            keyboardType="numeric"
                            maxLength={10}
                            onChangeText={
                                (text)=>{
                                this.setState({
                                    contact: text
                                })
                                }
                            }/>

                            <TextInput style={styles.textInput}
                            placeholder="password"
                            onChangeText={
                            (text)=>{
                                this.setState({
                                password: text
                                })
                            }
                            }
                            secureTextEntry={true}/>
                             <TextInput style={styles.textInput}
                             placeholder="confirm password"
                            onChangeText={
                            (text)=>{
                                this.setState({
                                confirmPassword: text
                                })
                            }
                            }
                            secureTextEntry={true}/>
                            <View style={styles.signUpButtonsContainer}>
                              <TouchableOpacity style={styles.cancel}
                              onPress={
                                ()=>{
                                  this.setState({
                                    isModalVisible: false
                                  })
                                }
                              }>
                                <Text style={styles.cancelText}>Cancel</Text>
                              </TouchableOpacity>

                              <TouchableOpacity style={styles.confirm}
                              onPress={
                                ()=>{
                                  this.userSignUp(this.state.emailId, 
                                  this.state.password, 
                                  this.state.confirmPassword);
                                }
                              }>
                                <Text style={styles.confirmText}>Confirm</Text>
                              </TouchableOpacity>
                            </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </View>
        </Modal>
      )
  }

  login=(email, password)=>{
    firebase.auth().signInWithEmailAndPassword(email, password).then(()=>{
        this.props.navigation.navigate("donateBooks")
    }).catch((error)=>{
        return Alert.alert(error.message);
    })
  }

  render(){
    return(
      <View style={styles.container}>
        {this.showModal()}

        <Text style={styles.title}>Book Santa</Text>
        
        <SantaClaus/>
            <TextInput style={styles.textInput}
            onChangeText={
                (text)=>{
                this.setState({
                    emailId: text
                })
                }
            }/>
            <TextInput style={styles.textInput}
            onChangeText={
            (text)=>{
                this.setState({
                password: text
                })}}
            secureTextEntry={true}/>

            <TouchableOpacity style={styles.signInButton}
            onPress={()=>{
                this.login(this.state.emailId, this.state.password)
            }}>
            <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.signUpButton}
             onPress={()=>{
              this.setState({
                  isModalVisible: true
              })
            }}>
                <Text style={styles.signUpButtonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signUpButton}
             onPress={()=>{
              this.props.navigation.navigate("forgotPasswordScreen")
            }}>
                <Text style={styles.signUpButtonText}>Forgot Password?</Text>
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