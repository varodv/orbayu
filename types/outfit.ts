export interface Outfit {
  baseLayer: BaseLayer;
  midLayer?: MidLayer;
  outerwear?: Outerwear;
  bottom: Bottom;
  footwear: Footwear;
  accessories: Array<Accessory>;
}

type BaseLayer = 'thermal-top' | 'long-sleeve' | 't-shirt' | 'tank-top';

type MidLayer = 'heavy-sweater' | 'hoodie' | 'light-sweater';

type Outerwear = 'winter-coat' | 'light-jacket' | 'rain-jacket' | 'windbreaker';

type Bottom = 'thermal-pants' | 'heavy-trousers' | 'light-trousers' | 'shorts';

type Footwear = 'boots' | 'sneakers' | 'sandals' | 'rain-boots' | 'snow-boots';

type Accessory = 'beanie' | 'scarf' | 'gloves' | 'umbrella' | 'sunglasses' | 'sunscreen';
