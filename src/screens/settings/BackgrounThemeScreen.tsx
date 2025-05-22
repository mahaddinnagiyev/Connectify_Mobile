import React, { useMemo, useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import { color } from "@/colors";
import { backgroundThemes } from "@/themes";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

// Functions
import {
  getThemeKeyFromStorage,
  setThemeKeyToStorage,
} from "@functions/storage.function";

// Navigation
import { useNavigation } from "@react-navigation/native";
import type { StackParamList } from "@navigation/UserStack";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 2;
const ITEM_SPACING = 16;
const ITEM_SIZE = (width - ITEM_SPACING * (COLUMN_COUNT + 1)) / COLUMN_COUNT;

type ThemeGroup = {
  key: string;
  images: { src: any; themeKey: string }[];
};

const BackgroundThemeScreen: React.FC = () => {
  const { goBack } = useNavigation<NativeStackNavigationProp<StackParamList>>();
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
    setSelectedKey(themeKey);

    await setThemeKeyToStorage(themeKey);
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
        <Text style={styles.title}>Settings</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.background, marginTop: 28 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 60,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ececec",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  headerButtonText: {
    fontSize: 16,
    fontWeight: 800,
    color: color.primaryColor,
    backgroundColor: color.inputBgColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: color.primaryColor,
  },
  listContent: { padding: ITEM_SPACING },
  groupContainer: { marginBottom: ITEM_SPACING * 2 },
  groupHeader: { padding: 8, borderRadius: 8, marginBottom: 12 },
  groupHeaderText: { fontSize: 16, fontWeight: "600", color: "#fff" },
  imageWrapper: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 12,
    overflow: "hidden",
  },
  imageBg: { flex: 1, justifyContent: "flex-end" },
  captionGradient: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  captionText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  activeBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  activeText: { color: "#fff", fontSize: 10, marginLeft: 4 },
});
