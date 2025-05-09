import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  Text,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { color } from "@/colors";
import { styles } from "./styles/downloadModal.style";

const { height } = Dimensions.get("window");

const DownloadModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [downloads, setDownloads] = useState([
    { id: 1, name: "file1.pdf", progress: 75 },
    { id: 2, name: "image.jpg", progress: 30 },
  ]);

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

  return (
    <>
      <TouchableOpacity style={styles.floatingButton} onPress={toggleModal}>
        <MaterialCommunityIcons
          name="progress-download"
          size={28}
          color="white"
        />
        {downloads.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{downloads.length}</Text>
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
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={toggleModal}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.title}>Active Downloads</Text>
                <TouchableOpacity onPress={toggleModal}>
                  <MaterialIcons
                    name="close"
                    size={24}
                    color={color.textColor}
                  />
                </TouchableOpacity>
              </View>

              {downloads.map((file) => (
                <View key={file.id} style={styles.downloadItem}>
                  <MaterialIcons
                    name="insert-drive-file"
                    size={24}
                    color={color.tertiaryColor}
                  />
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName}>{file.name}</Text>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${file.progress}%` },
                        ]}
                      />
                    </View>
                  </View>
                  <Text style={styles.percentage}>{file.progress}%</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
    </>
  );
};

export default DownloadModal;
