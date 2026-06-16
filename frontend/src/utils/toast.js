import { toast } from 'react-hot-toast';

export const showSuccess = (message) => {
  toast.success(message, {
    style: {
      border: '1px solid #10B981',
      padding: '16px',
      color: '#064E3B',
      background: '#ECFDF5',
      fontWeight: '500',
      borderRadius: '12px',
    },
    iconTheme: {
      primary: '#10B981',
      secondary: '#FFFFFF',
    },
  });
};

export const showError = (message) => {
  toast.error(message, {
    style: {
      border: '1px solid #EF4444',
      padding: '16px',
      color: '#7F1D1D',
      background: '#FEF2F2',
      fontWeight: '500',
      borderRadius: '12px',
    },
    iconTheme: {
      primary: '#EF4444',
      secondary: '#FFFFFF',
    },
  });
};

export const showInfo = (message) => {
  toast(message, {
    icon: 'ℹ️',
    style: {
      border: '1px solid #3B82F6',
      padding: '16px',
      color: '#1E3A8A',
      background: '#EFF6FF',
      fontWeight: '500',
      borderRadius: '12px',
    },
  });
};

export default {
  success: showSuccess,
  error: showError,
  info: showInfo,
};
