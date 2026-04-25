'use client'

import { Badge, Card, Group, Stack, Text, Title } from '@mantine/core'

type BookingItemCardProps = {
  createdAtLabel: string
  dateLabel: string
  emailLabel: string
  eventTypeLabel: string
  guestName: string
  guestNotes?: string
  guestNotesLabel: string
  guestEmail: string
  statusLabel: string
  title: string
  timeLabel: string
}

export function BookingItemCard({
  createdAtLabel,
  dateLabel,
  emailLabel,
  eventTypeLabel,
  guestEmail,
  guestName,
  guestNotes,
  guestNotesLabel,
  statusLabel,
  timeLabel,
  title,
}: BookingItemCardProps) {
  return (
    <Card>
      <Stack gap="lg">
        <Group align="flex-start" justify="space-between" wrap="nowrap">
          <Stack gap={6}>
            <Title c="ink.9" order={3}>
              {guestName}
            </Title>
            <Text c="ink.4" size="sm">
              {guestEmail}
            </Text>
          </Stack>

          <Badge color="mist">{statusLabel}</Badge>
        </Group>

        <Stack gap="xs">
          <Text c="ink.5" fz="md">
            {eventTypeLabel}
          </Text>
          <Text c="ink.5" fz="md">
            {dateLabel}
          </Text>
          <Text c="ink.5" fz="md">
            {timeLabel}
          </Text>
          <Text c="ink.5" fz="md">
            {createdAtLabel}
          </Text>
          <Text c="ink.5" fz="md">
            {emailLabel}
          </Text>
          {guestNotes
            ? (
                <Text c="ink.5" fz="md">
                  {guestNotesLabel}
                </Text>
              )
            : null}
        </Stack>

        {guestNotes
          ? (
              <Card bg="mist.1" padding="md" shadow="none" withBorder={false}>
                <Stack gap={6}>
                  <Text c="ink.4" fz="sm" fw={600}>
                    {title}
                  </Text>
                  <Text c="ink.9" fz="md" lh={1.55}>
                    {guestNotes}
                  </Text>
                </Stack>
              </Card>
            )
          : null}
      </Stack>
    </Card>
  )
}
