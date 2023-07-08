import React, { useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Card from "./Card";
import { Colors } from "./ColorCode";


const HomeScreen = ({ route }) => {
  const [data, setData] = useState([]);
  const [temp, setTemp] = useState({ today: true, week: false,month:false, color: "pink" });
  const [userModal,setUserModal] = useState(false)
  const [loading, setLoading] = useState(true);
  // navigation link
  const navi = useNavigation();

  // width and height
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  const apiData = async () => {

       let requestOptions = {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          mode:'cors', 
          body:JSON.stringify({location:route.params.location,email:data?.email})
        }  

      await fetch("http://192.168.1.28:27027/all_data",requestOptions)
      .then((res)=>res.json()).then((result)=>{
        setData(result[0])
        console.log('result',result)
        setLoading(false);
      })
  };

console.log('result',route.params?.result)
console.log('location',route.params?.location)

  useEffect(() => {
    setLoading(true);
    if(route.params?.result !== undefined){
      console.log('result',route.params?.result)
      setData(route.params?.result[0])
      setLoading(false);
    }
    if (route.params?.location !== undefined) {
      console.log('location2',route.params?.location)
      apiData();
      
    }
  }, [route.params]);


  console.log('data',data)


 
  useEffect(()=>{
    const back = ()=>{
      Alert.alert(
        'Exit App',
        'Are you sure you want to closed this app ?',
        [
          {text:'No',style:'cancel', onPress:()=>{}},
          {text:'Yes',style:'destructive',onPress:()=>BackHandler.exitApp()}
        ])
        return true
      }
  
      BackHandler.addEventListener(
        "hardwareBackPress",
        back
      )
    },[])



  return (
   
    <>
    <StatusBar barStyle={'dark-content'} backgroundColor={"white"}/>
    <View >
      {/* loading screen */}
      {
        loading && 
        <View
        style={{
          position: "absolute",
          height: height,
          width: width,
          zIndex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(240,240,240,1)",
        }}
      >
        <Image source={require('../assets/icons/loading2.gif')}  style={{width:300,height:300}} />

      </View>
       }
      


      <View style={{ alignItems: "center",backgroundColor:'white' }}>

        <View style={styles.container}>
          {/* location state */}
          <View style={{ position:'relative',falignItems: "center",justifyContent:'center'}}>

            <TouchableOpacity
              onPress={() =>
                navi.navigate("search", `${data?.weatherData?.location?.region}`)
              }
              style={styles.location}
            >
              <Text
                style={[styles.textColor, { fontSize: 25, fontWeight: 700 }]}
              >
                {`${data?.weatherData?.location?.name}`},{" "}
                <Text
                  style={{
                    color: 'orange'||Colors[`${data?.weatherData?.current?.text}`]?.color,
                  }}
                >{`${data?.weatherData?.location?.region}`}</Text>
              </Text>
              <Text style={styles.textColor}>
                {data?.weatherData?.current?.last_updated}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>setUserModal(true)} style={{ position:'absolute',right:-15,top:5}} >
            <Image
            source={require("../assets/icons/user-icon.png")}
            style={{ width: 65, height: 65,}}
            />
            </TouchableOpacity>

          </View>

          {/* users detail modal */}
          <Modal visible={userModal} animationType="fade" transparent={true} >
              <TouchableOpacity activeOpacity={1} onPress={()=>setUserModal(false)}  style={{ flex:1,backgroundColor:'rgba(0,0,0,0.2)'}} >
              </TouchableOpacity>
              <View style={{flex:1,backgroundColor:'white',minWidth:200 ,width:"65%",height:height,alignSelf:'flex-end',position:'absolute',}}>
                    <View style={styles.contaienrBox}>
                      <Text
                        style={[
                          styles.text,
                          { fontSize: 15, paddingLeft: 20, fontWeight: 900 },
                        ]}
                      >
                        Hello {data?.name}
                      </Text>
                      <Image
                        source={require("../assets/icons/user-icon.png")}
                        style={{ width: 80, height: 80 }}
                      />
                    </View>
                 
                      <TouchableOpacity style={{position:'absolute',bottom:20,left:'30%'}} onPress={()=>navi.navigate('register')}>
                        <Text style={{backgroundColor:'red',color:'white',width:100,textAlign:'center',borderRadius:5,paddingVertical:5,fontSize:20,fontWeight:900}}>Logout</Text>
                      </TouchableOpacity>

              </View>
          </Modal>

          {/* clouds with celsius */}
          <View style={{ alignItems: "center" }}>
              <Image
                source={Colors[`${data?.weatherData?.current?.text}`]?.Image}
                style={{ width: width - 240, height: height - 720, top: 20 }}
              />

            <View style={{ alignItems: "center", marginVertical: 25 }}>
              <Text
                style={[styles.textColor, { fontSize: 35, fontWeight: 900 }]}
              >
                {`${data?.weatherData?.current?.temp_c}`} <Text>°C</Text>
              </Text>
              <Text
                style={styles.textColor}
              >{`${data?.weatherData?.current?.text}`}</Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.category,
            styles.boxShadow,
          ]}
        >
          <View style={styles.center}>
            <Text style={{ color: "gray", paddingVertical: 10 }}>
              Wind Speed
            </Text>
            <Text
              style={{ color: "#041466" }}
            >{`${data?.weatherData?.current?.wind_kph} kph`}</Text>
          </View>
          <View style={styles.center}>
            <Text style={{ color: "gray", paddingVertical: 10 }}>Humidity</Text>
            <Text style={{ color: "#041466" }}>{data?.weatherData?.current?.humidity}%</Text>
          </View>
          <View style={styles.center}>
            <Text style={{ color: "gray", paddingVertical: 10 }}>Pressure</Text>
            <Text
              style={{ color: "#041466" }}
            >{`${data?.weatherData?.current?.pressure_in}`}</Text>
          </View>
        </View>

        <View style={{ width: width - 20, height: height }}>
          <View style={{ marginVertical: 10 }}>
            <Text
              style={[styles.textColor, { fontSize: 20, textAlign: "center" }]}
            >
              Temperature{" "}
              <Text
                style={{
                  color: "orange",
                }}
              >
                Analyses
              </Text>
            </Text>
          </View>
          <View
            style={[
              { flexDirection: "row",justifyContent:'space-around', marginVertical: 20, },
            ]}
          >
            <TouchableOpacity
              style={styles.boxShadow}
              onPress={() => setTemp({ today: true,month:false, week: false })}
            >
              <Text style={[(temp.today && styles.TO) || styles.textColor]}>
                Today
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.boxShadow}
              onPress={() => setTemp({ today: false,month:false, week: true })}
            >
              <Text style={(temp.week && styles.TO) || styles.textColor}>
                Weekly
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.boxShadow}
              onPress={() => setTemp({ today: false, week: false, month:true })}
            >
              <Text style={(temp.month && styles.TO) || styles.textColor}>
                Month
              </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={styles.boxShadow}
              onPress={() => navi.navigate("chart")}
            >
              <Text style={{color:'blue'}}>
                View Chart
              </Text>
            </TouchableOpacity> */}
          </View>

          {/* today & weekly section */}

          {temp.today && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {data?.weatherData?.currentDay?.hour?.map((item, i) => {
                return (
                  <Card
                    key={i}
                    sedData={item}
                    style={
                      styles.boxShadow
                    }
                  />
                );
              })}
            </ScrollView>
          )}
          {temp.week && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {data?.weatherData?.week?.map((item, index) => {
                return (
                  <Card
                    key={index}
                    sedData={item}
                    style={
                      styles.boxShadow
                    }
                    boo={temp.week}
                    position={index}
                  />
                );
              })}
            </ScrollView>
          )}
          {temp.month && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {data?.weatherData?.month?.map((item, index) => {
                return (
                  <Card
                    key={index}
                    sedData={item}
                    style={
                      styles.boxShadow
                    }
                    boo={temp.week}
                    position={index}
                  />
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
    </View>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width - 50,
    borderRadius: 10,
    
  },
  location: {
    alignItems: "center",
    padding: 10,
  },
  textColor: { color: "#041466" },
  category: {
    width: Dimensions.get("window").width - 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginVertical: 15,
  },
  center: {
    alignItems: "center",
  },
  boxShadow: {
    backgroundColor: "rgba(254, 254, 255,1)",
    padding: 10,
    shadowColor: "gray",
    elevation: 10,
    borderRadius: 10,
  },
  TO: {
    color: "red",
  },
  contaienrBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#999999",
    elevation: 40,
  },
  text: {
    color: "#041466",
  },
});
