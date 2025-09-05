import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { COLORS } from "./theme";
import { ICONS } from "./config";
import { Message } from "./types";
import { useUploadStore } from "./store/uploadStore";

interface MessageBubbleProps {
  msg: Message;
  onImagePick?: () => void;
  onQuickReply?: (reply: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ msg, onImagePick, onQuickReply }) => {
  const { showUploadScreen, selectedImages } = useUploadStore();

  return (
    <View style={{ marginBottom: 15 }}>
      <View
        style={{
          alignSelf: msg.type === "sent" ? "flex-end" : "flex-start",
          backgroundColor: msg.type === "sent" ? COLORS.primary : COLORS.secondary,
          borderRadius: 12,
          padding: 12,
          maxWidth: "80%",
        }}
      >
        <Text
          style={{
            color: msg.type === "sent" ? COLORS.textLight : COLORS.textDark,
            fontFamily: "Poppins-Regular",
            fontSize: 15,
            lineHeight: 20,
          }}
        >
          {msg.text}
        </Text>

        {msg.quickReplies && (
          <View style={{ flexDirection: "row", marginTop: 8, justifyContent: "flex-end" }}>
            {msg.quickReplies.map((reply, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.textDark,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  marginLeft: 8,
                }}
                onPress={() => onQuickReply && onQuickReply(reply)}
              >
                <Text style={{ fontFamily: "Poppins-Regular", fontSize: 14, color: COLORS.textDark }}>
                  {reply}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {msg.imagePicker && (
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            padding: 12,
            borderRadius: 12,
            alignSelf: "flex-end",
            flexDirection: "row",
            alignItems: "center",
            marginTop: 8,
          }}
          onPress={showUploadScreen}
        >
          <Image
            source={ICONS.upload}
            style={{ 
              width: 20, 
              height: 20, 
              tintColor: COLORS.textLight,
              marginRight: 8 
            }}
            resizeMode="contain"
          />
          <Text
            style={{
              fontFamily: "Poppins-Regular",
              fontSize: 16,
              color: COLORS.textLight,
            }}
          >
            Upload Images/Files
          </Text>
        </TouchableOpacity>
      )}

      {selectedImages.length > 0 && msg.imagePicker && (
        <View style={{ 
          flexDirection: 'row', 
          flexWrap: 'wrap', 
          marginTop: 10,
          alignSelf: 'flex-end',
          maxWidth: '80%',
        }}>
          {selectedImages.map((imageUri, index) => (
            <Image
              key={index}
              source={{ uri: imageUri }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 10,
                marginLeft: 8,
                marginBottom: 8,
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default MessageBubble;
