import {TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function StatusButton({
  iconName,
  color,
  size = 20,
  style,
  onPress,
}) {
  return (
    <TouchableOpacity onPress={() => onPress()}>
      <Icon name={iconName} size={size} color={color} style={style} />
    </TouchableOpacity>
  );
}
