import { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";


export const formatRelativeTime = (isoDate: string) => {
  const updated = new Date(isoDate).getTime();
  const now = Date.now();
  const diff = Math.floor((now - updated) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

  return new Date(isoDate).toLocaleDateString();
};


export const useDebounce = <T>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}


export const pickThumbnail = async () => {
  const permission =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [16, 9],
    quality: 0.9,
  });

  if (result.canceled) return null;
  const uri = result.assets[0].uri;
  return (uri)


};




// To Convert the uri to ArrayBuffer for th convex action 
export async function uriToArrayBuffer(uri: string): Promise<ArrayBuffer> {
    const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64",
    });

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    return bytes.buffer; // this is what Convex expects
}

// For the Imgage Type like png,jpeg,webp
export function getContentType(uri: string) {
    if (uri.endsWith(".jpg") || uri.endsWith(".jpeg")) return "image/jpeg";
    if (uri.endsWith(".webp")) return "image/webp";
    return "image/png";
}
