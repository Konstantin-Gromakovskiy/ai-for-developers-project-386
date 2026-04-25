'use client'

import { Button, Group, Stack, Switch, TextInput } from '@mantine/core'
import { Controller, useForm } from 'react-hook-form'
import { useEffect } from 'react'

export type OverrideFormValues = {
  startUtc: string
  endUtc: string
  isAvailable: boolean
}

type OverrideFormProps = {
  cancelLabel?: string
  defaultValues: OverrideFormValues
  endLabel: string
  endPlaceholder: string
  invalidRangeMessage: string
  isPending?: boolean
  onCancel?: () => void
  onSubmit: (values: OverrideFormValues) => void | Promise<void>
  requiredMessage: string
  startLabel: string
  startPlaceholder: string
  statusLabel: string
  submitLabel: string
}

export function OverrideForm({
  cancelLabel,
  defaultValues,
  endLabel,
  endPlaceholder,
  invalidRangeMessage,
  isPending = false,
  onCancel,
  onSubmit,
  requiredMessage,
  startLabel,
  startPlaceholder,
  statusLabel,
  submitLabel,
}: OverrideFormProps) {
  const form = useForm<OverrideFormValues>({
    defaultValues,
  })

  useEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues, form])

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Stack gap="md">
        <Controller
          control={form.control}
          name="startUtc"
          rules={{ required: requiredMessage }}
          render={({ field, fieldState }) => (
            <TextInput
              error={fieldState.error?.message}
              label={startLabel}
              onBlur={field.onBlur}
              onChange={field.onChange}
              placeholder={startPlaceholder}
              type="datetime-local"
              value={field.value}
            />
          )}
        />

        <Controller
          control={form.control}
          name="endUtc"
          rules={{
            required: requiredMessage,
            validate: (value, formValues) => {
              if (!formValues.startUtc || !value) {
                return requiredMessage
              }

              return value > formValues.startUtc || invalidRangeMessage
            },
          }}
          render={({ field, fieldState }) => (
            <TextInput
              error={fieldState.error?.message}
              label={endLabel}
              onBlur={field.onBlur}
              onChange={field.onChange}
              placeholder={endPlaceholder}
              type="datetime-local"
              value={field.value}
            />
          )}
        />

        <Controller
          control={form.control}
          name="isAvailable"
          render={({ field }) => (
            <Switch
              checked={field.value}
              label={statusLabel}
              onBlur={field.onBlur}
              onChange={event => field.onChange(event.currentTarget.checked)}
            />
          )}
        />

        <Group>
          <Button loading={isPending} type="submit">
            {submitLabel}
          </Button>
          {onCancel && cancelLabel
            ? (
                <Button color="ink" onClick={onCancel} type="button" variant="light">
                  {cancelLabel}
                </Button>
              )
            : null}
        </Group>
      </Stack>
    </form>
  )
}
