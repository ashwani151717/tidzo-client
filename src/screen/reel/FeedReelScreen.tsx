import { StyleSheet, Text, View ,FlatList,Image, ViewToken, ActivityIndicator, Platform, TouchableOpacity} from 'react-native'
import React, { use, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CustomView from '../../components/global/CustomView'
import { useRoute } from '@react-navigation/native'
import { useAppDispatch } from '../../redux/reduxHook'
import { screenHeight, screenWidth } from '../../utils/Scaling'
import {debounce} from 'lodash'
import { fetchFeedReel } from '../../redux/action/reelAction'
import loader from '../../assets/images/loader.jpg'
// import { Icon } from 'react-native-vector-icons/Icon'
// import { RFValue } from 'react-native-responsive-fontsize'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { goBack } from '../../utils/NavigationUtils'
import { Colors } from '../../constants/Colors'
import { RFValue } from 'react-native-responsive-fontsize'
import VideoItem from '../../components/reel/VideoItem'
import FastImage from '@d11/react-native-fast-image'
interface RouteProp {
    data?: any[];
    category?: string;
    subcategory?: string;
    playsBeforeScroll?: number;
    pauseOnTap?: boolean;
  }
  
  const FeedReelScrollScreen: FC = () => {
    const route = useRoute();
    const dispatch = useAppDispatch();
  
    const routeParams = route?.params as RouteProp;
  
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [data, setData] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(!routeParams?.category);
    const [currentVisibleIndex, setCurrentVisibleIndex] = useState<number>(0);
    const listRef = useRef<FlatList<any>>(null);
    const indexRef = useRef(0);
    const dataRef = useRef<any[]>([]);
  
    const viewabilityConfig = useRef({
      itemVisiblePercentThreshold: 80,
    }).current;
  
    const onViewableItemsChanged = useRef(
      ({viewableItems}: {viewableItems: Array<ViewToken>}) => {
        if (viewableItems.length > 0) {
          const newIndex = viewableItems[0].index || 0;
          indexRef.current = newIndex;
          setCurrentVisibleIndex(newIndex);
        }
      },
    ).current;
  
    const getItemLayout = useCallback(
      (data: any, index: number) => ({
        length: screenHeight,
        offset: screenHeight * index,
        index,
      }),
      [],
    );
  
    const removeDuplicates = (data: any) => {
      const uniqueDataMap = new Map();
      data?.forEach((item: any) => {
        if (!uniqueDataMap.has(item._id)) {
          uniqueDataMap.set(item._id, item);
        }
      });
      return Array.from(uniqueDataMap.values());
    };
  
    const fetchFeed = useCallback(
      debounce(async (offset: number) => {
        if (routeParams?.category || loading || !hasMore) return;
        setLoading(true);
        try {
          const newData = await dispatch(fetchFeedReel(offset, 8));
          setOffset(offset + 8);
          if (newData?.length < 8) {
            setHasMore(false);
          }
          setData(removeDuplicates([...data, ...newData]));
        } finally {
            setTimeout(()=>{
                setLoading(false);
            },3000)
        
        }
      }, 200),
      [routeParams?.category, loading, hasMore, data, dispatch],
    );
  
    useEffect(() => {
      let cancelled = false

      const loadCategory = async () => {
        if (!routeParams?.category) {
          if (routeParams?.data) {
            setData(routeParams.data)
            setOffset(routeParams.data.length)
          }
          return
        }

        setLoading(true)
        setHasMore(false)
        const reels = await dispatch(
          fetchFeedReel(0, 50, routeParams.category, routeParams.subcategory),
        )
        if (!cancelled) {
          setData(reels || [])
          setOffset(reels?.length || 0)
          setLoading(false)
        }
      }

      loadCategory()
      return () => {
        cancelled = true
      }
    }, [routeParams?.category, routeParams?.subcategory, routeParams?.data, dispatch]);
  
    dataRef.current = data;

    const scrollToNext = useCallback(() => {
      const next = indexRef.current + 1;
      if (next >= dataRef.current.length) {
        return;
      }
      listRef.current?.scrollToIndex({index: next, animated: true});
    }, []);

    const renderVideoList = useCallback(
      ({item, index}: {item: any; index: number}) => {
        // console.log('gettt',index, currentVisibleIndex,);
        return (
            <VideoItem key={index} item={item} isVisible={index===currentVisibleIndex}
            preload={Math.abs(currentVisibleIndex+3) >= index}
            playsBeforeScroll={routeParams?.playsBeforeScroll ?? 2}
            pauseOnTap={routeParams?.pauseOnTap !== false}
            onFinished={index === currentVisibleIndex ? scrollToNext : undefined}
            />
       
        );
      },
      [currentVisibleIndex, scrollToNext, routeParams?.playsBeforeScroll, routeParams?.pauseOnTap],
    );
  
    const keyExtractor = useCallback((item: any) => item._id.toString(), []);
  
    const memoizedValue = useMemo(
      () => renderVideoList,
      [currentVisibleIndex, data],
    );
  
    return (
      <CustomView>
        <Image source={loader} style={styles.thumbnail} />
        <FlatList
          ref={listRef}
          data={data || []}
          onScrollToIndexFailed={info => {
            listRef.current?.scrollToOffset({
              offset: screenHeight * info.index,
              animated: true,
            });
          }}
          keyExtractor={keyExtractor}
          renderItem={memoizedValue}
          windowSize={2}
          onEndReached={async () => {
            // console.log('fetching');
            await fetchFeed(offset);
          }}
          pagingEnabled
          viewabilityConfig={viewabilityConfig}
          disableIntervalMomentum={true}
          removeClippedSubviews
          maxToRenderPerBatch={2}
          getItemLayout={getItemLayout}
          onViewableItemsChanged={onViewableItemsChanged}
          initialNumToRender={1}
          onEndReachedThreshold={0.1}
          ListFooterComponent={() =>
            loading ? (
              <View style={styles.footer}>
                <ActivityIndicator size="small" color={Colors.white} />
              </View>
            ) : null
          }
          decelerationRate={'normal'}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          style={styles.flatList}
        />
        <View style={styles.backButton}>
          <TouchableOpacity onPress={() => goBack()}>
            <Icon name="keyboard-backspace" size={RFValue(24)} color={'white'} />
          </TouchableOpacity>
        </View>
      </CustomView>
    );
  };
  
  const styles = StyleSheet.create({
    backButton: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? 60 : 20,
      left: 18,
      zIndex: 99,
    },
    footer: {
      height: 80,
      alignItems: 'center',
      justifyContent: 'center',
    },
    thumbnail: {
      position: 'absolute',
      zIndex: 1,
      aspectRatio: 9 / 16,
      height: screenHeight,
      width: '100%',
      alignSelf: 'center',
      right: 0,
      left: 0,
      resizeMode: 'stretch',
      top: 0,
      bottom: 0,
    },
    flatList: {
      flex: 1,
      width: '100%',
      height: screenHeight,
      zIndex:2
    },
  });
  
  export default FeedReelScrollScreen;
  