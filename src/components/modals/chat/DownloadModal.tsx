import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  Text,
  ActivityIndicator,
  Platform,
} from "react-native";
import { color } from "@/colors";
import { styles } from "./styles/downloadModal.style";

// Expo
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@redux/store";
import {
  removeDownloadMessage,
  clearDownloadMessages,
} from "@redux/chat/chatSlice";
import {
  setErrorMessage,
  setSuccessMessage,
} from "@redux/messages/messageSlice";

// Services
import type { MessagesDTO } from "@services/messenger/messenger.dto";

// Functions
import { truncate } from "@functions/messages.function";

const { height } = Dimensions.get("window");

const DownloadModal = () => {
  const dispatch = useDispatch();
  const downloadMessages = useSelector(
    (state: RootState) => state.chat.downloadMessages as MessagesDTO[]
  );

  const [isVisible, setIsVisible] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const modalPosition = useRef(new Animated.Value(height)).current;

  const toggleModal = () => {
    if (isVisible) {
      Animated.timing(modalPosition, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsVisible(false));
    } else {
      setIsVisible(true);
      Animated.timing(modalPosition, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const save = async (
    uri: string,
    fileName: string,
    mimeType: string,
    id: string
  ) => {
    if (Platform.OS === "android") {
      const permission =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (!permission.granted) {
        dispatch(setErrorMessage("File permission is required."));
        setCurrentId(null);
        return;
      }

      try {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const newFileUri =
          await FileSystem.StorageAccessFramework.createFileAsync(
            permission.directoryUri,
            fileName,
            mimeType
          );

        await FileSystem.writeAsStringAsync(newFileUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        dispatch(setSuccessMessage(`“${fileName}” has been saved.`));
      } catch (error: any) {
        dispatch(setErrorMessage(error.message));
      } finally {
        setCurrentId(null);
        dispatch(removeDownloadMessage(id));
      }
    }
  };

  useEffect(() => {
    const downloadNext = async () => {
      if (currentId || downloadMessages.length === 0) return;

      const next = downloadMessages[0];
      setCurrentId(next.id);
      const fileName = next.message_name ?? next.id;

      const result = await FileSystem.downloadAsync(
        next.content,
        FileSystem.documentDirectory + fileName
      );

      if (result.status !== 200) {
        dispatch(setErrorMessage(`Failed to download ${fileName}`));
        dispatch(removeDownloadMessage(next.id));
        return;
      }

      save(result.uri, fileName, result.headers["content-type"], next.id);
    };

    downloadNext();
  }, [downloadMessages, currentId, dispatch]);

  const getIcon = (type?: string) => {
    switch (type) {
      case "image":
        return (
          <MaterialIcons name="image" size={24} color={color.primaryColor} />
        );
      case "video":
        return (
          <MaterialCommunityIcons
            name="video"
            size={24}
            color={color.primaryColor}
          />
        );
      default:
        return (
          <MaterialIcons
            name="insert-drive-file"
            size={24}
            color={color.primaryColor}
          />
        );
    }
  };

  return (
    <React.Fragment>
      <TouchableOpacity style={styles.floatingButton} onPress={toggleModal}>
        <MaterialCommunityIcons
          name="progress-download"
          size={28}
          color="white"
        />
        {downloadMessages.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{downloadMessages.length}</Text>
          </View>
        )}
      </TouchableOpacity>

      {isVisible && (
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: modalPosition }] },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.title}>Downloads Queue</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                onPress={() => dispatch(clearDownloadMessages())}
              >
                <Text style={styles.removeAllText}>Remove All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleModal}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color={color.textColor} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.listContainer}>
            {downloadMessages.map((msg) => (
              <View key={msg.id} style={styles.card}>
                <View style={styles.iconWrapper}>
                  {getIcon(msg.message_type)}
                </View>
                <Text style={styles.filename}>
                  {truncate(msg.message_name, 28) || truncate(msg.id, 28)}
                </Text>
                <View style={styles.actionWrapper}>
                  {currentId === msg.id ? (
                    <ActivityIndicator
                      size="small"
                      color={color.primaryColor}
                    />
                  ) : (
                    <TouchableOpacity
                      onPress={() => dispatch(removeDownloadMessage(msg.id))}
                    >
                      <MaterialIcons name="cancel" size={24} color="red" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        </Animated.View>
      )}
    </React.Fragment>
  );
};

export default DownloadModal;
