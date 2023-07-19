import React from 'react';
import { View, ScrollView, Text, ViewStyle, FlatList, Image, TouchableOpacity } from 'react-native';
import { stickers } from '../../../shared/stickersAssetScheme';
interface StickerGridProps {
  maxHeight?: number;
  style?: ViewStyle | ViewStyle[];
  onStickerPress: (id: string) => void;
}

const StickerGrid: React.FC<StickerGridProps> = ({ maxHeight, style, onStickerPress }) => {
  console.log('max height:', maxHeight);
  return (
    <FlatList
      data={stickers}
      numColumns={3}
      keyExtractor={(item): string => {
        return item.id;
      }}
      renderItem={(item): JSX.Element => (
        <TouchableOpacity onPress={() => onStickerPress(item.item.id)} style={{ flex: 1, alignItems: 'center' }}>
          <Image style={{ width: '100%', resizeMode: 'contain', height: 100 }} source={item.item.preview}></Image>
        </TouchableOpacity>
      )}></FlatList>
  );
};

export default StickerGrid;
