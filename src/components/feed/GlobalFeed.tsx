import { StyleSheet, Text, View ,SafeAreaView, ImageBackground, FlatList} from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import GlobalBg from '../../assets/images/globebg.jpg';
import proj from '../../assets/images/best.jpg';
import girl from '../../assets/images/girl.jpg';
import one from '../../assets/images/one.jpg';
import naru from '../../assets/images/naru.jpg';
import demon from '../../assets/images/not.jpg';
import { screenHeight, screenWidth } from '../../utils/Scaling';
import { useAppDispatch, useAppSelector } from '../../redux/reduxHook';
import { fetchFeedReel } from '../../redux/action/reelAction';
import ReelItem from './ReelItem';
import { Gesture,GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import  Animated, { useAnimatedStyle, useSharedValue }   from 'react-native-reanimated'
import StatsContainer from './StatsContainer';
import { navigate } from '../../utils/NavigationUtils';

function clamp(value:any,min:any,max:any){
  return Math.min(Math.max(value,min),max)
}
const GlobalFeed = () => {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(true)
  const feedData = useAppSelector((state) => state.reel?.feedReels || [])
  const translateX=useSharedValue(0)
  const translateY=useSharedValue(0)
  const prevtranslateX=useSharedValue(0)
  const prevtranslateY=useSharedValue(0)
  const zoomScale=useSharedValue(1)
  const zoomStartScale=useSharedValue(0)

  const pinch=Gesture.Pinch()
  .onStart(()=>{
    zoomStartScale.value=zoomScale.value
  }).onUpdate((event)=>{
    zoomScale.value=clamp(zoomStartScale.value*event.scale,0.3,Math.min(screenWidth/140,screenHeight/140))
    // console.log('zoomScale',zoomScale.value*event.scale)
  }).runOnJS(true)
// console.log('zoomScale',zoomScale.value)
const pan=Gesture.Pan().minDistance(1)
.onStart(()=>{
  prevtranslateX.value=translateX.value
  prevtranslateY.value=translateY.value
}).onUpdate((event)=>{
  const MaxtranslateX=screenWidth-100;
  const MaxtranslateY=screenHeight/2-50;
   translateX.value=clamp(prevtranslateX.value+event.translationX,-MaxtranslateX,MaxtranslateX)
    translateY.value=clamp(prevtranslateY.value+event.translationY,-MaxtranslateY,MaxtranslateY)
}).runOnJS(true)

const animatedstyle=useAnimatedStyle(()=>{
  return{
    transform:[
      {translateX:translateX.value},
      {translateY:translateY.value},
      {scale:zoomScale.value}
    ]
  }
})

  const fetchReel = useCallback(async() => {
    setLoading(true)
    await dispatch(fetchFeedReel(0, 48));
    setLoading(false)
  }, [dispatch])

  useEffect(() => {
    fetchReel();
  }, [fetchReel]);

  useEffect(() => {
    if (feedData && feedData.length > 0) {
      setLoading(false)
    }
  }, [feedData]);
  
async function movetofirst(arr:any[],index:number){
  await arr.unshift(arr.splice(index,1)[0])
  return arr
}
  const renderItem = ({item, index}: {item: any, index: number}) => {
    const verticalShift = index % 2 == 0 ? -20 : 20
    return (
      <Animated.View style={{transform:[{translateY:verticalShift}]}}>
        <ReelItem 
          item={item} 
          loading={loading} 
          onpress={async() => {
            const copy = Array.from(feedData);
            const result = await movetofirst(copy, index)
            navigate('FeedReelScreen', {
              data: result,
            })
          }}
        />
      </Animated.View>
    )
  }
  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={Gesture.Simultaneous(pan,pinch)}>
        {/* //GlobalBg */}
   <ImageBackground source={GlobalBg}

   style={{flex:1,zIndex:1}}
   imageStyle={{resizeMode:'cover'}}>
    <Animated.View style={[styles.container,animatedstyle]}>
      <StatsContainer/>
    <View style={styles.gridcontainer}>
      {loading ? 
      (
      <FlatList
      data={Array.from({length:16})}
      keyExtractor={(item,index)=>index.toString()}
      renderItem={renderItem}
      numColumns={6}
      pinchGestureEnabled
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.flatlist}
      />
    )
      :
      (
        <FlatList
        data={feedData}
        keyExtractor={(item,index)=>index.toString()}
        renderItem={renderItem}
        numColumns={6}
        pinchGestureEnabled
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatlist}
        />
      )}

       
    </View>
    </Animated.View>
   </ImageBackground>
   </GestureDetector>
   </GestureHandlerRootView>
  )
}

export default GlobalFeed

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
  },
  gridcontainer:{
    width:screenWidth*5,
    height:screenHeight*2.9,
    justifyContent:'center',
    alignItems:'center',
  },
  flatlist:{
    paddingVertical:20,
    alignSelf:'center',
    justifyContent:'center',
    alignItems:'flex-start'
  },
   
})