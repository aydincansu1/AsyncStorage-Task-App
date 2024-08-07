import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import colors from '../themes/Color';

export default function CustomButton({onPress, style, label}) {
  return (
    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
      <TouchableOpacity
        onPress={() => onPress()}
        style={[styles.button, style]}>
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    height: 50,
    width: '90%',
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 10,
  },
  label: {
    color: colors.white,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
});
