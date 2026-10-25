
import React from 'react';
import SettingsComponent from '../../components/SettingsView';
import { Worker, UserRole } from '../../types';

interface SettingsViewProps {
  user: Worker;
  role: UserRole;
  onUpdate: (updated: Worker) => void;
}

const SettingsView: React.FC<SettingsViewProps> = (props) => {
  return <SettingsComponent {...props} />;
};

export default SettingsView;
