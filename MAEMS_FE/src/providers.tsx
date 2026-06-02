import type { ReactNode } from 'react'
import { ConfigProvider, theme } from 'antd'
import { BrowserRouter } from 'react-router-dom'
import { PRIMARY_THEME_COLOR } from './constants/colors'

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ConfigProvider
      // Đổi accent Ant Design từ xanh mặc định sang màu chủ đạo của app (PRIMARY_THEME_COLOR).
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: PRIMARY_THEME_COLOR,
          colorLink: PRIMARY_THEME_COLOR,
          colorInfo: PRIMARY_THEME_COLOR,
        },
      }}
    >
      <BrowserRouter>{children}</BrowserRouter>
    </ConfigProvider>
  )
}
