import { Paper, Stack, Text } from '@mantine/core'

type SelectionInfoCardProps = {
  label: string
  value: string
}

export function SelectionInfoCard({ label, value }: SelectionInfoCardProps) {
  return (
    <Paper bg="mist.1" p="md" radius="xl" shadow="none" withBorder={false}>
      <Stack gap={6}>
        <Text c="ink.4" fz="lg">
          {label}
        </Text>
        <Text c="ink.9" fw={700} fz="lg">
          {value}
        </Text>
      </Stack>
    </Paper>
  )
}
