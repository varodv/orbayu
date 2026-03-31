'use client';

import type { Location } from '@/types/geocoding';
import { LoaderCircleIcon, MapPinCheckIcon, MapPinIcon } from 'lucide-react';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useLocationSearch } from '@/hooks/use-location-search';
import { cn } from '@/lib/utils';
import { MatchingText } from './matching-text';

interface Props {
  className?: string;
  value: Location | undefined;
  onChange: (newLocation: Location) => void;
}

export function LocationPicker({ className, value, onChange }: Props) {
  const { $t } = useIntl();

  const [open, setOpen] = useState(false);

  const { query, status, data, setQuery } = useLocationSearch({
    limit: 5,
    debounce: 300,
  });

  const isShortQuery = query.trim().length < 2;

  function onSelect(location: Location) {
    onChange(location);
    setOpen(false);
    setQuery('');
  }

  return (
    <>
      <Button
        className={cn('min-w-30', className)}
        variant={!value ? 'destructive' : 'ghost'}
        onClick={() => setOpen(true)}
      >
        <MapPinIcon className="size-5" />
        {value?.name ?? $t({ id: 'location-picker.placeholder' })}
      </Button>
      <CommandDialog open={!value || open} onOpenChange={newOpen => value && setOpen(newOpen)}>
        <Command shouldFilter={false}>
          <CommandInput
            value={query}
            placeholder={$t({ id: 'location-picker.search.placeholder' })}
            onValueChange={setQuery}
          />
          <CommandList>
            {isShortQuery
              ? (
                  <CommandEmpty>{$t({ id: 'location-picker.search.help' })}</CommandEmpty>
                )
              : (
                  <>
                    {status === 'pending' && (
                      <CommandEmpty>
                        <LoaderCircleIcon className="mx-auto size-5 animate-spin" />
                      </CommandEmpty>
                    )}
                    {status === 'error' && (
                      <CommandEmpty className="text-destructive">
                        {$t({ id: 'location-picker.search.error' })}
                      </CommandEmpty>
                    )}
                    {status === 'success'
                      && (!data?.length
                        ? (
                            <CommandEmpty>
                              {$t({ id: 'location-picker.search.empty' })}
                            </CommandEmpty>
                          )
                        : (
                            <CommandGroup>
                              {data.map(location => (
                                <CommandItem key={location.id} onSelect={() => onSelect(location)}>
                                  {location.id === value?.id
                                    ? (
                                        <MapPinCheckIcon className="size-5" />
                                      )
                                    : (
                                        <MapPinIcon className="size-5" />
                                      )}
                                  <span className="truncate">
                                    <MatchingText text={location.name} match={query} />
                                    {' '}
                                    <span className="text-muted-foreground text-xs">
                                      {[location.region, location.country]
                                        .filter(Boolean)
                                        .join(', ')}
                                    </span>
                                  </span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          ))}
                  </>
                )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
