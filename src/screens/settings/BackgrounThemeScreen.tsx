import React, { useMemo, useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Pressable,
} from "react-native";
import { color } from "@/colors";
import { backgroundThemes } from "@/themes";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./style/backgroundThemeScreen.style";

// Functions
import { getThemeKeyFromStorage } from "@functions/storage.function";

// Navigation
import { useNavigation } from "@react-navigation/native";
import type { StackParamList } from "@navigation/UserStack";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

const COLUMN_COUNT = 2;
const ITEM_SPACING = 16;

type ThemeGroup = {
  key: string;
  images: { src: any; themeKey: string }[];
};

const BackgroundThemeScreen: React.FC = () => {
  const { goBack, navigate } =
    useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [selectedKey, setSelectedKey] = useState<string>("default");

  useEffect(() => {
    (async () => {
      const stored = await getThemeKeyFromStorage();
      if (stored && backgroundThemes[stored as keyof typeof backgroundThemes])
        setSelectedKey(stored);
    })();
  }, []);

  const groups: ThemeGroup[] = useMemo(() => {
    const map: Record<string, any[]> = {};
    Object.entries(backgroundThemes).forEach(([key, src]) => {
      const [group] = key.includes(".") ? key.split(/\.(.+)/) : ["default"];
      map[group] = map[group] || [];
      map[group].push({ src, themeKey: key });
    });
    return Object.entries(map).map(([group, images]) => ({
      key: group,
      images,
    }));
  }, []);

  const selectTheme = async (themeKey: string) => {
    navigate("Preview", {
      theme: backgroundThemes[themeKey as keyof typeof backgroundThemes],
      themeKey: themeKey,
      setSelectedKey: setSelectedKey,
    });
  };

  const renderGroup = ({ item }: { item: ThemeGroup }) => (
    <View style={styles.groupContainer}>
      <LinearGradient
        colors={[color.gradientStart, color.gradientEnd]}
        start={[0, 0]}
        end={[1, 0]}
        style={styles.groupHeader}
      >
        <Text style={styles.groupHeaderText}>
          {item.key === "default"
            ? "Default"
            : item.key.replace(/_/g, " ").toUpperCase()}
        </Text>
      </LinearGradient>
      <FlatList
        data={item.images}
        keyExtractor={(img) => img.themeKey}
        numColumns={COLUMN_COUNT}
        scrollEnabled={false}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: ITEM_SPACING,
        }}
        renderItem={({ item: img }) => {
          const isActive = img.themeKey === selectedKey;
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.imageWrapper}
              onPress={() => selectTheme(img.themeKey)}
            >
              <ImageBackground
                source={img.src}
                style={styles.imageBg}
                imageStyle={{ borderRadius: 12 }}
              >
                {isActive && (
                  <View style={styles.activeBadge}>
                    <MaterialIcons name="check-circle" size={20} color="#fff" />
                    <Text style={styles.activeText}>Active</Text>
                  </View>
                )}
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.3)"]}
                  style={styles.captionGradient}
                >
                  <Text style={styles.captionText}>Preview</Text>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Background Themes</Text>
        <Pressable
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          onPress={goBack}
        >
          <Text style={styles.headerButtonText}>Back</Text>
        </Pressable>
      </View>
      <FlatList
        data={groups}
        keyExtractor={(grp) => grp.key}
        renderItem={renderGroup}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

export default BackgroundThemeScreen;
