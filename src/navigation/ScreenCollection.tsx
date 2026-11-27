
import SplashScreen from "../screen/auth/SplashScreen";
import LoginScreen from "../screen/auth/LoginScreen";
import RegisterScreen from "../screen/auth/RegisterScreen";
import KidSetupScreen from "../screen/auth/KidSetupScreen";
import KidHomeScreen from "../screen/auth/KidHomeScreen";
import LearningScreen from "../screen/auth/LearningScreen";
import SayItScreen from "../screen/auth/SayItScreen";
import ShapeSessionScreen from "../screen/auth/ShapeSessionScreen";
import ListenGuessScreen from "../screen/auth/ListenGuessScreen";
import GuessPlayScreen from "../screen/auth/GuessPlayScreen";
import WhiteboardHomeScreen from "../screen/auth/whiteboard/WhiteboardHomeScreen";
import StrokeLessonScreen from "../screen/auth/whiteboard/StrokeLessonScreen";
import TraceBoardScreen from "../screen/auth/whiteboard/TraceBoardScreen";
import GamesHomeScreen from "../screen/auth/games/GamesHomeScreen";
import MatchingScreen from "../screen/auth/games/MatchingScreen";
import ColorFindScreen from "../screen/auth/games/ColorFindScreen";
import FindLetterScreen from "../screen/auth/games/FindLetterScreen";
import CountObjectsScreen from "../screen/auth/games/CountObjectsScreen";
import GroceryScreen from "../screen/auth/games/GroceryScreen";
import DoctorScreen from "../screen/auth/games/DoctorScreen";
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
    {
      name: 'KidSetupScreen',
      component: KidSetupScreen,
    },
    {
      name: 'KidHomeScreen',
      component: KidHomeScreen,
    },
    {
      name: 'LearningScreen',
      component: LearningScreen,
    },
    {
      name: 'SayItScreen',
      component: SayItScreen,
    },
    {
      name: 'ShapeSessionScreen',
      component: ShapeSessionScreen,
    },
    {
      name: 'ListenGuessScreen',
      component: ListenGuessScreen,
    },
    {
      name: 'GuessPlayScreen',
      component: GuessPlayScreen,
    },
    {
      name: 'WhiteboardHomeScreen',
      component: WhiteboardHomeScreen,
    },
    {
      name: 'StrokeLessonScreen',
      component: StrokeLessonScreen,
    },
    {
      name: 'TraceBoardScreen',
      component: TraceBoardScreen,
    },
    {
      name: 'GamesHomeScreen',
      component: GamesHomeScreen,
    },
    {
      name: 'MatchingScreen',
      component: MatchingScreen,
    },
    {
      name: 'ColorFindScreen',
      component: ColorFindScreen,
    },
    {
      name: 'FindLetterScreen',
      component: FindLetterScreen,
    },
    {
      name: 'CountObjectsScreen',
      component: CountObjectsScreen,
    },
    {
      name: 'GroceryScreen',
      component: GroceryScreen,
    },
    {
      name: 'DoctorScreen',
      component: DoctorScreen,
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