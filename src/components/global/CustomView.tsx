import { FC, ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Colors } from "../../constants/Colors";
import LinearGradient from "react-native-linear-gradient";


interface CustomViewProps{
    children:ReactNode;
    style?:ViewStyle;
}

const CustomView:FC<CustomViewProps>=({children,style})=>{
    return(
       <View style={[styles.container, style]}>
        <LinearGradient
          pointerEvents="none"
          colors={[Colors.background, Colors.white]}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={StyleSheet.absoluteFill}
        />
        {children}
       </View>
    )
}

const styles=StyleSheet.create({
    container:{
        flex:1,
    }
})

export default CustomView;