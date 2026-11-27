import { navigate, resetAndNavigate } from '../../utils/NavigationUtils';
import { appAxios } from '../apiConfig';
import { token_storage } from '../storage';
import { refetchUser } from './userAction';
import { setFeedReels } from '../reducer/reelSlice';


export const createReel = (data: any) => async (dispatch: any) => {
  try {
    const res = await appAxios.post('/reel', data);
    dispatch(refetchUser());
  } catch (error) {
    console.log('REEL CREATE ERROR', error);
  }
};

export const fetchFeedReel =
  (offset: number, limit: number, category?: string, subcategory?: string) =>
  async (dispatch: any) => {
    try {
      const isGuest = !token_storage.getString('access_token');
      const path = category || isGuest ? '/feed/guest' : '/feed/home';
      const categoryQuery = category
        ? `&category=${encodeURIComponent(category)}`
        : '';
      const subQuery = subcategory
        ? `&sub=${encodeURIComponent(subcategory)}`
        : '';
      const res = await appAxios.get(
        `${path}?limit=${limit || 25}&offset=${offset}${categoryQuery}${subQuery}`,
      );
      const reels = res.data.reels || [];
      dispatch(setFeedReels(reels));
      return reels;
    } catch (error) {
      console.log('FETCH REEL ERROR', error);
      return [];
    }
  };

interface fetchUserReel {
  userId?: string;
  offset: number;
}

export const fetchReel =
  (data: fetchUserReel, type: string) => async (dispatch: any) => {
    try {
      const res = await appAxios.get(
        `/feed/${type}/${data?.userId}?limit=5&offset=${data?.offset}`,
      );
      return res.data.reelData || [];
    } catch (error) {
      console.log('FETCH REEL ERROR', error);
      return [];
    }
  };

export const getReelById =
  (id: string, deepLinkType: string) => async (dispatch: any) => {
    try {
      const res = await appAxios.get(`/reel/${id}`);
      if (deepLinkType !== 'RESUME') {
        resetAndNavigate('BottomTab');
      }
      navigate('ReelScrollScreen', {
        data: [res.data],
        index: 0,
      });
    } catch (error) {
      console.log('FETCH REEL ERROR', error);
      return [];
    }
  };
