import React, { ReactNode } from 'react';
import Curriculumb from './courses/Curriculumb';
import { tCurriculum } from '../types/types';
import FooterLte from './layout/FooterLte';
import DashboardHeader from './layout/DashboardHeader';
import { Box } from '@mui/material';
interface Props {
  children: ReactNode;
  isClass?: boolean;
  courseName?: string;
  curriculum?: tCurriculum;
}

const DashboardHoc = ({ children, courseName, curriculum }: Props) => {
  return (
    <div>
      <DashboardHeader />

      <Box
        sx={{
          display: 'flex',
          margin: '2px 0 0 2px',
        }}
      >
        <div className="">
          <Curriculumb courseName={courseName} curriculum={curriculum} />
        </div>
        <div className="flex-1 ml-4">{children}</div>
      </Box>

      <FooterLte />
    </div>
  );
};

export default DashboardHoc;
