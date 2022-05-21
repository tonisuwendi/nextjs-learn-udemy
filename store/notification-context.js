import { createContext, useState, useEffect } from "react";

const NotificationContext = createContext({
  notification: null,
  showNotification: (notificationData) => {},
  hideNotification: () => {},
});

export const NotificationContextProvider = ({ children }) => {
  const [activeNotification, setActiveNotification] = useState();

  useEffect(() => {
    let timer = null;

    if (activeNotification && activeNotification.status !== "pending") {
      timer = setTimeout(() => {
        hideNotificationHandler();
      }, 3000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [activeNotification]);

  const showNotificationHandler = (notificationData) => {
    setActiveNotification(notificationData);
  };

  const hideNotificationHandler = () => {
    setActiveNotification(null);
  };

  const contextValue = {
    notification: activeNotification,
    showNotification: showNotificationHandler,
    hideNotification: hideNotificationHandler,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
