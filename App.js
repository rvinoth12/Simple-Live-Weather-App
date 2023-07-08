import { StatusBar, StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import OnBoard from './components/Onboard/OnBoard';
import HomeScreen from './components/HomeScreen';
import SearchScreen from './components/SearchScreen';
import Register from './components/Onboard/Register';
import ChartScreen from './components/ChartScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <>
    {/* <StatusBar barStyle={'light-content'} backgroundColor={'#041466'} /> */}
    <NavigationContainer>
        <Stack.Navigator initialRouteName='register'>
            <Stack.Screen options={{headerShown:false}} name='register' component={Register}/>
            <Stack.Screen options={{headerShown:false}} name='onboard'  component={OnBoard}/>
            <Stack.Screen options={{headerShown:false}}  name='home'  component={HomeScreen}/>
            <Stack.Screen options={{headerShown:true}} name='search'  component={SearchScreen}/>
            <Stack.Screen options={{headerShown:true}} name='chart' component={ChartScreen}/>
        </Stack.Navigator>
    </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({

});
