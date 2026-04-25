'use client'

import { Badge, Button, Card, Group, Stack, Text } from '@mantine/core'

type OverrideItemCardProps = {
  deleteLabel: string
  intervalLabel: string
  isDeletePending?: boolean
  onDelete: () => void
  onEdit: () => void
  editLabel: string
  statusColor: string
  statusLabel: string
}

export function OverrideItemCard({
  deleteLabel,
  editLabel,
  intervalLabel,
  isDeletePending = false,
  onDelete,
  onEdit,
  statusColor,
  statusLabel,
}: OverrideItemCardProps) {
  return (
    <Card>
      <Stack gap="lg">
        <Group align="flex-start" justify="space-between" wrap="nowrap">
          <Text c="ink.9" fw={700} fz="lg" lh={1.5}>
            {intervalLabel}
          </Text>
          <Badge color={statusColor}>{statusLabel}</Badge>
        </Group>

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
