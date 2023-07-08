import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";


const SearchScreen = ({ route }) => {
  const [oldState, setOldState] = useState([]);
  const [states, setState] = useState([]);
  const [inp, setInp] = useState("");
  const [loading, setLoading] = useState(true);
  
  const navi = useNavigation();
 

  // search function
  const searchHandler = () => {
    if (inp != "") {
      navi.navigate("home", {location:inp});
    }
    // playSound();
  };

  const st = async () => {
    await fetch(`https://shivammathur.com/countrycity/cities/India`)
      .then((res) => res.json())
      .then((res) => {
        setOldState(res);
        setLoading(false)
        
      });
  };

  useEffect(() => {
    setLoading(true)
    st();
  }, []);

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

  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ width: Dimensions.get("window").width - 50 }}>
       
        {/* Search box */}
        <View style={styles.inpBox}>
          <View>
            <TextInput
              style={styles.inp}
              placeholder="Enter Your City"
              onChangeText={onChangeText}
            />
            <TouchableOpacity
              onPress={searchHandler}
              style={{ position: "absolute", right: 0, top: 10 }}
            >
              <Image
                source={require("../assets/icons/search.jpg")}
                style={{ width: 26, height: 26 }}
              />
            </TouchableOpacity>
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
                  navi.navigate("home", {location:item});
                  setInp("");
                }}
              >
                <Text
                  style={[
                    styles.inpBox,
                    { borderRadius: 10, elevation: 3, paddingVertical: 15 },
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
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
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
    marginTop:10
  },
});
