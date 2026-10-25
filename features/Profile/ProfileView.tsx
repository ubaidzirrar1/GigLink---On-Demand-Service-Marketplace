
import React from 'react';
import ProfileComponent from '../../components/ProfileView';
import { UserRole, Worker } from '../../types';

interface ProfileViewProps {
  role: UserRole;
  isLoggedIn: boolean;
  onSignIn: () => void;
  onSwitchRole: () => void;
  userProfile: Worker;
  onUpdateProfile: (updated: Worker) => void;
}

const ProfileView: React.FC<ProfileViewProps> = (props) => {
  return <ProfileComponent {...props} />;
};

export default ProfileView;
