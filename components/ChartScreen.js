import { Dimensions, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { LineChart } from "react-native-chart-kit"
import DatePicker from 'react-native-modern-datepicker';
import { useNavigation } from "@react-navigation/native";

const ChartScreen = () => {
  const [dateVisible,setDateVisible] = useState({from:false,to:false});
  const [date,setDate] = useState({from:'2023-05-01',to:'2023-07-01'})
  const [mDate,setMDate] = useState()
  const [loading, setLoading] = useState(false);

  const navi = useNavigation();
  // date post function
    const dateFun = async()=>{
    let requestOptions = {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(date)
    }

    await fetch("http://192.168.1.28:42042/date",requestOptions)
      .then((res)=>res.json()).then((result)=>{
        setMDate({data:result?.result, avgtemp:parseFloat(result?.avgtemp).toFixed(2)})
        console.log('result 2 :',result)
        setLoading(false);
      })

    }

    const filter = (() => {
      setLoading(true);
      dateFun()
    });

    useEffect(()=>{
      setLoading(true);
      dateFun()
    },[])


    let dateArr = [];
    let avgtempArr = [];
    for(let i=0;i<mDate?.data.length;i++){
      dateArr.push(mDate.data[i].date)
      avgtempArr.push(mDate.data[i].avgtemp_c)
    }
console.log(dateArr);
console.log(avgtempArr);


  const data = {
    labels: mDate != undefined? dateArr : ['j','f','m'] ,
    // labels: ['aa','a','ad','ad'],
    datasets: [
      {
        // data: [12,123,23,23],
        data:mDate != undefined? avgtempArr: [2,4,6] ,

        strokeWidth: 2, // optional
      },
    ],
    legend: ["Rainy Days"], // optional
  };


  
  console.log('mDate',mDate)

  // navi.addListener('beforeRemove',event =>{
  //   event.preventDefault();

  //   Alert.alert(
  //     'Discard Details',
  //     'Are you sure you want to discard this?',
  //     [
  //       {text:'No',style:'cancel', onPress:()=>{}},
  //       {text:'Yes',style:'destructive',onPress:()=>navi.dispatch(event.data.action)},
  //     ]
  //   )
  // })


  return (
    <>
    {
        loading && 
        <View
        style={{
          position: "absolute",
          height: Dimensions.get('window').height,
          width: Dimensions.get('window').width,
          zIndex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(240,240,240,1)",
        }}
      >
        <Image source={require('../assets/icons/loading2.gif')}  style={{width:300,height:300}} />

      </View>
       }
    <View style={{marginHorizontal:'5%'}}>

        {/* from modal */}
        <Modal animationType="fade" transparent={true} visible={dateVisible.from}>
        <TouchableOpacity onPress={()=>setDateVisible({...dateVisible,from:false})} style={{backgroundColor:'transparent'  ,flex:1}}>
        <DatePicker
            mode="calendar"
            style={{position:'absolute',width:Dimensions.get('window').width}}
            current="2023-05-12"
            minimumDate="2023-01-01"
            maximumDate="2023-12-31"
            selectorStartingYear={2000}
            onDateChange={(e) => {setDate({...date,from:e}),setDateVisible({...dateVisible,from:false})}}
          />
        </TouchableOpacity>
        </Modal>

{/* To modal */}
        <Modal animationType="fade" transparent={true}  visible={dateVisible.to}>
        <TouchableOpacity onPress={()=>setDateVisible({...dateVisible,to:false})} style={{backgroundColor:'transparent'  ,flex:1}}>
        <DatePicker
            mode="calendar"
            style={{position:'absolute',width:Dimensions.get('window').width}}
            current="2023-05-12"
            minimumDate="2023-02-17"
            maximumDate="2024-07-25"
            onSelectedChange={(e) => {setDate({...date,to:e}),setDateVisible({...dateVisible,to:false})}}
          />
        </TouchableOpacity>
        </Modal>


        <View style={[styles.flex,styles.boxShadow,{marginVertical:30}]}>
          
          <TouchableOpacity onPress={()=>setDateVisible({from:true,to:false})} style={[styles.flex,]}>
            <Text>From : </Text>
            <TextInput editable={false} value={date.from} style={{borderWidth:1,borderColor:'lightgray',width:100,paddingHorizontal:10,paddingVertical:3}} placeholder="yyyy/mm/dd" />
          </TouchableOpacity>
          
         
          <TouchableOpacity onPress={()=>setDateVisible({from:false,to:true})} style={[styles.flex]}>
            <Text>To : </Text>
            <TextInput editable={false} value={date.to} style={{borderWidth:1,borderColor:'lightgray',width:100,paddingHorizontal:10,paddingVertical:3}} placeholder="yyyy/mm/dd" />
          </TouchableOpacity>

        <TouchableOpacity onPress={filter} style={{backgroundColor:'blue',borderRadius:5,width:50,alignItems:'center',padding:7}}><Text style={{color:'white'}}>Find</Text></TouchableOpacity>
        </View>
        <Text style={{fontSize:26,marginVertical:10,color:'navy'}}>Total Average : <Text style={{color:'orange'}}>{mDate != undefined? mDate.avgtemp:''} °C</Text></Text>
        <View>
          <LineChart
            data={data}
            width={Dimensions.get("window").width-40} // from react-native
            height={240}
            yAxisInterval={1} // optional, defaults to 1
            yAxisSuffix="°C"
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "rgba(254, 254, 255,1)",
              backgroundGradientTo: "gray",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,

              propsForDots: {
                r: "26",
                strokeWidth: 20,
                stroke: "#ffa726",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
    </View>
    </>
  );
};

export default ChartScreen;

const styles = StyleSheet.create({
  boxShadow: {
    backgroundColor: "rgba(254, 254, 255,1)",
    padding: 10,
    shadowColor: "gray",
    elevation: 10,
    borderRadius: 10,
  },
  flex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:'space-between',
    gap: 10,
  },
});
