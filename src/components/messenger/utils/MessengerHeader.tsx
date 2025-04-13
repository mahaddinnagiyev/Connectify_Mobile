import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Pressable,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { color } from "@/colors";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { StackParamList } from "@navigation/Navigator";

const screenWidth = Dimensions.get("window").width;

const MessengerHeader = () => {
  const navigate = useNavigation<NativeStackNavigationProp<StackParamList>>();

  return (
    <View style={styles.header}>
      <View style={styles.upperHeader}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 15,
            color: color.primaryColor,
          }}
        >
          Messenger
        </Text>

        <Pressable
          style={{ marginLeft: "auto" }}
          onPress={() => navigate.navigate("MyFriends")}
        >
          <MaterialIcons name="person-search" size={30} color="black" />
        </Pressable>
      </View>

      <View>
        <TextInput placeholder="Search" style={styles.searchBar} />
      </View>
    </View>
  );
};

export default MessengerHeader;

const styles = StyleSheet.create({
  header: {
    width: screenWidth,
    height: 100,
  },

  upperHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "96%",
    marginBottom: 10,
  },

  searchBar: {
    width: "94%",
    borderWidth: 1,
    borderRadius: 10,
    margin: "auto",
    paddingLeft: 10,
  },
});
