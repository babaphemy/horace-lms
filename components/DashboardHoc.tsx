import React, { ReactNode } from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Curriculumb from './courses/Curriculumb';
import { tCurriculum } from '../types/types';
interface Props {
  children: ReactNode;
  isClass?: boolean;
  courseName?: string;
  curriculum?: tCurriculum;
}

const DashboardHoc = ({ isClass, children, courseName, curriculum }: Props) => {
  return (
    <Box mr={8}>
      <Header />
      <Box display={'flex'}>
        <Curriculumb
          isClass={isClass}
          courseName={courseName}
          curriculum={curriculum}
        />
        <Box ml={4}>{children}</Box>
      </Box>
    </Box>
  );
};

export default DashboardHoc;
