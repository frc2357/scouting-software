import React from 'react';
import { LoadingScreen } from './LoadingScreen';

export const LoadingWrapper: React.FC<
  React.PropsWithChildren<{ message: string; isLoading: boolean }>
> = ({
  children,
  message,
  isLoading,
}: React.PropsWithChildren<{ message: string; isLoading: boolean }>) => {
  if (isLoading) {
    return <LoadingScreen message={message} />;
  }

  return <>{children}</>;
};
