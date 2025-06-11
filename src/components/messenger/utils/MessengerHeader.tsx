import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
  StyleProp,
  ViewStyle,
  Keyboard,
} from "react-native";
import { styles } from "../styles/messengerHeader.style";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { StackParamList } from "@navigation/Navigator";
import { color } from "@/colors";
import { MessengerFilter } from "@enums/messenger.enum";
import { useDispatch, useSelector } from "react-redux";
import { filterChats, setMenuFilter } from "@redux/messenger/messengerSlice";
import { RootState } from "@redux/store";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const MessengerHeader: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<TextInput>(null);
  const menuFilter = useSelector((s: RootState) => s.messenger.menuFilter);

  // Animasyon değerleri
  const searchAnim = useRef(new Animated.Value(0)).current;
  const headerTranslate = useRef(new Animated.Value(0)).current;
  const filterOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    dispatch(filterChats(searchQuery));
  }, [searchQuery]);

  const toggleSearch = () => {
    Animated.parallel([
      Animated.timing(searchAnim, {
        toValue: searchActive ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(headerTranslate, {
        toValue: searchActive ? 0 : 100,
        useNativeDriver: true,
      }),
      Animated.timing(filterOpacity, {
        toValue: searchActive ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (!searchActive) {
        setTimeout(() => inputRef.current?.focus(), 10);
      } else {
        Keyboard.dismiss();
        inputRef.current?.blur();
        setSearchQuery("");
      }
    });

    setSearchActive(!searchActive);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const headerStyle: Animated.WithAnimatedObject<StyleProp<ViewStyle>> = {
    opacity: headerTranslate.interpolate({
      inputRange: [0, 100],
      outputRange: [1, 0],
    }),
    transform: [
      {
        translateX: headerTranslate.interpolate({
          inputRange: [0, 100],
          outputRange: [0, -50],
        }),
      },
    ],
  };

  const searchStyle: Animated.WithAnimatedObject<StyleProp<ViewStyle>> = {
    opacity: searchAnim,
    transform: [
      {
        translateX: searchAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
    ],
  };

  const renderButton = (filter: MessengerFilter, label: string) => (
    <TouchableOpacity
      key={filter}
      onPress={() => dispatch(setMenuFilter(filter))}
      style={[
        styles.filterBtn,
        menuFilter === filter && styles.filterBtnActive,
      ]}
    >
      <Text
        style={[
          styles.filterBtnText,
          menuFilter === filter && styles.filterBtnTextActive,
        ]}
      >
        {menuFilter === filter ? `✓ ${label}` : label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.headerContainer}>
      <View style={styles.upperHeader}>
        {/* Normal Header */}
        <Animated.View style={[styles.headerContent, headerStyle]}>
          <TouchableOpacity onPress={toggleSearch} style={styles.iconBtn}>
            <Ionicons name="search" size={24} color={color.black} />
          </TouchableOpacity>
          <Text style={styles.title}>Messenger</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("MyFriends")}
            style={styles.iconBtn}
          >
            <MaterialIcons name="person-search" size={28} color={color.black} />
          </TouchableOpacity>
        </Animated.View>

        {/* Search Input */}
        <Animated.View
          style={[styles.searchWrapper, searchStyle]}
          pointerEvents={searchActive ? "auto" : "none"}
        >
          <TouchableOpacity onPress={toggleSearch} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={24} color={color.primaryColor} />
          </TouchableOpacity>
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Search chats"
            placeholderTextColor={color.emptyText}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
        </Animated.View>
      </View>

      <Animated.View
        style={[
          styles.filterBar,
          { opacity: filterOpacity, display: searchActive ? "none" : "flex" },
        ]}
      >
        {renderButton(MessengerFilter.LATEST, "Latest")}
        {renderButton(MessengerFilter.OLDEST, "Oldest")}
        {renderButton(MessengerFilter.ACTIVE_USERS, "Active")}
        {renderButton(MessengerFilter.UNREAD, "Unread")}
      </Animated.View>
    </View>
  );
};

export default MessengerHeader;
