import { ProgressProps, theme as antdTheme } from 'antd'

export const theme = {
  algorithm: antdTheme.darkAlgorithm,
  "token": {
    "colorPrimary": "#29BDCC",
    "colorInfo": "#29BDCC",
    "borderRadius": 4,
    "wireframe": false,
    "fontSize": 16,
    // "sizeStep": 4,
    "sizeUnit": 6,
    colorSuccess: '#14c362',
    "fontFamily": "Roboto",
    "controlHeight": 48,
    colorError: '#d01515'
  },
}

export const progressStrokeColor: ProgressProps['strokeColor'] = {
  '0%': '#DEFFE4',
  '100%': '#29BDCC',
}

export const tooltipColor: string = 'rgba(23,23,23, 0.95)'