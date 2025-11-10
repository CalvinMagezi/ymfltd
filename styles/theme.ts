// theme.ts
import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

// Color mode config
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

// Custom color palette
const colors = {
  brand: {
    50: '#E6F7FF',
    100: '#BAE7FF',
    200: '#91D5FF',
    300: '#69C0FF',
    400: '#40A9FF',
    500: '#1890FF',
    600: '#096DD9',
    700: '#0050B3',
    800: '#003A8C',
    900: '#002766',
  },
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  }
}

// Global styles
const styles = {
  global: (props: any) => ({
    body: {
      bg: props.colorMode === 'dark' ? 'gray.900' : 'white',
      color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      transition: 'background-color 0.2s, color 0.2s',
    },
  }),
}

// Component styles
const components = {
  Button: {
    baseStyle: {
      fontWeight: 'semibold',
      borderRadius: 'md',
    },
    variants: {
      solid: (props: any) => ({
        bg: props.colorMode === 'dark' ? 'brand.600' : 'brand.500',
        color: 'white',
        _hover: {
          bg: props.colorMode === 'dark' ? 'brand.700' : 'brand.600',
          transform: 'translateY(-1px)',
          boxShadow: 'lg',
        },
        _active: {
          bg: props.colorMode === 'dark' ? 'brand.800' : 'brand.700',
          transform: 'translateY(0)',
        },
      }),
    },
  },
  Box: {
    baseStyle: (props: any) => ({
      transition: 'background-color 0.2s, color 0.2s',
    }),
  },
  Heading: {
    baseStyle: (props: any) => ({
      color: props.colorMode === 'dark' ? 'white' : 'gray.800',
    }),
  },
  Text: {
    baseStyle: (props: any) => ({
      color: props.colorMode === 'dark' ? 'gray.200' : 'gray.600',
    }),
  },
}

// Extend the theme
const theme = extendTheme({ 
  config, 
  colors, 
  styles, 
  components 
})

export default theme
