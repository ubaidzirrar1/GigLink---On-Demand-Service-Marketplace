
import React from 'react';
import WorkerMapView from '../../components/WorkerMapView';

interface WorkerMapProps {
  isVerified?: boolean;
}

const WorkerMap: React.FC<WorkerMapProps> = (props) => {
  return <WorkerMapView {...props} />;
};

export default WorkerMap;
