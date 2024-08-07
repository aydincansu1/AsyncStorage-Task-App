import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../themes/Color';

const renderEmptyList = () => {
  return (
    <View style={styles.renderEmptyList}>
      <Icon size={60} name="text-box-remove" color={colors.text.primary} />
      <Text style={styles.emptyText}>Empty Text</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  renderEmptyList: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: 30,
  },
  emptyText: {
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: '500',
  },
});
export default renderEmptyList;
