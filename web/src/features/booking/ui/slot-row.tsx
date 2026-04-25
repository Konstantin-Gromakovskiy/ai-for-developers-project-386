import { Button, Group, Text } from '@mantine/core'

type SlotRowProps = {
  time: string
  statusLabel: string
  status: 'busy' | 'free'
  selected: boolean
  onSelect: () => void
}

export function SlotRow({
  time,
  statusLabel,
  status,
  selected,
  onSelect,
}: SlotRowProps) {
  const isBusy = status === 'busy'

  return (
    <Button
      color={selected ? 'accent' : 'mist'}
      disabled={isBusy}
      fullWidth
      justify="space-between"
      onClick={onSelect}
      styles={{
        root: {
          border: '1px solid var(--mantine-color-mist-2)',
          boxShadow: 'none',
          height: 'auto',
          paddingBlock: '14px',
        },
        label: {
          width: '100%',
        },
      }}
      variant={selected ? 'filled' : 'white'}
    >
      <Group justify="space-between" w="100%" wrap="nowrap">
        <Text c={selected ? 'white' : 'ink.6'} fw={selected ? 700 : 500}>
          {time}
        </Text>
        <Text c={selected ? 'white' : isBusy ? 'ink.5' : 'ink.9'} fw={700}>
          {statusLabel}
        </Text>
      </Group>
    </Button>
  )
}
