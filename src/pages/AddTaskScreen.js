import {View, Text, StyleSheet} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import SearchIcon from '../assets/images/SearchIcon.png';
import CustomTextInput from '../components/CustomTextInput';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import colors from '../themes/Color';
import CustomButton from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useRoute} from '@react-navigation/native';
import ScreenName from '../constants/ScreenName';
import uuid from 'react-native-uuid';
import Toast from 'react-native-toast-message';

export default function AddTaskScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {data} = route.params || {};

  const [title, setTitle] = useState(data?.title || '');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(data?.status || null);
  const [startDate, setStartDate] = useState(data?.startDate || '');
  const [endDate, setEndDate] = useState(data?.endDate || '');
  const [items, setItems] = useState([
    {label: 'Open', value: 'open'},
    {label: 'Progress', value: 'progress'},
    {label: 'Pending', value: 'pending'},
    {label: 'Closed', value: 'closed'},
  ]);

  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  const showStartDatePicker = () => setStartDatePickerVisibility(true);
  const showEndDatePicker = () => setEndDatePickerVisibility(true);
  const hideStartDatePicker = () => setStartDatePickerVisibility(false);
  const hideEndDatePicker = () => setEndDatePickerVisibility(false);

  const handleConfirmStartDate = date => {
    setStartDate(date.toISOString());
    hideStartDatePicker();
  };

  const handleConfirmEndDate = date => {
    setEndDate(date.toISOString());
    hideEndDatePicker();
  };

  const handleAddTask = async () => {
    if (!title || !startDate || !endDate || !value) {
      Toast.show({
        type: 'info',
        text1: 'Bilgi',
        text2: 'Lütfen tüm alanları doldurunuz',
        topOffset: 60,
        visibilityTime: 1000,
      });
      return;
    }

    const newTask = {
      id: data?.id || uuid.v4(),
      title,
      startDate,
      endDate,
      status: value,
    };

    try {
      const existingTasks = await AsyncStorage.getItem('tasks');
      let tasks = existingTasks ? JSON.parse(existingTasks) : [];

      if (data) {
        tasks = tasks.map(task => (task.id === data.id ? newTask : task));
      } else {
        tasks.push(newTask);
      }

      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));

      Toast.show({
        type: 'success',
        text1: data ? 'Task güncellendi!' : 'Task eklendi!',
        topOffset: 60,
        visibilityTime: 1000,
      });

      navigation.navigate(ScreenName.taskList);
    } catch (error) {
      console.error('Failed to save task:', error);
      Toast.show({
        type: 'error',
        text1: 'Hata',
        text2: 'Görev kaydedilirken bir hata oluştu',
        topOffset: 60,
        visibilityTime: 1000,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inlineContainer}>
        <CustomTextInput
          value={title}
          imageSource={SearchIcon}
          label={'Task Adi'}
          onChangeText={setTitle}
        />
        <View style={styles.row}>
          <CustomTextInput
            onPressIcon={() => showStartDatePicker()}
            imageSource={SearchIcon}
            style={styles.textInput}
            label={'Başlangıç Zamanı'}
            onChangeText={setStartDate}
            value={startDate}
            isDate
          />
          <CustomTextInput
            onPressIcon={() => showEndDatePicker()}
            imageSource={SearchIcon}
            style={styles.textInput}
            label={'Bitiş Zamanı'}
            onChangeText={setEndDate}
            isDate
            value={endDate}
          />
        </View>
        <View style={styles.dropdownContainer}>
          <View>
            <Text style={styles.status}>Status</Text>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              style={{borderWidth: 0}}
            />
          </View>
        </View>
      </View>

      <CustomButton
        onPress={handleAddTask}
        label={data ? 'Update Task' : 'Save Task'}
      />

      <DateTimePickerModal
        onCancel={hideStartDatePicker}
        isVisible={isStartDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirmStartDate}
      />
      <DateTimePickerModal
        onCancel={hideEndDatePicker}
        isVisible={isEndDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirmEndDate}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
  },
  inlineContainer: {
    width: '90%',
  },

  dropdownContainer: {
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    marginBottom: 400,
  },
  status: {
    fontSize: 13,
    marginBottom: 5,
    fontWeight: '600',
    color: colors.text.primary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  textInput: {
    width: '45%',
  },
});
