
import SplashScreen from "../screen/auth/SplashScreen";
import LoginScreen from "../screen/auth/LoginScreen";
import RegisterScreen from "../screen/auth/RegisterScreen";
import BottomTab from "./BottomTab";
import PickReelScreen from "../screen/reel/PickReelScreen";
import UploadReelScreen from "../screen/reel/UploadReelScreen";
import FeedReelScreen from "../screen/reel/FeedReelScreen";


export const authStack = [
  {
    name: 'SplashScreen',
    component: SplashScreen,
  },
    {
      name: 'LoginScreen',
      component: LoginScreen,
    },
    {
      name: 'RegisterScreen',
      component: RegisterScreen,
    },
    
  ];
  
  export const dashboardStack = [
    {
      name: 'BottomTab',
      component: BottomTab,
    },
    {
      name: 'PickReelScreen',
      component: PickReelScreen,
    },
    {
      name: 'UploadReelScreen',
      component: UploadReelScreen,
    },
    {
      name:'FeedReelScreen',
      component: FeedReelScreen,
    }
    
  ];
  
  export const mergedStacks = [...dashboardStack, ...authStack];