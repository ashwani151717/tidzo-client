import {token_storage} from '../storage';
import {CHECK_USERNAME, REGISTER} from '../API';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { resetAndNavigate } from '../../utils/NavigationUtils';
import { setUser } from '../reducer/userSlice';
import { appAxios } from '../apiConfig';
import { addFollowing  } from '../reducer/followingSlice';

interface registerData {
  id_token: string;
  provider: string;
  name: string;
  email: string;
  username: string;
  userImage: string;
  bio: string;
}

export const checkUsernameAvailability =
  (username: string) => async (dispatch: any) => {
    try {
      const res = await axios.post(CHECK_USERNAME, {
        username,
      });
      return res.data.available;
    } catch (error: any) {
      console.log('CHECK USERNAME ERROR ->', error);
      return null;
    }
  };

  export const register = (data: registerData) => async (dispatch: any) => {
    try {
      const res = await axios.post(REGISTER, data);
      token_storage.set('access_token', res.data.tokens.access_token);
      token_storage.set('refresh_token', res.data.tokens.refresh_token);
      await dispatch(setUser(res.data.user));
      resetAndNavigate('KidSetupScreen');
    } catch (error: any) {
      Toast.show({
        type: 'normalToast',
        props: {
          msg: 'There was an error, try again later',
        },
      });
      console.log('REGISTER ERROR ->', error);
    }
  };

  export const refetchUser = () => async (dispatch: any) => {
    try {
      const res = await appAxios.get('/user/profile');
      await dispatch(setUser(res.data.user));
    } catch (error: any) {
      console.log('PROFILE ->', error);
    }
  };

  export const toggleFollow = (userId: string) => async (dispatch: any) => {
    try {
      const res = await appAxios.put(`/user/follow/${userId}`);
      console.log('Toggle follow response:', res.data);
      
      // Handle different possible response structures
      let isFollowing = false;
      if (res.data.msg === 'Unfollowed') {
        isFollowing = false;
      } else if (res.data.msg === 'Followed' || res.data.following === true) {
        isFollowing = true;
      } else if (typeof res.data.following === 'boolean') {
        isFollowing = res.data.following;
      }
      
      const data = {
        id: userId,
        isFollowing: isFollowing,
      };
      
      console.log('Dispatching addFollowing with data:', data);
      dispatch(addFollowing(data));
      dispatch(refetchUser());
    } catch (error: any) {
      console.log('TOGGLE FOLLOW ERROR ->', error);
      Toast.show({
        type: 'normalToast',
        props: {
          msg: 'Failed to follow/unfollow user',
        },
      });
    }
  };









