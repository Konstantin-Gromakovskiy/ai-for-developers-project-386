'use client'

import { Button, Card, Group, NativeSelect, Stack, TextInput } from '@mantine/core'
import { Controller, type Control, type FieldErrors } from 'react-hook-form'

type AvailabilityRuleRowProps = {
  control: Control<{
    timezone: string
    weeklyRules: Array<{
      dayOfWeek: string
      startLocalTime: string
      endLocalTime: string
    }>
  }>
  dayOptions: Array<{ label: string, value: string }>
  dayLabel: string
  endLabel: string
  endPlaceholder: string
  errors: FieldErrors<{
    timezone: string
    weeklyRules: Array<{
      dayOfWeek: string
      startLocalTime: string
      endLocalTime: string
    }>
  }>
  index: number
  onRemove: () => void
  removeLabel: string
  requiredMessage: string
  startLabel: string
  startPlaceholder: string
  invalidRangeMessage: string
}

export function AvailabilityRuleRow({
  control,
  dayLabel,
  dayOptions,
  endLabel,
  endPlaceholder,
  errors,
  index,
  invalidRangeMessage,
  onRemove,
  removeLabel,
  requiredMessage,
  startLabel,
  startPlaceholder,
}: AvailabilityRuleRowProps) {
  const ruleError = errors.weeklyRules?.[index]

  return (
    <Card bg="mist.1" padding="md" shadow="none" withBorder={false}>
      <Stack gap="md">
        <Group align="flex-start" grow>
          <Controller
            control={control}
            name={`weeklyRules.${index}.dayOfWeek`}
            rules={{ required: requiredMessage }}
            render={({ field }) => (
              <NativeSelect
                data={dayOptions}
                error={ruleError?.dayOfWeek?.message}
                label={dayLabel}
                onBlur={field.onBlur}
                onChange={field.onChange}
                value={field.value}
              />
            )}
          />
        </Group>

        <Group align="flex-start" grow>
          <Controller
            control={control}
            name={`weeklyRules.${index}.startLocalTime`}
            rules={{ required: requiredMessage }}
            render={({ field }) => (
              <TextInput
                error={ruleError?.startLocalTime?.message}
                label={startLabel}
                onBlur={field.onBlur}
                onChange={field.onChange}
                placeholder={startPlaceholder}
                type="time"
                value={field.value}
              />
            )}
          />

          <Controller
            control={control}
            name={`weeklyRules.${index}.endLocalTime`}
            rules={{
              required: requiredMessage,
              validate: (value, formValues) => {
                const startValue = formValues.weeklyRules[index]?.startLocalTime

                if (!startValue || !value) {
                  return requiredMessage
                }

                return value > startValue || invalidRangeMessage
              },
            }}
            render={({ field }) => (
              <TextInput
                error={ruleError?.endLocalTime?.message}
                label={endLabel}
                onBlur={field.onBlur}
                onChange={field.onChange}
                placeholder={endPlaceholder}
                type="time"
                value={field.value}
              />
            )}
          />
        </Group>

        <Group justify="flex-end">
          <Button color="red" onClick={onRemove} type="button" variant="light">
            {removeLabel}
          </Button>
        </Group>
      </Stack>
    </Card>
  )
}
