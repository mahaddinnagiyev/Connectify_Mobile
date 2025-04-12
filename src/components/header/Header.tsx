import React from "react";
import { View, Text, Image, Modal, TouchableOpacity } from "react-native";
import { style } from "./style/header-style";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSelector, useDispatch } from "react-redux";
import { toggleModal } from "@/src/redux/header/headerSlice";
import { RootState } from "@/src/redux/store";
import { useNavigation, useRoute } from "@react-navigation/native";
import { color } from "@/colors";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { StackParamList } from "@navigation/Navigator";

const Header = () => {
  const { isModalVisible } = useSelector((state: RootState) => state.header);
  const dispatch = useDispatch();

  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const route = useRoute();

  return (
    <>
      <View style={style.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Messenger")}>
          {route.name === "Messenger" ? (
            <MaterialIcons
              name="messenger"
              size={30}
              color={color.primaryColor}
            />
          ) : (
            <MaterialIcons name="messenger-outline" size={30} color="black" />
          )}
        </TouchableOpacity>
        <MaterialCommunityIcons
          name="account-group-outline"
          size={30}
          color="black"
          onPress={() => alert("Project in development phase")}
        />
        <Feather name="users" size={30} color="black" />
        <TouchableOpacity onPress={() => dispatch(toggleModal())}>
          <Image
            source={require("../../../assets/images/no-profile-photo.png")}
            style={style.profileIcon}
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => dispatch(toggleModal())}
      >
        <TouchableOpacity
          style={style.modalOverlay}
          activeOpacity={1}
          onPress={() => dispatch(toggleModal())}
        >
          <View style={style.modalContent}>
            <TouchableOpacity style={style.menuItem}>
              <Image
                source={require("../../../assets/images/no-profile-photo.png")}
                style={style.menuImage}
              />
              <Text style={style.menuText}>My Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.menuItem}>
              <MaterialIcons name="settings" size={24} color="black" />
              <Text style={style.menuText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.menuItem}>
              <FontAwesome name="question-circle" size={24} color="black" />
              <Text style={style.menuText}>FAQ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.menuItem}>
              <MaterialIcons name="contact-phone" size={24} color="black" />
              <Text style={style.menuText}>Contact Us</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.menuItem}>
              <MaterialIcons name="logout" size={24} color="red" />
              <Text style={[style.menuText, { color: "red" }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default Header;
