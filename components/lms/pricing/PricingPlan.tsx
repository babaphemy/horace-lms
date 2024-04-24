import CheckIcon from '@mui/icons-material/Check';
import { Button, Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import React from 'react';

interface Plan {
  name: string;
  price: string;
  description: string;
  duration?: string;
}

interface PricingPlanProps {
  plan: Plan;
}

const PricingPlan: React.FC<PricingPlanProps> = ({ plan }) => (
  <div className='max-w-xs'>
    <Card className='min-h-[35rem] h-full flex flex-col space-y-4'>
      <CardHeader title={plan.name} titleTypographyProps={{ variant: 'h3' }} subheader={plan.description} />
      <CardContent className='flex-grow-[1]'>
        <Typography className='text-4xl font-bold text-center mb-2'>{plan.price}</Typography>
        <Typography className='text-gray-700 text-center'>{plan?.duration || ''}</Typography>
        <Stack spacing={2} sx={{ mt: 4 }}>
          <FeatureItem>Projects Flexibility</FeatureItem>
          <FeatureItem>Collaborators Inclusivity</FeatureItem>
          <FeatureItem>Dedicated Support</FeatureItem>
        </Stack>
      </CardContent>
      <CardFooter>
        <Button fullWidth variant="contained" className='bg-blue-500'>Choose Plan</Button>
      </CardFooter>
    </Card>
  </div>
);
export default PricingPlan;


function FeatureItem({ children }: { children: React.ReactNode }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="body1">{children}</Typography>
      <CheckIcon color="primary" />
    </Stack>
  );
}

function CardFooter({ children }: { children: React.ReactNode }) {
  return (
    <CardContent>
      <Stack spacing={2}>{children}</Stack>
    </CardContent>
  );
}