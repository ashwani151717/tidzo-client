import React, { FC, useEffect, useRef, useState } from 'react'
import { Animated, PanResponder, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native'
import CustomSafeAreaView from '../../../components/global/CustomAreaView'
import { FONTS } from '../../../constants/Fonts'
import { KidBar, KidCheer } from '../kid/KidBar'
import { speak } from '../kidSpeech'

type ItemId = 'apple' | 'banana' | 'milk'

const ITEMS: {id: ItemId; label: string; fill: string}[] = [
  {id: 'apple', label: 'apple', fill: '#F04438'},
  {id: 'banana', label: 'banana', fill: '#F3C04D'},
  {id: 'milk', label: 'milk', fill: '#E7F4FF'},
]

const ORDERS: {say: string; need: Record<ItemId, number>}[] = [
  {say: 'Put 2 apples and 1 banana in your basket.', need: {apple: 2, banana: 1, milk: 0}},
  {say: 'Put 1 milk and 3 bananas in your basket.', need: {apple: 0, banana: 3, milk: 1}},
  {say: 'Put 2 apples and 1 milk in your basket.', need: {apple: 2, banana: 0, milk: 1}},
]

const same = (have: Record<ItemId, number>, need: Record<ItemId, number>) =>
  (Object.keys(need) as ItemId[]).every(key => have[key] === need[key])

const empty = (): Record<ItemId, number> => ({apple: 0, banana: 0, milk: 0})

const ShelfItem: FC<{fill: string; label: string; onDrop: () => void}> = ({fill, label, onDrop}) => {
  const pan = useRef(new Animated.ValueXY()).current
  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {useNativeDriver: false}),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 80) {
          onDrop()
        }
        Animated.spring(pan, {toValue: {x: 0, y: 0}, useNativeDriver: false}).start()
      },
    }),
  ).current

  return (
    <Animated.View style={[styles.item, {transform: pan.getTranslateTransform()}]} {...responder.panHandlers}>
      <View style={[styles.blob, {backgroundColor: fill}]} />
      <Text style={styles.itemLabel}>{label}</Text>
    </Animated.View>
  )
}

const GroceryScreen: FC = () => {
  const [order, setOrder] = useState(0)
  const [basket, setBasket] = useState(empty())
  const [done, setDone] = useState(false)
  const current = ORDERS[order]

  useEffect(() => {
    speak(current.say)
  }, [current.say, order])

  const add = (id: ItemId) => {
    setBasket(currentBasket => {
      if (currentBasket[id] + 1 > current.need[id]) {
        speak('That is too many.')
        return currentBasket
      }
      const next = {...currentBasket, [id]: currentBasket[id] + 1}
      if (same(next, current.need)) {
        speak('Yes! The basket is ready.')
        if (order + 1 >= ORDERS.length) {
          setTimeout(() => setDone(true), 600)
        } else {
          setTimeout(() => {
            setOrder(value => value + 1)
            setBasket(empty())
          }, 700)
        }
      } else if (next[id] > current.need[id]) {
        speak('That is too many.')
      }
      return next
    })
  }

  if (done) {
    return (
      <CustomSafeAreaView style={styles.screen}>
        <KidCheer
          title="Basket full"
          detail="You found every item."
          nextLabel="Shop again"
          onNext={() => {
            setDone(false)
            setOrder(0)
            setBasket(empty())
          }}
        />
      </CustomSafeAreaView>
    )
  }

  return (
    <CustomSafeAreaView style={styles.screen}>
      <View style={styles.body}>
        <KidBar title="Grocery" onListen={() => speak(current.say)} />
        <Text style={styles.prompt}>{current.say}</Text>
        <View style={styles.shelf}>
          {ITEMS.map(item => (
            <ShelfItem key={`${item.id}-${order}`} fill={item.fill} label={item.label} onDrop={() => add(item.id)} />
          ))}
        </View>
        <View style={styles.basket}>
          <Text style={styles.basketTitle}>Basket</Text>
          <Text style={styles.basketCount}>
            {basket.apple} apples · {basket.banana} bananas · {basket.milk} milk
          </Text>
          <TouchableOpacity onPress={() => setBasket(empty())} accessibilityRole="button">
            <Text style={styles.clear}>Empty basket</Text>
          </TouchableOpacity>
        </View>
      </View>
    </CustomSafeAreaView>
  )
}

export default GroceryScreen

const styles = StyleSheet.create({
  screen: {backgroundColor: '#FFF6EA', padding: 0},
  body: {flex: 1, paddingHorizontal: 16, paddingBottom: 16},
  prompt: {marginTop: 16, textAlign: 'center', fontFamily: FONTS.Bold, fontSize: 20, color: '#1C1917'},
  shelf: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 28},
  item: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    alignItems: 'center',
    paddingVertical: 14,
  },
  blob: {width: 48, height: 48, borderRadius: 24},
  itemLabel: {marginTop: 6, fontFamily: FONTS.SemiBold, fontSize: 13, color: '#1C1917'},
  basket: {
    marginTop: 'auto',
    backgroundColor: '#FFF1D6',
    borderRadius: 28,
    padding: 16,
    alignItems: 'center',
  },
  basketTitle: {fontFamily: FONTS.Bold, fontSize: 18, color: '#C47A12'},
  basketCount: {marginTop: 6, fontFamily: FONTS.Regular, fontSize: 14, color: '#1C1917', textAlign: 'center'},
  clear: {marginTop: 8, fontFamily: FONTS.Bold, fontSize: 14, color: '#1E4E79'},
})
