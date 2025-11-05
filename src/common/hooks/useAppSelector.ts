import { useSelector } from 'react-redux';
import type { RootState } from '@/config/store';

export const useAppSelector = <T>(selector: (state: RootState) => T): T => {
  return useSelector(selector);
};

