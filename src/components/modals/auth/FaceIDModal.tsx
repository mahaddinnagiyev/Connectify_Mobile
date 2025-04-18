import React, { useRef, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Button,
  Dimensions,
  Pressable,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import {
  setErrorMessage,
  setSuccessMessage,
} from "@redux/messages/messageSlice";
import { faceIdLogin } from "@services/auth/auth.service";
import { setFaceIdLoginForm } from "@redux/auth/authSlice";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import { color } from "@/colors";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

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
  const dispatch = useDispatch();
  const { faceIdLoginForm } = useSelector((state: RootState) => state.auth);
  const { errorMessage } = useSelector((state: RootState) => state.messages);

  const [facing, setFacing] = React.useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [isLoading, setIsLoading] = React.useState(false);

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

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      let response;

      if (type === "login") {
        response = await faceIdLogin(faceIdLoginForm);

        if (response.success) {
          dispatch(setSuccessMessage(response.message ?? "Login successful"));
          dispatch(
            setFaceIdLoginForm({
              username_or_email_face_id: null,
              face_descriptor: [],
            })
          );
        } else {
          dispatch(
            setErrorMessage(
              response.response?.message ??
                response.response?.error ??
                response.message ??
                response.error ??
                "Invalid Credentials"
            )
          );
        }
      }
    } catch (error) {
      dispatch(
        setErrorMessage((error as Error).message) ??
          "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

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
            Position your face within the frame
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
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FaceIDModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: screenWidth * 0.9,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 8, color: "#333" },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  scannerContainer: {
    width: screenWidth * 0.75,
    height: screenWidth * 0.75,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: color.primaryColor,
    overflow: "hidden",
    marginBottom: 24,
  },
  cameraFill: { ...StyleSheet.absoluteFillObject },
  flipContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  flipButton: {
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 8,
    borderRadius: 5,
  },
  flipText: { color: "#fff", fontWeight: "600" },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  cancel: { backgroundColor: "#F5F5F5" },
  login: { backgroundColor: color.primaryColor },
  cancelText: { color: "#333", fontWeight: "600" },
  loginText: { color: "#fff", fontWeight: "600" },
  errorText: { marginTop: 12, color: "red" },
  // Permission modal styles
  permissionOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  permissionBox: {
    width: screenWidth * 0.8,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  permissionText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  permissionActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
