import React from "react";
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { style } from "./style/header-style";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSelector, useDispatch } from "react-redux";
import { toggleModal } from "@redux/header/headerSlice";
import { RootState } from "@redux/store";
import { useNavigation, useRoute } from "@react-navigation/native";
import { color } from "@/colors";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { StackParamList } from "@navigation/Navigator";
import Alert from "../modals/error/Alert";

const Header = () => {
  const [isAlertVisible, setIsAlertVisible] = React.useState(false);
  const { isModalVisible } = useSelector((state: RootState) => state.header);
  const dispatch = useDispatch();

  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const route = useRoute();

  return (
    <>
      <View style={style.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Messenger")}>
          {route.name === "Messenger" ? (
            <MaterialIcons name="chat" size={30} color={color.primaryColor} />
          ) : (
            <MaterialIcons name="chat-bubble-outline" size={30} color="black" />
          )}
        </TouchableOpacity>
        <MaterialCommunityIcons
          name="account-group-outline"
          size={30}
          color="black"
          onPress={() => setIsAlertVisible(true)}
        />
        <TouchableOpacity onPress={() => navigation.navigate("Users")}>
          {route.name === "Users" ? (
            <MaterialIcons name="people" size={30} color={color.primaryColor} />
          ) : (
            <MaterialIcons name="people-outline" size={30} color="black" />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => dispatch(toggleModal())}>
          <Image
            source={require("@assets/images/no-profile-photo.png")}
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
            <Pressable
              style={style.menuItem}
              onPress={() => {
                dispatch(toggleModal());
                navigation.navigate("MyProfile");
              }}
            >
              <Image
                source={require("@assets/images/no-profile-photo.png")}
                style={style.menuImage}
              />
              <Text style={style.menuText}>My Profile</Text>
            </Pressable>
            <Pressable
              style={style.menuItem}
              onPress={() => {
                dispatch(toggleModal());
                navigation.navigate("Settings");
              }}
            >
              <MaterialIcons name="settings" size={24} color="black" />
              <Text style={style.menuText}>Settings</Text>
            </Pressable>
            {/* <Pressable
              style={style.menuItem}
              onPress={() => {
                dispatch(toggleModal());
                navigation.navigate("FAQ");
              }}
            >
              <FontAwesome name="question-circle" size={24} color="black" />
              <Text style={style.menuText}>FAQ</Text>
            </Pressable> */}
            <Pressable
              style={style.menuItem}
              onPress={() => {
                dispatch(toggleModal());
                navigation.navigate("ContactUs");
              }}
            >
              <MaterialIcons name="contact-phone" size={24} color="black" />
              <Text style={style.menuText}>Contact Us</Text>
            </Pressable>
            <TouchableOpacity style={style.menuItem}>
              <MaterialIcons name="logout" size={24} color="red" />
              <Text style={[style.menuText, { color: "red" }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {isAlertVisible && (
        <Alert
          title="Project in Development Phase"
          message="Groups feature is currently under development. We're working hard to bring you this functionality as soon as possible!"
          buttonText="Got It!"
          footerNote="Stay tuned for updates!"
          visible={isAlertVisible}
          iconName="construct"
          onClose={() => setIsAlertVisible(false)}
        />
      )}
    </>
  );
};

export default Header;
