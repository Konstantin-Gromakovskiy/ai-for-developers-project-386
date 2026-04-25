import Link from 'next/link'

import { Button, Card, Stack, Text, Title } from '@mantine/core'

type AdminSectionCardProps = {
  href: string
  title: string
  description: string
  actionLabel: string
}

export function AdminSectionCard({
  href,
  title,
  description,
  actionLabel,
}: AdminSectionCardProps) {
  return (
    <Card h="100%">
      <Stack gap="lg" h="100%" justify="space-between">
        <Stack gap="sm">
          <Title c="ink.9" order={3}>
            {title}
          </Title>
          <Text c="ink.5" fz="lg" lh={1.55}>
            {description}
          </Text>
        </Stack>

        <Link href={href} style={{ textDecoration: 'none' }}>
          <Button color="ink" fullWidth variant="light">
            {actionLabel}
          </Button>
        </Link>
      </Stack>
    </Card>
  )
}
