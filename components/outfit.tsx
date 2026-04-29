import type { Outfit as IOutfit } from '@/types/outfit';
import { cn } from '@/lib/utils';
import { OutfitItem } from './outfit-item';

interface Props {
  className?: string;
  value: IOutfit;
}

export function Outfit({ className, value }: Props) {
  return (
    <div className={cn(className, 'grid grid-cols-2 gap-2')}>
      <div className="flex flex-col gap-2">
        <OutfitItem value={value.outerwear} part="outerwear" />
        <OutfitItem value={value.midLayer} part="midLayer" />
        <OutfitItem value={value.baseLayer} part="baseLayer" />
        <OutfitItem value={value.bottom} part="bottom" />
        <OutfitItem value={value.footwear} part="footwear" />
      </div>
      <div className="flex flex-col gap-2">
        {!value.accessories.length
          ? (
              <OutfitItem value={undefined} part="accessories" />
            )
          : (
              value.accessories.map(accessory => (
                <OutfitItem key={accessory.key} value={accessory} part="accessories" />
              ))
            )}
      </div>
    </div>
  );
}
