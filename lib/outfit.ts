import type { ComputedForecast } from '@/types/forecast';
import type { Outfit, OutfitItem } from '@/types/outfit';

interface ConditionedOutfitItem<Type extends OutfitItem<string>> {
  key: Type['key'];
  when: ORCondition;
}

type ORCondition = Array<ANDCondition>;

type ANDCondition = Array<Condition>;

type Condition = | {
  variable: 'temperature';
  ranges: Array<ComputedForecast<string | Date>['temperature']['range']>;
} | {
  variable: 'temperature_delta';
  ranges: Array<ComputedForecast<string | Date>['temperature_delta']['range']>;
} | {
  variable: 'precipitation';
  ranges: Array<ComputedForecast<string | Date>['precipitation']['range']>;
} | {
  variable: 'precipitation_probability';
  ranges: Array<ComputedForecast<string | Date>['precipitation_probability']['range']>;
} | {
  variable: 'snowfall';
  ranges: Array<ComputedForecast<string | Date>['snowfall']['range']>;
} | {
  variable: 'wind_speed';
  ranges: Array<ComputedForecast<string | Date>['wind_speed']['range']>;
} | {
  variable: 'uv_index';
  ranges: Array<ComputedForecast<string | Date>['uv_index']['range']>;
};

const RAINY_CONDITION: ANDCondition = [
  {
    variable: 'precipitation',
    ranges: ['MODERATE', 'HEAVY', 'EXTREME'],
  },
  {
    variable: 'precipitation_probability',
    ranges: ['MEDIUM', 'HIGH', 'ABSOLUTE'],
  },
];

const SNOWY_CONDITION: ANDCondition = [
  {
    variable: 'snowfall',
    ranges: ['LIGHT', 'MODERATE', 'HEAVY', 'EXTREME'],
  },
];

const CONDITIONED_BASE_LAYERS: Array<ConditionedOutfitItem<Outfit['baseLayer']>> = [
  {
    key: 'thermal-top',
    when: [
      [
        {
          variable: 'temperature',
          ranges: ['EXTREME_COLD', 'VERY_COLD'],
        },
      ],
    ],
  },
  {
    key: 'long-sleeve',
    when: [
      [
        {
          variable: 'temperature',
          ranges: ['COLD', 'COOL'],
        },
      ],
    ],
  },
  {
    key: 't-shirt',
    when: [
      [
        {
          variable: 'temperature',
          ranges: ['MILD', 'COMFORTABLE', 'WARM'],
        },
      ],
    ],
  },
  {
    key: 'tank-top',
    when: [
      [
        {
          variable: 'temperature',
          ranges: ['HOT', 'VERY_HOT', 'EXTREME_HEAT'],
        },
      ],
    ],
  },
];

const CONDITIONED_MID_LAYERS: Array<ConditionedOutfitItem<Exclude<Outfit['midLayer'], undefined>>>
  = [
    {
      key: 'heavy-sweater',
      when: [
        [
          {
            variable: 'temperature',
            ranges: ['EXTREME_COLD', 'VERY_COLD'],
          },
        ],
      ],
    },
    {
      key: 'hoodie',
      when: [
        [
          {
            variable: 'temperature',
            ranges: ['COLD', 'COOL'],
          },
        ],
      ],
    },
    {
      key: 'light-sweater',
      when: [
        [
          {
            variable: 'temperature',
            ranges: ['MILD'],
          },
        ],
        [
          {
            variable: 'temperature',
            ranges: ['COMFORTABLE'],
          },
          {
            variable: 'temperature_delta',
            ranges: ['MILD', 'LARGE', 'EXTREME'],
          },
        ],
      ],
    },
  ];

const CONDITIONED_OUTERWEAR: Array<ConditionedOutfitItem<Exclude<Outfit['outerwear'], undefined>>>
  = [
    {
      key: 'rain-jacket',
      when: [RAINY_CONDITION],
    },
    {
      key: 'winter-coat',
      when: [
        [
          {
            variable: 'temperature',
            ranges: ['EXTREME_COLD', 'VERY_COLD', 'COLD', 'COOL'],
          },
        ],
      ],
    },
    {
      key: 'light-jacket',
      when: [
        [
          {
            variable: 'temperature',
            ranges: ['MILD'],
          },
        ],
      ],
    },
    {
      key: 'windbreaker',
      when: [
        [
          {
            variable: 'wind_speed',
            ranges: ['MODERATE', 'HEAVY', 'EXTREME'],
          },
        ],
      ],
    },
  ];

const CONDITIONED_BOTTOMS: Array<ConditionedOutfitItem<Outfit['bottom']>> = [
  {
    key: 'thermal-pants',
    when: [
      [
        {
          variable: 'temperature',
          ranges: ['EXTREME_COLD', 'VERY_COLD'],
        },
      ],
    ],
  },
  {
    key: 'heavy-trousers',
    when: [
      [
        {
          variable: 'temperature',
          ranges: ['COLD', 'COOL'],
        },
      ],
    ],
  },
  {
    key: 'light-trousers',
    when: [
      [
        {
          variable: 'temperature',
          ranges: ['MILD', 'COMFORTABLE'],
        },
      ],
    ],
  },
  {
    key: 'shorts',
    when: [
      [
        {
          variable: 'temperature',
          ranges: ['WARM', 'HOT', 'VERY_HOT', 'EXTREME_HEAT'],
        },
      ],
    ],
  },
];

