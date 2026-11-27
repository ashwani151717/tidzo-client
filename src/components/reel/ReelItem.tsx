import {View, StyleSheet, Platform} from 'react-native';
import React from 'react';
import CustomText from '../global/CustomText';

interface ReelItemProps {
  description: string;
}

const ReelItem: React.FC<ReelItemProps> = ({description}) => {
  return (
    <View style={styles.interactionContainer}>
      <View style={styles.userContainer}>
        <CustomText variant="h8" numberOfLines={2}>
          {description}
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  interactionContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 20 : 10,
    width: '100%',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userContainer: {
    width: '70%',
    justifyContent: 'flex-end',
  },
});

export default ReelItem;
