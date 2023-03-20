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

const DashboardHoc = ({ isClass, children, courseName, curriculum }: Props) => {
  return (
    <div>
      <DashboardHeader />

      <Box display="flex" mx={8}>
        <Curriculumb
          isClass={isClass}
          courseName={courseName}
          curriculum={curriculum}
        />
        <div className="w-2/3 ml-4">{children}</div>
      </Box>

      <FooterLte />
    </div>
  );
};

export default DashboardHoc;
