import type { OutfitItem as IOutfitItem, Outfit } from '@/types/outfit';
import { useIntl } from 'react-intl';
import { Item, ItemContent, ItemDescription, ItemTitle } from './ui/item';

interface Props {
  className?: string;
  value?: IOutfitItem<string>;
  part: keyof Outfit;
}

export function OutfitItem({ className, value, part }: Props) {
  const { $t } = useIntl();

  return (
    <Item className={className} variant="muted">
      <ItemContent>
        <ItemTitle className={!value ? 'text-muted-foreground' : ''}>
          {$t({ id: `outfit.item.${value?.key ?? 'none'}` })}
        </ItemTitle>
        <ItemDescription>{$t({ id: `outfit.part.${part}` })}</ItemDescription>
      </ItemContent>
    </Item>
  );
}
