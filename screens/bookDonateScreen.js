import React, {Component} from "react"
import { FlatList } from "react-native";
import {View, Text, TouchableOpacity, StyleSheet, Image} from "react-native";
import {ListItem} from "react-native-elements"
import MyHeader from "../components/MyHeader"
import db from "../config"
import RecieverDetailsScreen from "./recieverDetailScreen";

export default class BookDonateScreen extends React.Component{
    constructor(){
        super();

        this.state = {
            requestedBookList: []
        }

        this.requestRef = null
    }

    getRequestedBookList =()=> {
        
        this.requestRef = db.collection("requested_books").onSnapshot(snapshot=>{
            var requestedBookList = snapshot.docs.map(document=>document.data())
            this.setState({
                requestedBookList: requestedBookList
            })
        })
    }
    
    componentDidMount(){
        this.getRequestedBookList();
    }

    componentWillUnmount(){
        this.requestRef()
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ( {item, i} ) => { 
        return ( 
        <ListItem key={i} bottomDivider>
            <Image source={{uri: item.image_link}} style={{width: 50, height: 50}}/>
            <ListItem.Content>
                <ListItem.Title>{item.book_name}</ListItem.Title>
                <ListItem.Subtitle>{item.book_reason}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron
            onPress = {
                ()=>{
                    this.props.navigation.navigate("recieverDetails", {"details": item});
                }
            }/>
            {/* <TouchableOpacity style={{justifyContent:"flex-end"}}
            onPress = {
                ()=>{
                    console.log(item)
                    this.props.navigation.navigate("recieverDetails", {"details": item});
                }
            }>
                    <Text style={{color:'black', fontWeight: "bold"}}>View</Text> 
            </TouchableOpacity> */}
        </ListItem>
        ) 
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <MyHeader title="Donate Books"
                navigation={this.props.navigation}/>
                <View style={{flex: 1}}>
                    {this.state.requestedBookList.length===0
                    ? (<View style={{flex: 1}}>
                        <Text>No Books Requested</Text>
                    </View>)
                    : (<FlatList keyExtractor={this.keyExtractor}
                    data={this.state.requestedBookList}
                    renderItem={this.renderItem}/>)}
                </View>
            </View>
        )
    }
}