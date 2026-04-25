'use client'

import { Badge, Button, Card, Group, Stack, Text, Title } from '@mantine/core'

type EventTypeItemCardProps = {
  deleteLabel: string
  description: string
  durationLabel: string
  editLabel: string
  isDeletePending?: boolean
  onDelete: () => void
  onEdit: () => void
  slug: string
  statusColor: string
  statusLabel: string
  title: string
}

export function EventTypeItemCard({
  deleteLabel,
  description,
  durationLabel,
  editLabel,
  isDeletePending = false,
  onDelete,
  onEdit,
  slug,
  statusColor,
  statusLabel,
  title,
}: EventTypeItemCardProps) {
  return (
    <Card>
      <Stack gap="lg">
        <Stack gap="sm">
          <Group align="flex-start" justify="space-between" wrap="nowrap">
            <Stack gap={6}>
              <Title c="ink.9" order={3}>
                {title}
              </Title>
              <Text c="ink.4" size="sm">
                /
                {slug}
              </Text>
            </Stack>

            <Group gap="xs">
              <Badge color="mist">{durationLabel}</Badge>
              <Badge color={statusColor}>{statusLabel}</Badge>
            </Group>
          </Group>

          <Text c="ink.5" fz="lg" lh={1.55}>
            {description}
          </Text>
        </Stack>

        <Group>
          <Button color="ink" onClick={onEdit} variant="light">
            {editLabel}
          </Button>
          <Button color="red" loading={isDeletePending} onClick={onDelete} variant="light">
            {deleteLabel}
          </Button>
        </Group>
      </Stack>
    </Card>
  )
}
