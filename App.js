import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import CircleButton from './components/CircleButton';
import IconButton from './components/IconButton';
import * as MediaLibrary from 'expo-media-library'
 import ImageViewer from './components/ImageViewer'; 
 import Button from './components/Button'; 
 import * as ImagePicker from 'expo-image-picker';
 import EmojiPicker from "./components/EmojiPicker";
 import { useState } from 'react';
 import EmojiSticker from './components/EmojiSticker';
 import EmojiList from './components/EmojiList';
 import { captureRef } from 'react-native-view-shot';
 import { GestureHandlerRootView } from "react-native-gesture-handler";
 import { useRef } from 'react';
const PlaceholderImage = require('./assets/images/background-image.png');

  export default function App() {
    const imageRef = useRef();
    const [status, requestPermission] = MediaLibrary.usePermissions();
    const [pickedEmoji, setPickedEmoji] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showAppOptions, setShowAppOptions] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const pickImageAsync = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });
      if (status === null) {
        requestPermission();
      }
      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setShowAppOptions(true);
      } else {
        alert('You did not select any image.');
      }
    };
    const onAddSticker = () => {
      setIsModalVisible(true);
    };
  
    const onModalClose = () => {
      setIsModalVisible(false);
    };
const onReset = () => {
    setShowAppOptions(false);
  };

  const onSaveImageAsync = async () => {
    try {
      const localUri = await captureRef(imageRef, {
        height: 440,
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        alert("Saved!");
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <GestureHandlerRootView style={styles.container}>
    <View style={styles.container}>
      <View style={styles.imageContainer}>
      <View ref={imageRef} collapsable={false}>
        <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage}/>
      </View>
     { pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
     </View>
      {showAppOptions ? 
        (
          <View style={styles.optionsContainer}>
            <View style={styles.optionsRow}>
              <IconButton icon="refresh" label="Reset" onPress={onReset} />
              <CircleButton onPress={onAddSticker} />
              <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
            </View>
          </View>
        ) : (
      <View style={styles.footerContainer}>
      <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
        <Button label="Use this photo"  onPress={() => setShowAppOptions(true)} />
      </View>
      )}
    <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
      <StatusBar style="auto" />
    </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 0.4,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  }
});
