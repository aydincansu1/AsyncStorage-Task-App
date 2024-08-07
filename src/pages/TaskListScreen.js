import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import CustomTextInput from '../components/CustomTextInput';
import colors from '../themes/Color';
import SearchIcon from '../assets/images/SearchIcon.png';
import TodoItem from '../components/TodoItem';
import CustomButton from '../components/CustomButton';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import ScreenName from '../constants/ScreenName';
import AsyncStorage from '@react-native-async-storage/async-storage';
import renderEmptyList from '../components/EmptyList';
import Toast from 'react-native-toast-message';

export default function TaskListScreen() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, []),
  );

  useEffect(() => {
    filterTasks();
  }, [searchText, tasks]);

  const loadTasks = async () => {
    try {
      const existingTasks = await AsyncStorage.getItem('tasks');
      const tasks = existingTasks ? JSON.parse(existingTasks) : [];
      setTasks(tasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      Toast.show({
        type: 'error',
        text1: 'Hata',
        text2: 'Görevler yüklenirken bir hata oluştu',
        topOffset: 60,
        visibilityTime: 1000,
      });
    }
  };

  const filterTasks = () => {
    if (searchText) {
      const filtered = tasks.filter(task =>
        task.title.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks(tasks);
    }
  };

  const handleDeleteTask = async id => {
    try {
      const updatedTasks = tasks.filter(task => task.id !== id);
      setTasks(updatedTasks);
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      Toast.show({
        type: 'success',
        text1: 'Görev silindi!',
        topOffset: 60,
        visibilityTime: 1000,
      });
    } catch (error) {
      console.error('Failed to delete task:', error);
      Toast.show({
        type: 'error',
        text1: 'Hata',
        text2: 'Görev silinirken bir hata oluştu',
        topOffset: 60,
        visibilityTime: 1000,
      });
    }
  };

  const handleDeleteAllTasks = async () => {
    Alert.alert('Sil', 'Tüm görevleri silmek istediğinize emin misiniz?', [
      {
        text: 'İptal',
        onPress: () => console.log('İptal seçildi'),
        style: 'cancel',
      },
      {
        text: 'Tamam',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('tasks');

            setTasks([]);
            setFilteredTasks([]);
            setSearchText('');
            Toast.show({
              type: 'success',
              text1: 'Tüm görevler silindi',
              topOffset: 60,
              visibilityTime: 1000,
            });
          } catch (error) {
            console.error('Failed to delete all tasks:', error);
            Toast.show({
              type: 'error',
              text1: 'Hata',
              text2: 'Görevler silinirken bir hata oluştu',
              topOffset: 60,
              visibilityTime: 1000,
            });
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContentContainer}>
        <SafeAreaView style={[styles.container]}>
          <CustomTextInput
            imageSource={SearchIcon}
            onChangeText={setSearchText}
            value={searchText}
            placeholder="Task Ara"
          />
          <View style={styles.textContainer}>
            <Text style={styles.text}>Tasks</Text>
            {tasks.length > 0 && (
              <TouchableOpacity onPress={handleDeleteAllTasks}>
                <Text style={styles.deleteTask}>Tüm Görevleri Temizle</Text>
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            keyExtractor={item => item?.id.toString()}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyList}
            data={filteredTasks}
            renderItem={({item}) => (
              <TodoItem
                data={item}
                onDelete={() => handleDeleteTask(item.id)}
              />
            )}
          />
        </SafeAreaView>
        <CustomButton
          onPress={() => navigation.navigate(ScreenName.addTask)}
          label={'Add Task'}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  mainContentContainer: {
    height: '100%',
    position: 'absolute',
    padding: 20,
    width: Dimensions.get('screen').width,
  },
  textContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: colors.text.primary,
    fontWeight: '700',
  },
  deleteTask: {
    color: '#c0695e',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
