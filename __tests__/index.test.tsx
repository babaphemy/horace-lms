import React from 'react';
import { render } from '@testing-library/react';
import Home from '../pages';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

describe('App', () => {
  const queryClient = new QueryClient();
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([{ id: 1, email: 'femi' }]),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders without breaking', () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    );
    expect(container).toBeDefined();
  });
  //   it('renders the H1 tag', () => {
  //     const { getByText } = render(
  //       <QueryClientProvider client={queryClient}>
  //         <Home />
  //       </QueryClientProvider>
  //     );
  //     const txtH1 = getByText('Horace Learning');
  //     expect(txtH1).toBeInTheDocument();
  //   });
  //   it('renders the email', async () => {
  //     const mockData = [
  //       { id: 1, name: 'Course 1' },
  //       { id: 2, name: 'Course 2' },
  //     ];
  //     const fetchCourses = jest.fn(() => Promise.resolve(mockData));
  //     const { result, waitForNextUpdate } = renderHook(() =>
  //       useQuery('usersAdddoc', fetchCourses, {
  //         staleTime: 5000,
  //         cacheTime: 10,
  //       })
  //     );
  //     await waitForNextUpdate();
  //     await act(async () =>
  //       render(
  //         <QueryClientProvider client={queryClient}>
  //           <Home />
  //         </QueryClientProvider>
  //       )
  //     );
  //     const txtEmail = screen.getAllByText('femi');
  //     expect(txtEmail.length).toBe(1);
  //   });
});
