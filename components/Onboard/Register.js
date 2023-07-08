import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} 
from "react-native";
import React, {useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";

const Register = ({navigation}) => {
  const [regData, setRegData] = useState({name:'',email:'',pass:'',confPass:'',location:''});
  const [logData, setLogData] = useState({email:'',pass:''});
  const [msg,setMsg] = useState({emailmsg:'',passmsg:'',namemsg:'',successmsg:'',timemsg:''} );
  const [page, setPage] = useState({reg: true,log: false, title: "REGISTER",btn:false,selectLocat:false});
  const [oldState, setOldState] = useState([]);
  const [states, setState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inp, setInp] = useState("");




// regex 
const regexName = /^[a-zA-Z]{3,}$/;
const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.([a-zA-Z0-9-]+)*$/
const regexPass  = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/


// api send req
  const regApi = async()=>{
    setLoading(true);
    const requestOptions = {
      method :'POST',
      headers:{"Content-type":"application/json"},
      body:JSON.stringify(regData),
      redirect:'follow'
    }
    if(regexName.test(regData.name) && regexEmail.test(regData.email) && regexPass.test(regData.pass) && regData.pass === regData.confPass){
      await fetch('http://192.168.1.28:27027/register',requestOptions)
      .then((res)=>res.json())
      .then((res)=>{
      console.log('result',res)
      setLoading(false);
      setRegData({name:'',email:'',pass:'',confPass:''})
      if(res){
        navigation.navigate('home',{result:res})
      }
      else{
        ToastAndroid.show("already have a account",ToastAndroid.SHORT);
        console.log('already')
      }

    })

  }
  setPage({...page,btn:false})
}


// api get method
  const logApi = async () => {
    setLoading(true);
    if(regexEmail.test(logData.email) && regexPass.test(logData.pass)){
    const requestOptions = {
      method :'POST',
      headers:{"Content-type":"application/json"},
      body:JSON.stringify(logData),
      redirect:'follow'
    }
      await fetch('http://192.168.1.28:27027/login',requestOptions)
        .then((res) => res.json())
        .then((res) => {
          setPage({...page})
          setLoading(false);
          console.log(res.result)
          setLogData({email:'',pass:''})
          if(res){
            navigation.navigate('home',{result:res})  
          }else{
            ToastAndroid.show("enter correct detail",ToastAndroid.SHORT);
            console.log('enter correct detail')
          }
        })
        .catch((err)=>console.log(err))
      }
      setPage({...page,btn:false})
  };

// login click functio



// select location
const st = async () => {
  await fetch(`https://shivammathur.com/countrycity/cities/India`)
    .then((res) => res.json())
    .then((res) => {
      setState(res);
      setOldState(res);
      setLoading(false)
      
    });
};

//search filter
const onChangeText = (e) => {
  setInp(e);
  if (e == "") {
    setState(oldState);
  } else {
    let temp = oldState.filter((item) => {
      return item.toLowerCase().indexOf(e.toLowerCase()) > -1;
    });
    setState(temp);
  }


};

useEffect(() => {
  setLoading(true)
  st();
}, []);



  return (
    <View>

      {/* loading screen */}
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
        <Image source={require('../../assets/icons/loading2.gif')}  style={{width:300,height:300}} />

      </View>
       }
      
      
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'}/>
      <ImageBackground style={[StyleSheet.absoluteFillObject,{width:"100%",height:Dimensions.get('window').height}]} source={require('../../assets/bg1.jpeg')} />

      <View style={[styles.top,]}>
        <View style={{ height: "20%",justifyContent:'flex-end',bottom:10 }}>
          <Text
            style={styles.title}>
            {page.title}
          </Text>
        </View>


          <View style={{ alignItems: "center" }}>
            <View style={[styles.card, { gap: 10 }]}>
            <Text style={{color:'red'}}>{page.msg}</Text>
              {page.reg && (
                <View>
                  <View style={styles.inputField}>
                  <TextInput
                    style={styles.input}
                    value={regData.name}
                    onChangeText={(e) => {setRegData({ ...regData, name: e.toLowerCase() }),setPage({...page,btn:true})}}
                    placeholder="Enter Your Name"
                  />
                </View>
                  {
                    (!regexName.test(regData.name) || msg.namemsg != '') && 
                    <Text style={{color:'red'}}>{msg?.namemsg || '* invalid name minimum 3 charactor above' }</Text>
                  }
                </View>

              )}

              {page.reg && (
                <View>
                  <View style={styles.inputField}>
                  <TextInput
                    style={styles.input}
                    value={regData.email}
                    onChangeText={(e) => {setRegData({ ...regData, email: e.toLowerCase() }),setPage({...page,btn:true})}}
                    placeholder="Enter Your Email-Id"
                  />
                </View>
                {
                    (!regexEmail.test(regData.email) || msg.emailmsg != '') &&
                    <Text style={{color:'red'}}>{`${msg?.emailmsg}` || `* Please enter correct email`}</Text>
                  
                  }
                </View>
              )}

              {page.log && (
                <View>
                  <View style={styles.inputField}>
                  <TextInput
                    style={styles.input}
                    value={logData.email}
                    onChangeText={(e) => {setLogData({ ...logData, email: e.toLowerCase() }),setPage({...page,btn:true})}}
                    placeholder="Enter Your Email-Id"
                  />
                </View>
                  {
                    (msg.emailmsg != '' || !regexEmail.test(logData.email)) &&
                    <Text style={{color:'red'}}>{`${msg?.emailmsg}` || `* Please enter correct email`}</Text>
                  
                  }
                </View>
              )}

              {page.reg && (
                <View>
                  <View style={styles.inputField}>
                  <TextInput
                    style={styles.input}
                    value={regData.pass}
                    secureTextEntry
                    onChangeText={(e) => {setRegData({ ...regData, pass: e }),setPage({...page,btn:true})}}
                    placeholder="Enter Your Password"
                  />
                </View>
                  {
                   (!regexPass.test(regData.pass) || msg.passmsg != "" ) &&
                    <Text style={{color:'red'}}>{msg?.passmsg || '* minimum 6 charactor password'}</Text>
                  }                
            </View>
              )}
              {page.log && (
                <View>
                  <View style={styles.inputField}>
                  <TextInput
                    style={styles.input}
                    value={logData.pass}
                    secureTextEntry
                    onChangeText={(e) => {setLogData({ ...logData, pass: e }),setPage({...page,btn:true})}}
                    placeholder="Enter Your Password"
                  />
                </View>
                { 
                   ( msg.passmsg != "" || !regexPass.test(logData.pass)) &&
                   <Text style={{color:'red'}}>{msg?.passmsg || '* Invalid password'}</Text>
                }
                </View>
              )}



              {page.reg && (
                <View>
                <View style={styles.inputField}>
                  <TextInput
                    style={styles.input}
                    value={regData.confPass}
                    secureTextEntry
                    onChangeText={(e) =>
                     { setRegData({ ...regData, confPass: e }),
                     setPage({...page,btn:true})}
                    }
                    placeholder="Enter Confirm Password"
                  />
                </View>
                  {
                  (regData.confPass !== regData.pass ) &&
                  <Text style={{color:'red'}}>{msg?.passmsg || '* Not match your password'}</Text>
                  }
                </View>

              )}
               {page.reg &&
                  <View style={styles.inputField}>
                    <TouchableOpacity style={styles.input} onPress={()=>setPage({...page,selectLocat:true})}>
                    <TextInput editable={false} style={{color:'black'}} value={regData.location} placeholder="select your city"/>
                    </TouchableOpacity>
                  </View>
                }
                {/* location modal  */}

                <Modal visible={page.selectLocat} animationType="fade">
                <View style={{ alignItems: "center" }}>
                  <View style={{ width: Dimensions.get("window").width - 50 }}>
                    {/* Header View */}
                    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',height:100}} >
                      <TouchableOpacity onPress={()=>setPage({...page,selectLocat:false})}>
                      <Image
                        source={require("../../assets/icons/backbtn.png")}
                        style={{ width: 50, height: 50 }}
                      />
                      </TouchableOpacity>
                    {/* Search box */}
                    <View style={styles.inpBox}>
                      <View >
                        <TextInput
                          style={styles.inp}
                          placeholder="Enter Your City"
                          onChangeText={onChangeText}
                        />
                        <TouchableOpacity
                          // onPress={searchHandler}
                          style={{ position: "absolute", right: 0, top: 10 }}
                        >
                          <Image
                            source={require("../../assets/icons/search.jpg")}
                            style={{ width: 26, height: 26 }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    </View>

                    <FlatList
                      style={{ marginTop: 10 }}
                      data={states}
                      showsVerticalScrollIndicator={false}
                      keyExtractor={(item, ind) => ind}
                      renderItem={({ item }) => {
                        return (
                          <TouchableOpacity
                            style={{ marginVertical: 5 }}
                            activeOpacity={0.6}
                            onPress={() => {
                              setRegData({...regData,location:item}),
                              setPage({...page,selectLocat:false})
                            }}
                          >
                            <Text
                              style={[
                                styles.inpBox,
                                { borderRadius: 10, elevation: 3, paddingVertical: 15 ,width:'100%'},
                              ]}
                            >
                              {item}
                            </Text>
                          </TouchableOpacity>
                        );
                      }}
                    />
                  </View>
                   {/* loading screen */}
                   {loading && (
                    <View
                      style={{
                        position: "absolute",
                        // height:,
                        // width: width,
                        zIndex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        // backgroundColor: "white",
                      }}
                    >
                      <ActivityIndicator size={100} />
                    
                    </View>
                  )}
                </View>
              </Modal>


              {(page.reg && page.btn) && (
                <TouchableOpacity onPress={regApi} style={[styles.regBtn,]} activeOpacity={0.5}>
                    <Text style={{ color: "white" }}>Register</Text>       
                </TouchableOpacity>
              )}
              {(page.log && page.btn)&&(
                <TouchableOpacity  onPress={logApi} style={styles.regBtn} activeOpacity={0.5}>                
                  <Text style={{ color: "white" }}>Login</Text>
              </TouchableOpacity>
              )}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  top: 20,
                }}
              >
                
               
                {page.reg && (
                  <View style={{ flexDirection: "row" }}>
                    <Text>Already you have Register ?</Text>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() =>
                        {setPage({...page,log: true, reg: false, title: "LOGIN" ,btn:false}),
                        setMsg({namemsg:'',emailmsg:'',passmsg:'',successmsg:''})
                      }
                      }
                    >
                      <Text style={{ color: "blue" }}> Login</Text>
                    </TouchableOpacity>
                  </View>
                )}
               

                {page.log && (
                  <View style={{ flexDirection: "row" }}>
                    <Text>New User Register ?</Text>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() =>
                        {setPage({...page, log: false, reg: true, title: "REGISTER",btn:false}),
                        setMsg({namemsg:'',emailmsg:'',passmsg:'',successmsg:''},
                        )
                      }}
                    >
                      <Text style={{ color: "blue" }}> Register</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  top: {
    height: Dimensions.get("window").height,
  },
  
  
  inputField: {
    backgroundColor: "white",
    marginVertical: "2%",
    borderRadius: 50,
    shadowColor: "gray",
    elevation: 10,
  },

  input: {
    padding: 10,
    width: Dimensions.get("window").width - 150,
  },

  regBtn: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    top: 10,
  },
  title:{
    fontSize: 35,
    fontWeight: 900,
    color: "navy",
    textAlign: "center",
    textShadowColor:'gray',
    textShadowOffset:{width:3,height:3},
    textShadowRadius:4,

  },
  contaienrBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#999999",
    elevation: 40,
  },
  inp: {
    height: 50,
  },
  text: {
    color: "#041466",
  },
  inpBox: {
    position: "relative",
    backgroundColor: "white",
    paddingHorizontal: 10,
    shadowColor: "#999999",
    elevation: 30,
    borderRadius: 20,
    width:'80%'
  },
});
