import {
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import { color } from "@/colors";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles/detailMedia.style";
import { Video, ResizeMode } from "expo-av";
import Modal from "react-native-modal";
import ImageViewer from "react-native-image-zoom-viewer";

// Hooks
import { useChatData } from "@hooks/useChatData";

// Services
import {
  Chat,
  MessagesDTO,
  MessageType,
} from "@services/messenger/messenger.dto";
import CustomVideoPlayer from "../modals/chat/CustomVideoPlayer";

interface Props {
  chat: Chat;
}

const DetailMedia: React.FC<Props> = ({ chat }) => {
  const [activeTab, setActiveTab] = useState<"images" | "videos" | "files">(
    "images"
  );
  const { medias, isMediasLoading, fetchMedias } = useChatData();

  const [filteredMedias, setFilteredMedias] = useState<MessagesDTO[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [video, setVideo] = useState<MessagesDTO | null>(null);

  const openModal = () => setModalVisible(true);
  const closeModal = () => {
    setModalVisible(false);
    setVideo(null);
  };

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
              <TouchableOpacity
                key={file.id}
                style={styles.fileItem}
                onPress={async () => {
                  await Linking.openURL(file.content!);
                }}
              >
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
            {filteredMedias.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={styles.gridItem}
                onPress={() => {
                  if (activeTab === "images") {
                    setCurrentIndex(index);
                    setIsModalVisible(true);
                  }
                  if (activeTab === "videos") {
                    setVideo(item);
                    openModal();
                  }
                }}
              >
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
                      color={color.white}
                      style={styles.playIcon}
                    />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <Modal
        isVisible={isModalVisible}
        style={styles.modal}
        onBackdropPress={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ImageViewer
            imageUrls={filteredMedias.map((media) => ({ url: media.content }))}
            index={currentIndex}
            onChange={(index) => setCurrentIndex(index ?? 0)}
            enableSwipeDown
            onSwipeDown={() => setIsModalVisible(false)}
            renderHeader={() => (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={color.white} />
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      <Modal
        isVisible={modalVisible}
        onBackdropPress={closeModal}
        onBackButtonPress={closeModal}
        propagateSwipe={true}
        swipeDirection={["down"]}
        onSwipeComplete={closeModal}
        animationIn="fadeIn"
        animationOut="fadeOut"
        useNativeDriver
        style={styles.modal}
      >
        {video && (
          <CustomVideoPlayer
            uri={video.content}
            autoPlay={modalVisible}
            onClose={closeModal}
          />
        )}
      </Modal>
    </>
  );
};

export default DetailMedia;
