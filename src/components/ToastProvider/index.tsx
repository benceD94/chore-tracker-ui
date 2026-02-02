import { type FC, type PropsWithChildren} from 'react';
import toast, {Toaster, ToastBar, type Toast} from 'react-hot-toast';
import type { ToastContextContextType } from './types';
import { CheckCircle, Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { ToastContext } from './context';

export const ToastProvider: FC<PropsWithChildren> = ({children}) => {
  const values: ToastContextContextType = {
    notify: toast,
  };

  return (
    <ToastContext.Provider value={values}>
      <Toaster
        position="bottom-right"
        toastOptions={{
          success: {
            icon: <CheckCircle />,
            style: {
              backgroundColor: '#048A42',
              color: '#fff',
            },
          },
          error: {
            icon: <CheckCircle />,
            style: {
              backgroundColor: '#D62D0B',
              color: '#fff',
            },
          },
        }}
      >
        {(t: Toast) => (
          <ToastBar toast={t}>
            {({icon, message}) => (
              <>
                {icon}
                {message}
                <IconButton
                  onClick={() => {
                    toast.dismiss(t.id);
                  }}
                >
                  <Close style={{color: '#fff'}} />
                </IconButton>
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
      {children}
    </ToastContext.Provider>
  );
};
