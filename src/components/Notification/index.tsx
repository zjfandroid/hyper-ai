import React from 'react';
import { notification } from 'antd';
import { NotificationPlacement } from 'antd/es/notification/interface';

// 通知配置类型
type NotificationConfig = {
  message: React.ReactNode
  description?: React.ReactNode
  duration?: number | null
  placement?: NotificationPlacement
  showProgress?: boolean
  icon?: React.ReactNode
  pauseOnHover?: boolean
  onClick?: () => void
};

// 默认配置
const defaultConfig: Partial<NotificationConfig> = {
  duration: 4,
  placement: 'topRight',
  showProgress: true,
  pauseOnHover: true,
};

// 创建通知服务
const [notificationApi, _NotificationProvider] = (() => {
  // 创建一个 Context 来存储 notification API
  const NotificationContext = React.createContext<typeof notification | null>(null);

  // 通知提供者组件
  const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [api, contextHolder] = notification.useNotification();

    return (
      <NotificationContext.Provider value={api}>
        {children}
        {contextHolder}
      </NotificationContext.Provider>
    );
  };

  // 使用通知的钩子
  const useNotification = () => {
    const api = React.useContext(NotificationContext);
    if (!api) {
      throw new Error('useNotification must be used within a NotificationProvider');
    }

    return {
      success: (config: NotificationConfig) => {
        api.success({
          className: config.onClick ? 'pointer' : '',
          ...defaultConfig,
          ...config,
        });
      },
      error: (config: NotificationConfig) => {
        api.error({
          className: config.onClick ? 'pointer' : '',
          ...defaultConfig,
          ...config,
        });
      },
      info: (config: NotificationConfig) => {
        api.info({
          className: config.onClick ? 'pointer' : '',
          ...defaultConfig,
          ...config,
        });
      },
      warning: (config: NotificationConfig) => {
        api.warning({
          className: config.onClick ? 'pointer' : '',
          ...defaultConfig,
          ...config,
        });
      },
      open: (config: NotificationConfig) => {
        const { ...rest } = config;
        api.open({
          className: config.onClick ? 'pointer' : '',
          ...defaultConfig,
          ...rest,
        });
      },
    };
  };

  return [{ useNotification }, Provider] as const;
})();

export const useNotification = notificationApi.useNotification;
export const NotificationProvider = _NotificationProvider;