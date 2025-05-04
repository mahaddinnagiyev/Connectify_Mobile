import {
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { color } from "@/colors";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles/detailMedia.style";
import { Video, ResizeMode } from "expo-av";

// Hooks
import { useChatData } from "@hooks/useChatData";

// Services
import { Chat, MessageType } from "@services/messenger/messenger.dto";

interface Props {
  chat: Chat;
}

const DetailMedia: React.FC<Props> = ({ chat }) => {
  const [activeTab, setActiveTab] = useState<"images" | "videos" | "files">(
    "images"
  );
  const [filteredMedias, setFilteredMedias] = useState<any[]>([]);

  const { medias, isMediasLoading, fetchMedias } = useChatData();

  useEffect(() => {
    const loadMedias = async () => {
      await fetchMedias(chat.id);
    };
    loadMedias();
  }, [chat.id]);

  useEffect(() => {
    const filtered = medias.filter((media) => {
      switch (activeTab) {
        case "images":
          return media.message_type === MessageType.IMAGE;
        case "videos":
          return media.message_type === MessageType.VIDEO;
        case "files":
          return media.message_type === MessageType.FILE;
        default:
          return false;
      }
    });
    setFilteredMedias(filtered);
  }, [activeTab, medias]);

  return (
    <>
      {/* Media Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === "images" && styles.activeTab]}
          onPress={() => setActiveTab("images")}
        >
          <Text style={styles.tabText}>Images</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === "videos" && styles.activeTab]}
          onPress={() => setActiveTab("videos")}
        >
          <Text style={styles.tabText}>Videos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === "files" && styles.activeTab]}
          onPress={() => setActiveTab("files")}
        >
          <Text style={styles.tabText}>Files</Text>
        </TouchableOpacity>
      </View>

      {/* Media Grid */}
      <View style={styles.mediaContainer}>
        {isMediasLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={color.primaryColor} />
          </View>
        ) : filteredMedias.length === 0 ? (
          <Text style={styles.noMediaText}>No {activeTab} found</Text>
        ) : activeTab === "files" ? (
          <View style={styles.fileList}>
            {filteredMedias.map((file) => (
              <TouchableOpacity key={file.id} style={styles.fileItem}>
                <Ionicons
                  name="document-outline"
                  size={24}
                  color={color.primaryColor}
                />
                <Text style={styles.fileName}>
                  {file.message_name ?? "Imported File"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.mediaGrid}>
            {filteredMedias.map((item) => (
              <TouchableOpacity key={item.id} style={styles.gridItem}>
                {activeTab === "images" ? (
                  <Image
                    source={{ uri: item.content }}
                    style={styles.mediaThumbnail}
                  />
                ) : (
                  <View style={styles.videoContainer}>
                    <Video
                      source={{ uri: item.content }}
                      style={styles.mediaThumbnail}
                      resizeMode={ResizeMode.COVER}
                      shouldPlay={false}
                      isMuted={true}
                      useNativeControls={false}
                    />
                    <Ionicons
                      name="play-circle"
                      size={32}
                      color="white"
                      style={styles.playIcon}
                    />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </>
  );
};

export default DetailMedia;
