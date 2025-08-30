import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CustomAlert } from '../components/common/CustomAlert';

interface AlertButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

interface AlertOptions {
  title?: string;
  message: string;
  buttons?: AlertButton[];
  icon?: string;
  iconColor?: string;
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alertConfig, setAlertConfig] = useState<AlertOptions | null>(null);
  const [visible, setVisible] = useState(false);

  const showAlert = (options: AlertOptions) => {
    setAlertConfig(options);
    setVisible(true);
  };

  const hideAlert = () => {
    setVisible(false);
    setTimeout(() => setAlertConfig(null), 300);
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alertConfig && (
        <CustomAlert
          visible={visible}
          title={alertConfig.title}
          message={alertConfig.message}
          buttons={alertConfig.buttons}
          icon={alertConfig.icon}
          iconColor={alertConfig.iconColor}
          onClose={hideAlert}
        />
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};