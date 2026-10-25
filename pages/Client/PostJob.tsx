
import React from 'react';
import JobPostForm from '../../components/JobPostForm';

interface PostJobProps {
  onCancel: () => void;
  onSubmit: (jobData: any) => void;
  isVerified?: boolean;
}

const PostJob: React.FC<PostJobProps> = (props) => {
  return <JobPostForm {...props} />;
};

export default PostJob;
