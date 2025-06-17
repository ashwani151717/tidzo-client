import { StyleSheet, Text, View } from 'react-native'
import React, { FC, useEffect } from 'react'
import { screenHeight, screenWidth } from '../../utils/Scaling';
interface VideoItemProps {
  item:any;
  isvisible: boolean;
  preload: boolean;
}
const VideoItem:FC<VideoItemProps> = ({item,isvisible,preload}) => {

  
  return (
    <View style={styles.container}>
      <Text>VideoItem</Text>
    </View>
  )
}

export default VideoItem

const styles = StyleSheet.create({
  container:{
    height:screenHeight,
    width:screenWidth,
    flexGrow:1,
    flex:1
  }
})