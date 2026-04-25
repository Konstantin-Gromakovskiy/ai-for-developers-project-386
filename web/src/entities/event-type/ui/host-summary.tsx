import { Avatar, Group, Stack, Text } from '@mantine/core'

type HostSummaryProps = {
  name: string
  role: string
}

export function HostSummary({ name, role }: HostSummaryProps) {
  return (
    <Group gap="md" wrap="nowrap">
      <Avatar color="teal" name={name} radius="xl" size={62} variant="light">
        {name.slice(0, 1)}
      </Avatar>

      <Stack gap={2}>
        <Text c="ink.9" fw={700} fz="xl">
          {name}
        </Text>
        <Text c="ink.4" fz="md">
          {role}
        </Text>
      </Stack>
    </Group>
  )
}
