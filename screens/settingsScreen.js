import React, {Component} from "react"
import {View, StyleSheet, Text, TouchableOpacity, 
    TextInput, Alert, Modal, ScrollView, KeyboardAvoidingView} from "react-native"
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
            docId: "",
            isModalVisible: false
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
                    docId: doc.id,
                    newPassword: "",
                    confirmNewPassword: ""
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

    resetUserPassword=(oldPassword, newPassword)=>{
        this.setState({
            showModal: false
        })

        if(oldPassword === newPassword){
            firebase.auth().currentUser.updatePassword(newPassword)
            Alert.alert("Password Successfully Updated!")
        }else{
            Alert.alert("Passwords did not match!")
        }
    }

    showModal=()=>{
        return(
          <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.isModalVisible}>
              <View style={styles.modalContainer}>
                  <ScrollView style={{width: "100%", backgroundColor: 'rgb(192, 192, 212)', borderRadius: 10}}>
                      <KeyboardAvoidingView style={{flex: 1, 
                          justifyContent: "center", alignItems: "center"}}>
                              <TextInput style={styles.textInput}
                              placeholder="New Password"
                              onChangeText={
                              (text)=>{
                                  this.setState({
                                  newPassword: text
                                  })
                              }
                              }
                              secureTextEntry={true}/>

                               <TextInput style={styles.textInput}
                               placeholder="Confirm New Password"
                              onChangeText={
                              (text)=>{
                                  this.setState({
                                  confirmNewPassword: text
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
                                  <Text style={{fontSize: 20, textAlign: "center"}}>Cancel</Text>
                                </TouchableOpacity>
  
                                <TouchableOpacity style={styles.confirm}
                                onPress={
                                  ()=>{
                                    this.resetUserPassword(this.state.newPassword, this.state.confirmNewPassword)
                                  }
                                }>
                                  <Text style={{fontSize: 20, textAlign: "center"}}>Confirm</Text>
                                </TouchableOpacity>
                              </View>
                      </KeyboardAvoidingView>
                  </ScrollView>
              </View>
          </Modal>
        )
    }

    render(){
        return(
            <View>
                <MyHeader title="Settings"
                navigation={this.props.navigation}/>

                {this.showModal()}

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

                <TouchableOpacity style={styles.button}
                onPress={
                    ()=>{
                        this.setState({
                            isModalVisible: true
                        })
                    }
                }>
                    <Text style={styles.buttonText}>Change Password</Text>
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
        marginTop: 25,
        color: "black"
    },

    button:{
        alignSelf: "center",
        marginTop: 25,
        backgroundColor: "orange",
        padding: 10
    },

    buttonText:{
        fontSize: 25
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
        flexDirection:"row",
      },
})