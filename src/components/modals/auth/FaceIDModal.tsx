import React, { useRef, useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { styles } from "./style/faceIdModal.style";

interface FaceIDModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  type: "login" | "register";
}

const FaceIDModal: React.FC<FaceIDModalProps> = ({
  visible,
  onClose,
  onSuccess,
  type,
}) => {
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <Modal visible transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.permissionOverlay}>
          <View style={styles.permissionBox}>
            <Text style={styles.permissionTitle}>Camera Permission</Text>
            <Text style={styles.permissionText}>
              We need permission to access the camera on your device.
            </Text>
            <View style={styles.permissionActions}>
              <TouchableOpacity
                style={[styles.button, styles.cancel]}
                onPress={onClose}
              >
                <Text style={styles.cancelText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.login]}
                onPress={requestPermission}
              >
                <Text style={styles.loginText}>Grant</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Face ID Authentication</Text>
          <Text style={styles.subtitle}>
            Position your face within the frame and wait until detect your face
          </Text>
          <View style={styles.scannerContainer}>
            <CameraView facing={facing} style={styles.cameraFill} />
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.button, styles.cancel]}
            >
              <Text style={styles.cancelText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSuccess}
              style={[styles.button, styles.login]}
            >
              <Text style={styles.loginText}>
                {type === "login" ? "Login" : "Register"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FaceIDModal;
