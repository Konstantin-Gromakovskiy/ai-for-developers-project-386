import Link from 'next/link'

import { Badge, Card, Group, Stack, Text } from '@mantine/core'

type EventTypeCardProps = {
  href: string
  title: string
  description: string
  durationLabel: string
}

export function EventTypeCard({
  href,
  title,
  description,
  durationLabel,
}: EventTypeCardProps) {
  return (
    <Link href={href} style={{ display: 'block', textDecoration: 'none' }}>
      <Card
        h="100%"
        style={{
          transition: 'transform 150ms ease, box-shadow 150ms ease',
        }}
      >
        <Group align="flex-start" justify="space-between" wrap="nowrap">
          <Stack gap="md">
            <Text c="ink.9" fw={700} fz={18} lh={1.3}>
              {title}
            </Text>
            <Text c="ink.4" fz="lg" lh={1.55}>
              {description}
            </Text>
          </Stack>

          <Badge color="mist" miw={56} styles={{ label: { fontWeight: 500 } }}>
            {durationLabel}
          </Badge>
        </Group>
      </Card>
    </Link>
  )
}
