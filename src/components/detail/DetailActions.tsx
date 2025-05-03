import { Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { styles } from "./styles/detailActions.style";
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";

const DetailActions = () => {
  const [isFriendRequestSent] = useState(true);

  return (
    <>
      {/* Friend Request Hissəsi */}
      {isFriendRequestSent && (
        <View style={styles.friendRequestBox}>
          <Text style={styles.requestTitle}>Friend Request Sent</Text>
          <View style={styles.requestButtonRow}>
            <TouchableOpacity style={[styles.requestButton, styles.accept]}>
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.requestButton, styles.decline]}>
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Action Düymələri */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={[styles.actionButton, styles.borderBottom]}>
          <MaterialIcons name="person-outline" size={22} color="#00ff00" />
          <Text style={styles.actionText}>See Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.borderBottom]}>
          <Feather name="edit-2" size={22} color="#00ff00" />
          <Text style={styles.actionText}>Change Room Name</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.borderBottom]}>
          <MaterialIcons name="block" size={22} color="#ff4444" />
          <Text style={[styles.actionText, { color: "#ff4444" }]}>Block</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name="user-plus" size={22} color="#00ff00" />
          <Text style={styles.actionText}>Add Friend</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default DetailActions;
