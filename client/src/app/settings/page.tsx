import { isLoggedIn } from '../utils/jwtUtil';
import { redirect } from 'next/navigation';
import SettingsPage from './SettingsPage';

const Settings = () => {
  if(!isLoggedIn()){
    redirect('/login');
  }
  return (
    <SettingsPage/>
  );
}

export default Settings;