import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorageKey from '../constants/AsyncStorageKey';
import {useNavigation} from '@react-navigation/native';
import colors from '../themes/Color';

const width = Dimensions.get('screen').width;

export default function OnboardingScreen() {
  const navigation = useNavigation();

  const handleOnboardingComplete = async () => {
    await AsyncStorage.setItem(AsyncStorageKey.onboardingComplete, 'true');
    navigation.replace('AddTask');
  };
  return (
    <View style={styles.container}>
      <View style={styles.ellipseBackground}>
        <View style={styles.inlineContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={require('../assets/images/task.png')}
              style={styles.image}
            />
          </View>
        </View>
      </View>
      <View style={styles.footerContainer}>
        <TouchableOpacity onPress={handleOnboardingComplete}>
          <Text style={styles.text}>Add Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
  },
  ellipseBackground: {
    width: width,
    backgroundColor: colors.primary,
    height: '70%',
    borderBottomLeftRadius: width / 2,
  },
  inlineContainer: {
    width: width,
    height: '100%',
    position: 'absolute',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 170,
  },
  image: {
    height: 230,
    width: 230,
    borderRadius: 10,
  },
  footerContainer: {
    marginTop: 80,
  },
  text: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '500',
  },
});