const CONDITIONED_FOOTWEAR: Array<ConditionedOutfitItem<Outfit['footwear']>> = [
  {
    key: 'snow-boots',
    when: [SNOWY_CONDITION],
  },
  {
    key: 'rain-boots',
    when: [RAINY_CONDITION],
  },
  {
    key: 'boots',
    when: [
      [
        {
          variable: 'temperature',
          ranges: ['EXTREME_COLD', 'VERY_COLD', 'COLD', 'COOL'],
        },
      ],
    ],
  },
  {
    key: 'sneakers',
    when: [
      [
        {
          variable: 'temperature',
          ranges: ['MILD', 'COMFORTABLE'],
        },
      ],
    ],
  },
  {
    key: 'sandals',
    when: [
      [
        {
          variable: 'temperature',
          ranges: ['WARM', 'HOT', 'VERY_HOT', 'EXTREME_HEAT'],
        },
      ],
    ],
  },
];

const CONDITIONED_ACCESSORIES: Array<ConditionedOutfitItem<Outfit['accessories'][number]>> = [
  {
    key: 'beanie',
    when: [
      [
        {
          variable: 'temperature',
          ranges: ['EXTREME_COLD', 'VERY_COLD', 'COLD'],
        },
      ],
    ],
  },
  {
    key: 'scarf',
    when: [
      [
        {
          variable: 'temperature',
          ranges: ['EXTREME_COLD', 'VERY_COLD', 'COLD'],
        },
      ],
    ],
  },
  {
    key: 'gloves',
    when: [
      [
        {
          variable: 'temperature',
          ranges: ['EXTREME_COLD', 'VERY_COLD'],
        },
      ],
      SNOWY_CONDITION,
    ],
  },
  {
    key: 'umbrella',
    when: [
      [
        ...RAINY_CONDITION,
        {
          variable: 'wind_speed',
          ranges: ['NONE', 'LIGHT'],
        },
      ],
    ],
  },
  {
    key: 'sunglasses',
    when: [
      [
        {
          variable: 'uv_index',
          ranges: ['MEDIUM', 'HIGH', 'VERY_HIGH', 'EXTREME'],
        },
      ],
    ],
  },
  {
    key: 'sunscreen',
    when: [
      [
        {
          variable: 'uv_index',
          ranges: ['HIGH', 'VERY_HIGH', 'EXTREME'],
        },
      ],
    ],
  },
];

export function getOutfit<DateType extends string | Date>(
  data: ComputedForecast<DateType>,
): Outfit {
  return {
    baseLayer: getBaseLayer(data),
    midLayer: getMidLayer(data),
    outerwear: getOuterwear(data),
    bottom: getBottom(data),
    footwear: getFootwear(data),
    accessories: getAccessories(data),
  };
}

function getBaseLayer<DateType extends string | Date>(data: ComputedForecast<DateType>) {
  return getMatchingOutfitItems(data, CONDITIONED_BASE_LAYERS)[0];
}

function getMatchingOutfitItems<DateType extends string | Date, Type extends OutfitItem<string>>(
  data: ComputedForecast<DateType>,
  conditionedOutfitItems: Array<ConditionedOutfitItem<Type>>,
) {
  return conditionedOutfitItems.reduce<Array<Type>>((result, item) => {
    const matchingConditions = item.when.filter(conditions =>
      conditions.every(condition =>
        (condition.ranges as Array<string>).includes(data[condition.variable].range),
      ),
    );
    if (matchingConditions.length) {
      const variables = Array.from(
        new Set(
          matchingConditions.flatMap(conditions =>
            conditions.map(currentCondition => currentCondition.variable),
          ),
        ),
      );
      result.push({
        key: item.key,
        variables,
      } as Type);
    }
    return result;
  }, []);
}

function getMidLayer<DateType extends string | Date>(data: ComputedForecast<DateType>) {
  return getMatchingOutfitItems(data, CONDITIONED_MID_LAYERS)[0];
}

function getOuterwear<DateType extends string | Date>(data: ComputedForecast<DateType>) {
  return getMatchingOutfitItems(data, CONDITIONED_OUTERWEAR)[0];
}

function getBottom<DateType extends string | Date>(data: ComputedForecast<DateType>) {
  return getMatchingOutfitItems(data, CONDITIONED_BOTTOMS)[0];
}

function getFootwear<DateType extends string | Date>(data: ComputedForecast<DateType>) {
  return getMatchingOutfitItems(data, CONDITIONED_FOOTWEAR)[0];
}

function getAccessories<DateType extends string | Date>(data: ComputedForecast<DateType>) {
  return getMatchingOutfitItems(data, CONDITIONED_ACCESSORIES);
}
