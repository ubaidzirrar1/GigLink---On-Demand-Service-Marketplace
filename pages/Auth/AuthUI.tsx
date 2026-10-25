
import React from 'react';
import AuthComponent from '../../components/AuthUI';
import { UserRole, Worker } from '../../types';

interface AuthUIProps {
  onLoginSuccess: (role: UserRole, emailVerified: boolean, user: Worker) => void;
  onCancel?: () => void;
}

const AuthUI: React.FC<AuthUIProps> = (props) => {
  return <AuthComponent {...props} />;
};

export default AuthUI;
