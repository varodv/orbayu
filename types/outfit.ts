import type { ComputedForecast } from './forecast';

export interface Outfit {
  baseLayer: OutfitItem<BaseLayer>;
  midLayer?: OutfitItem<MidLayer>;
  outerwear?: OutfitItem<Outerwear>;
  bottom: OutfitItem<Bottom>;
  footwear: OutfitItem<Footwear>;
  accessories: Array<OutfitItem<Accessory>>;
}

export interface OutfitItem<KeyType extends string> {
  key: KeyType;
  variables: Array<Exclude<keyof ComputedForecast<string | Date>, 'time'>>;
}

type BaseLayer = 'thermal-top' | 'long-sleeve' | 't-shirt' | 'tank-top';

type MidLayer = 'heavy-sweater' | 'hoodie' | 'light-sweater';

type Outerwear = 'winter-coat' | 'light-jacket' | 'rain-jacket' | 'windbreaker';

type Bottom = 'thermal-pants' | 'heavy-trousers' | 'light-trousers' | 'shorts';

type Footwear = 'boots' | 'sneakers' | 'sandals' | 'rain-boots' | 'snow-boots';

type Accessory = 'beanie' | 'scarf' | 'gloves' | 'umbrella' | 'sunglasses' | 'sunscreen';
