import type { OutfitItem as IOutfitItem, Outfit } from '@/types/outfit';
import { useIntl } from 'react-intl';
import { Item, ItemContent, ItemDescription, ItemTitle } from './ui/item';

interface Props {
  className?: string;
  part: keyof Outfit;
  item?: IOutfitItem<string>;
}

export function OutfitItem({ className, part, item }: Props) {
  const { $t } = useIntl();

  return (
    <Item className={className} variant="muted">
      <ItemContent>
        <ItemTitle className={!item ? 'text-muted-foreground' : ''}>
          {$t({ id: `outfit.item.${item?.key ?? 'none'}` })}
        </ItemTitle>
        <ItemDescription>{$t({ id: `outfit.part.${part}` })}</ItemDescription>
      </ItemContent>
    </Item>
  );
}
