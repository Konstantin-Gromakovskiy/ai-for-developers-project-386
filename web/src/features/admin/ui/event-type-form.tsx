'use client'

import { Button, Group, NumberInput, Stack, Switch, TextInput, Textarea } from '@mantine/core'
import { Controller, useForm } from 'react-hook-form'
import { useEffect } from 'react'

export type EventTypeFormValues = {
  title: string
  description: string
  durationMinutes: number
  isActive: boolean
}

type EventTypeFormProps = {
  cancelLabel?: string
  defaultValues: EventTypeFormValues
  guestDescriptionLabel: string
  guestDescriptionPlaceholder: string
  isPending?: boolean
  isSubmitDisabled?: boolean
  onCancel?: () => void
  onSubmit: (values: EventTypeFormValues) => void | Promise<void>
  titleRequiredMessage: string
  durationMinMessage: string
  durationRequiredMessage: string
  statusLabel: string
  submitLabel: string
  titleLabel: string
  titlePlaceholder: string
  durationLabel: string
}

export function EventTypeForm({
  cancelLabel,
  defaultValues,
  durationMinMessage,
  guestDescriptionLabel,
  guestDescriptionPlaceholder,
  isPending = false,
  isSubmitDisabled = false,
  onCancel,
  onSubmit,
  titleRequiredMessage,
  durationRequiredMessage,
  statusLabel,
  submitLabel,
  titleLabel,
  titlePlaceholder,
  durationLabel,
}: EventTypeFormProps) {
  const form = useForm<EventTypeFormValues>({
    defaultValues,
  })

  useEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues, form])

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Stack gap="md">
        <TextInput
          error={form.formState.errors.title?.message}
          label={titleLabel}
          placeholder={titlePlaceholder}
          {...form.register('title', {
            required: titleRequiredMessage,
            validate: value => value.trim().length > 0 || titleRequiredMessage,
          })}
        />

        <Textarea
          autosize
          label={guestDescriptionLabel}
          minRows={4}
          placeholder={guestDescriptionPlaceholder}
          {...form.register('description')}
        />

        <Controller
          control={form.control}
          name="durationMinutes"
          rules={{
            min: { value: 5, message: durationMinMessage },
            required: durationRequiredMessage,
          }}
          render={({ field, fieldState }) => (
            <NumberInput
              error={fieldState.error?.message}
              label={durationLabel}
              min={5}
              step={5}
              value={field.value}
              onBlur={field.onBlur}
              onChange={value => field.onChange(typeof value === 'number' ? value : 0)}
            />
          )}
        />

        <Controller
          control={form.control}
          name="isActive"
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
          <Button loading={isPending} type="submit" disabled={isSubmitDisabled}>
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
