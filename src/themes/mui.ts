import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'dark',
    primary: {
      main: '#29BDCC', // 使用与antd相同的主色调
      // light: '#4FCBDA',
      // dark: '#1E8A96',
      // contrastText: '#ffffff'
    },
    // secondary: {
    //   main: '#e879f9', // 粉紫色，与项目中其他高亮色一致
    // },
    // error: {
    //   main: '#d01515', // 与luminous主题保持一致
    // },
    // success: {
    //   main: '#14c362', // 与luminous主题保持一致
    // },
    // background: {
    //   default: '#121212',
    //   paper: '#1a1a1a',
    // },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif', // 与luminous主题保持一致
  },
  components: {
    // 自定义组件样式
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4, // 与luminous主题保持一致
        },
      },
    },
  },
});