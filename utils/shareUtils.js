import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";
import { Alert } from "react-native";

export const sharePet = async (pet) => {
  try {
    const shareText = `Check out this pet for adoption: ${pet?.name}\nBreed: ${pet?.breed}\nFind more on PetAdopt!`;

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(undefined, {
        dialogTitle: "Share Pet",
        mimeType: "text/plain",
        UTI: "public.plain-text",
        message: shareText,
      });
    } else {
      await Clipboard.setStringAsync(shareText);
      Alert.alert("Copied", "Pet info copied to clipboard!");
    }
  } catch (e) {
    Alert.alert("Error", "Could not share pet info.");
  }
};
