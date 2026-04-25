import { Badge, Button, Card, Paper, createTheme } from '@mantine/core'

export const theme = createTheme({
  primaryColor: 'accent',
  primaryShade: 5,
  defaultRadius: 'xl',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontWeight: '700',
  },
  colors: {
    accent: [
      '#fff4ec',
      '#ffe8d5',
      '#ffd0b0',
      '#ffb68a',
      '#ff9b63',
      '#ff8443',
      '#ff772e',
      '#e7651d',
      '#ce5716',
      '#b54a0e',
    ],
    ink: [
      '#eef3ff',
      '#dbe5ff',
      '#b7c7f2',
      '#91a7dc',
      '#6d88c3',
      '#5570aa',
      '#40598a',
      '#31446b',
      '#22304d',
      '#13203a',
    ],
    mist: [
      '#f7f9fc',
      '#edf2f8',
      '#dce6f1',
      '#c4d3e2',
      '#aebfd1',
      '#96a8bc',
      '#7d90a7',
      '#647892',
      '#4b6077',
      '#33485d',
    ],
  },
  shadows: {
    card: '0 14px 32px rgba(19, 32, 58, 0.08)',
  },
  components: {
    Button: Button.extend({
      defaultProps: {
        radius: 'xl',
        size: 'md',
      },
    }),
    Card: Card.extend({
      defaultProps: {
        radius: 'xl',
        padding: 'xl',
        shadow: 'card',
        withBorder: true,
      },
    }),
    Paper: Paper.extend({
      defaultProps: {
        radius: 'xl',
        shadow: 'card',
        withBorder: true,
      },
    }),
    Badge: Badge.extend({
      defaultProps: {
        radius: 'xl',
        variant: 'light',
      },
    }),
  },
})
