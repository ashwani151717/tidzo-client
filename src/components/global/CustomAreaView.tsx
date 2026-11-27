import { FC, ReactNode } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { View, ViewStyle } from "react-native";
import { Colors } from "../../constants/Colors";
import LinearGradient from "react-native-linear-gradient";


interface CustomAreaViewProps{
    children:ReactNode;
    style?:ViewStyle;
}

const CustomSafeAreaView:FC<CustomAreaViewProps>=({children,style})=>{
    return(
       <View style={styles.gradient}>
       <LinearGradient
        pointerEvents="none"
        colors={[Colors.background, Colors.white]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={StyleSheet.absoluteFill}
       />
       <SafeAreaView style={[styles.container,style]}>
        <View style={[styles.container,style]} >
        {children}
        </View>
        
       </SafeAreaView >
       </View>
    )
}

const styles=StyleSheet.create({
    gradient:{
        flex:1,
    },
    container:{
        flex:1,
        padding:10,
        backgroundColor:'transparent',
    }
})

export default CustomSafeAreaView;