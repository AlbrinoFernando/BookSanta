import {createStackNavigator} from "react-navigation-stack";
import BookDonateScreen from "../screens/bookDonateScreen";
import RecieverDetailsScreen from "../screens/recieverDetailScreen";

export const AppStackNavigator = createStackNavigator({
    bookDonateList: {screen: BookDonateScreen, navigationOptions: {headerShown: false}},
    recieverDetails: {screen: RecieverDetailsScreen, navigationOptions: {headerShown: false}}
},

{
    initialRouteName: 'bookDonateList'
});
