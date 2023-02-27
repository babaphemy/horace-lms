import React, { ReactNode } from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import Curriculumb from './courses/Curriculumb';
interface Props {
  children: ReactNode;
  isClass?: boolean;
}

const DashboardHoc = ({ isClass, children }: Props) => {
  return (
    <div>
      <Header />
      <Box display={'flex'}>
        {isClass ? <Curriculumb /> : <Sidebar />}
        <Box ml={4}>{children}</Box>
      </Box>
    </div>
  );
};

export default DashboardHoc;
