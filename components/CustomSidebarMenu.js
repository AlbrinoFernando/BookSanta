import React, {Component} from "react"
import {Text, View, TouchableOpacity, StyleSheet} from "react-native";
import {DrawerItems} from "react-navigation-drawer"
import {Avatar} from "react-native-elements";
import db from "../config"
import firebase from "firebase"
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default class CustomSideBarMenu extends React.Component{
    constructor(){
        super();
        this.state = {
            image: "#",
            name: "",
            userId: firebase.auth().currentUser.email
        }
    }

    getUserProfile(){
        db.collection("users").where("email_id", "==", this.state.userId).onSnapshot(query=>{
            query.forEach(doc=>{
                this.setState({
                    name: doc.data().first_name,
                    docId: doc.id,
                    image: doc.data().image
                })
            })
        })
    }

    fetchImage = async (imageName) => {
        var storageRef = firebase.storage().ref().child("user_profiles/" + imageName);
        storageRef.getDownloadURL().then(url=>{
            this.setState({
                image: url
            })
        }).catch(error=>{
            this.setState({
                image: "#"
            })
        })
    }

    uploadImage = async (uri, imageName) => {
        var response = await fetch(uri)
        var blob = await response.blob();
        var ref = firebase.storage().ref().child("user_profiles/" + imageName);

        return ref.put(blob).then(response=>{
            this.fetchImage(imageName)
        })
    }

    selectPicture = async () => {
        const {canceled, uri} = await(ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        }))

        if(!canceled){
            this.uploadImage(uri, this.state.userId);
            /*this.setState({
                image: uri
            })*/
        }
    }

    componentDidMount(){
        this.getUserProfile();
        this.fetchImage(this.state.userId);
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <View style={{flex: 0.5, alignItems: "center"}}>
                    <Avatar
                    rounded
                    source={{uri: this.state.image}}
                    size="medium"
                    containerStyle={styles.imageContainer}
                    onPress={
                        ()=>{
                            this.selectPicture();
                        }
                    }
                    />
                </View>

                <View style={{flex: 0.8, marginTop: 20}}>
                    <DrawerItems {...this.props}/>
                </View>

                <View style={{marginBottom: 50, marginLeft: 15}}>
                    <TouchableOpacity onPress={
                        ()=>{
                            this.props.navigation.navigate("welcomeScreen")
                            firebase.auth().signOut();
                        }
                    }>
                        <Text>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    imageContainer:{
        width: "60%",
        height: "20%",
        flex: 0.7,
        marginTop: 45
    }
})