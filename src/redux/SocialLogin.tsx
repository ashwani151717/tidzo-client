import { Alert } from 'react-native';
import { navigate, resetAndNavigate } from '../utils/NavigationUtils';
import { setUser } from './reducer/userSlice';
import { token_storage } from './storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LOGIN } from './API';
import axios from 'axios';

interface RegisterData{
    id_token:string,
    provider:string,
    name:string,
    email:string,
    userImage:string
}

const handleSignInSuccess = async(res:any, dispatch:any)=>{
    token_storage.set('access_token',res.data.tokens.access_token);
    token_storage.set('refresh_token',res.data.tokens.refresh_token);
    await dispatch(setUser(res.data.user));
    resetAndNavigate('KidSetupScreen');
};

const handleSignInError = async(error:any,data:RegisterData)=>{
    console.log('Error',error);

    if(error.response.status === 401){
        console.log(data);
        navigate('RegisterScreen',{
           ...data,
                   });
        return;
    }
    Alert.alert('we are facing issue try again later');
};

export const signInWithGoogle = () => async (dispatch: any) => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const {idToken, user} = await GoogleSignin.signIn();
      console.log('user get by google',user)
      await axios
        .post(LOGIN, {
          provider: 'google',
          id_token: idToken,
        })
        .then(async res => {
          await handleSignInSuccess(res, dispatch);
        })
        .catch((err: any) => {
          const errorData = {
            email: user.email,
            name: user.name,
            userImage: user.photo,
            provider: 'google',
            id_token: idToken,
          };
          handleSignInError(err, errorData as RegisterData);
        });
    } catch (error) {
      console.log('GOOGLE ERROR', error);
    }
  };
