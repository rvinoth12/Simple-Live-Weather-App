import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

const Card = ({style,sedData,boo,position}) => {
  let time = (sedData?.time)?.split(" ") || ''

 
  return (
    <View style={[style,{width:Dimensions.get('window').width - 260,height:Dimensions.get('window').height - 630,marginHorizontal:10,gap:16}]}>
      <View style={{alignItems:'center',gap:5}}>
      <Text style={{color:'navy',fontWeight:500}}>{sedData?.date || time[1] || sedData[position-2]?.date }</Text>
      <Image style={{width:70,height:70}} source={{uri: 'http:'+(sedData?.condition?.icon || sedData?.icon) }} />
      <Text style={{fontSize:14,fontWeight:700,color:'#041466'}}>{sedData?.temp_c || sedData?.avgtemp_c }°C</Text>
      <Text style={{color:'#000',fontSize:10}}>{sedData?.text || sedData?.text }</Text>
      </View>
     
      <View style={{gap:6}}>
        <View style={styles.Shadow}>
          <Text style={styles.cardText}>Wind Speed</Text>
          <Text style={{fontSize:10,color:'orange'}}>{sedData?.wind_kph || sedData?.maxwind_kph}</Text>
        </View>

        <View style={styles.Shadow}>
          <Text style={styles.cardText}>Humidity</Text>
          <Text style={{fontSize:10,color:'orange'}}>{sedData?.humidity || sedData?.avghumidity}%</Text>
        </View>

        <View style={styles.Shadow}>
          <Text style={styles.cardText}>chance of rain</Text>
          <Text style={{fontSize:10,color:'orange'}}>{boo? sedData?.daily_chance_of_rain : sedData?.chance_of_rain }</Text>
        </View>

      </View>

    </View>
  )
}

export default Card

const styles = StyleSheet.create({

  Shadow:{
    backgroundColor: "rgba(247, 249, 255,1)",
    shadowColor: "gray",
    padding:5,
    // elevation: 2,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  cardText:{
    fontSize:10,
    color:"#041466"
  }
  

})