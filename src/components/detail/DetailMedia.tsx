import { Text, TouchableOpacity, View, Image } from "react-native";
import React, { useState } from "react";
import { styles } from "./styles/detailMedia.style";
import { Ionicons } from "@expo/vector-icons";

const DetailMedia = () => {
  const [activeTab, setActiveTab] = useState("media");
  const [media] = useState([
    { id: 1, type: "image", uri: "https://picsum.photos/200" },
    { id: 2, type: "video", uri: "https://picsum.photos/201" },
  ]);

  return (
    <>
      {/* Media Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === "media" && styles.activeTab]}
          onPress={() => setActiveTab("media")}
        >
          <Text style={styles.tabText}>Media</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === "videos" && styles.activeTab]}
          onPress={() => setActiveTab("videos")}
        >
          <Text style={styles.tabText}>Videolar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === "files" && styles.activeTab]}
          onPress={() => setActiveTab("files")}
        >
          <Text style={styles.tabText}>Fayllar</Text>
        </TouchableOpacity>
      </View>

      {/* Media Grid */}
      <View style={styles.mediaGrid}>
        {media.map((item) => (
          <TouchableOpacity key={item.id} style={styles.gridItem}>
            <Image source={{ uri: item.uri }} style={styles.mediaThumbnail} />
            {item.type === "video" && (
              <Ionicons
                name="play-circle"
                size={32}
                color="white"
                style={styles.playIcon}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

export default DetailMedia;
