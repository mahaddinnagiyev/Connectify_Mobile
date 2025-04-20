import { View, Text, ScrollView, Pressable, Dimensions } from "react-native";
import React from "react";
import { styles } from "./styles/profile-header";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { setActiveIndex } from "@redux/profile/myProfileSlice";

const menuItems = ["My Profile", "My Friends", "Friend Requests", "Block List"];

const { width: screenWidth } = Dimensions.get("window");

const ProfileHeader = () => {
  const activeIndex = useSelector(
    (state: RootState) => state.myProfile.activeIndex
  );
  const dispatch = useDispatch();

  const scrollViewRef = React.createRef<ScrollView>();
  const itemWidths = React.useRef<number[]>([]);
  const currentScrollOffset = React.useRef(0);

  const handleScrollToIndex = (index: number) => {
    let totalOffset = 0;
    for (let i = 0; i < index; i++) {
      totalOffset += itemWidths.current[i] || 0;
    }

    scrollViewRef.current?.scrollTo({
      x: totalOffset,
      animated: true,
    });
  };

  const handleScrollLeft = () => {
    const newOffset = Math.max(
      currentScrollOffset.current - screenWidth / 2,
      0
    );
    scrollViewRef.current?.scrollTo({ x: newOffset, animated: true });
  };

  const handleScrollRight = () => {
    const newOffset = currentScrollOffset.current + screenWidth / 2;
    scrollViewRef.current?.scrollTo({ x: newOffset, animated: true });
  };

  return (
    <View style={styles.headerMenuContainer}>
      <MaterialIcons
        name="chevron-left"
        size={25}
        color="black"
        style={{ position: "absolute", left: 0 }}
        onPress={handleScrollLeft}
      />
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {menuItems.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => {
              dispatch(setActiveIndex(index));
              handleScrollToIndex(index);
            }}
            style={styles.menuItemWrapper}
            onLayout={(e) =>
              (itemWidths.current[index] = e.nativeEvent.layout.width)
            }
          >
            <Text
              style={[
                styles.menuText,
                activeIndex === index && styles.activeMenuText,
              ]}
            >
              {item.toUpperCase()}
            </Text>
            {activeIndex === index && <View style={styles.activeLine} />}
          </Pressable>
        ))}
      </ScrollView>
      <MaterialIcons
        name="chevron-right"
        size={25}
        color="black"
        style={{ position: "absolute", right: 5 }}
        onPress={handleScrollRight}
      />
    </View>
  );
};

export default ProfileHeader;
