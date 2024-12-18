import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";
/**
 * 数据限制
 * [[[0],[1]],[[2],[3]]] 表示0维0指标及0维1指标，1维0指标及1维1指标
 */
export const chartDMLimit = [
  [
    [
      ElementType.BAR,
      ElementType.LINE,
      ElementType.PIE,
      ElementType.RADAR,
      ElementType.TABLE,
      ElementType.CROSSTABLE,
      ElementType.CARD,
      ElementType.GAUGE,
      ElementType.FUNNEL,
      ElementType.SCATTER,
      ElementType.BIAX,
      ElementType.MAP,
      ElementType.PROGRESSBAR,
      ElementType.FUNNELCOMPARE,
      ElementType.PERCENTPILEBAR,
      ElementType.PERCENTPILESTRIPE
    ],
    [
      ElementType.BAR,
      ElementType.LINE,
      ElementType.PIE,
      ElementType.RADAR,
      ElementType.TABLE,
      ElementType.CROSSTABLE,
      ElementType.CARD,
      ElementType.GAUGE,

      ElementType.PROGRESSBAR,
      ElementType.FUNNELCOMPARE,
      ElementType.PERCENTPILEBAR,
      ElementType.PERCENTPILESTRIPE,
      ElementType.FUNNEL,
      ElementType.SCATTER,
      ElementType.BIAX,
      ElementType.MAP
    ],
    [
      ElementType.BAR,
      ElementType.LINE,
      ElementType.RADAR,
      ElementType.TABLE,
      ElementType.CROSSTABLE,
      ElementType.PROGRESSBAR,
      ElementType.SCATTER,
      ElementType.BIAX,
      ElementType.FUNNELCOMPARE,
      ElementType.PERCENTPILEBAR,
      ElementType.PERCENTPILESTRIPE
    ],
    [
      ElementType.BAR,
      ElementType.LINE,
      ElementType.RADAR,
      ElementType.TABLE,
      ElementType.CROSSTABLE,
      ElementType.PROGRESSBAR,
      ElementType.SCATTER,
      ElementType.BIAX,
      ElementType.MAP,
      ElementType.FUNNELCOMPARE,
      ElementType.PERCENTPILEBAR,
      ElementType.PERCENTPILESTRIPE
    ]
  ],
  [
    [
      ElementType.BAR,
      ElementType.LINE,
      ElementType.PIE,
      ElementType.RADAR,
      ElementType.TABLE,
      ElementType.CROSSTABLE,
      ElementType.CARD,
      ElementType.FUNNEL,
      ElementType.SCATTER,
      ElementType.BIAX,
      ElementType.MAP,
      ElementType.PROGRESSBAR,
      ElementType.FUNNELCOMPARE,
      ElementType.PERCENTPILEBAR,
      ElementType.PERCENTPILESTRIPE
    ],
    [
      ElementType.BAR,
      ElementType.LINE,
      ElementType.PIE,
      ElementType.RADAR,
      ElementType.TABLE,
      ElementType.CROSSTABLE,
      ElementType.CARD,
      ElementType.FUNNEL,
      ElementType.SCATTER,
      ElementType.BIAX,
      ElementType.MAP,
      ElementType.PROGRESSBAR,
      ElementType.FUNNELCOMPARE,
      ElementType.PERCENTPILEBAR,
      ElementType.PERCENTPILESTRIPE
    ],
    [
      ElementType.BAR,
      ElementType.LINE,
      ElementType.RADAR,
      ElementType.TABLE,
      ElementType.CROSSTABLE,
      ElementType.PROGRESSBAR,
      ElementType.SCATTER,
      ElementType.BIAX,
      ElementType.FUNNELCOMPARE,
      ElementType.PERCENTPILEBAR,
      ElementType.PERCENTPILESTRIPE
    ],
    [
      ElementType.BAR,
      ElementType.LINE,
      ElementType.RADAR,
      ElementType.TABLE,
      ElementType.CROSSTABLE,
      ElementType.PROGRESSBAR,
      ElementType.SCATTER,
      ElementType.BIAX,
      ElementType.FUNNELCOMPARE,
      ElementType.PERCENTPILEBAR,
      ElementType.PERCENTPILESTRIPE
    ],
    [
      ElementType.BAR,
      ElementType.LINE,
      ElementType.PROGRESSBAR,
      ElementType.RADAR,
      ElementType.TABLE,
      ElementType.CROSSTABLE,
      ElementType.BIAX,
      ElementType.PROGRESSBAR,
      ElementType.FUNNELCOMPARE,
      ElementType.PERCENTPILEBAR,
      ElementType.PERCENTPILESTRIPE
    ]
  ],
  [
    [
      ElementType.BAR,
      ElementType.LINE,
      ElementType.RADAR,
      ElementType.TABLE,
      ElementType.CROSSTABLE,
      ElementType.SCATTER,
      ElementType.BIAX
    ],
    [
      ElementType.BAR,
      ElementType.LINE,
      ElementType.RADAR,
      ElementType.TABLE,
      ElementType.CROSSTABLE,
      ElementType.SCATTER,
      ElementType.BIAX
    ],
    [ElementType.TABLE, ElementType.CROSSTABLE, ElementType.SCATTER],
    [ElementType.TABLE, ElementType.CROSSTABLE, ElementType.SCATTER],
    [ElementType.TABLE, ElementType.CROSSTABLE]
  ],
  [
    [ElementType.TABLE, ElementType.CROSSTABLE],
    [ElementType.TABLE, ElementType.CROSSTABLE],
    [ElementType.TABLE, ElementType.CROSSTABLE],
    [ElementType.TABLE, ElementType.CROSSTABLE]
  ]
];

/**
 * 图表类型限制映射
 * 区别于chartDMLimit，该映射用于图表类型切换时的限制, 因为chartDMLimit不包含所有图表类型, 部分图表不包含(在右上角的图表类型切换按钮中)
 * [
 * [[0维0指标], [0维1指标], [0维2指标], [0维多指标]...],
 * [[1维0指标], [1维1指标], [1维2指标], [1维多指标]...],
 * [[2维0指标], [2维1指标], [2维2指标], [2维多指标]...],
 * [[多维0指标], [多维1指标], [多维2指标], [多维多指标]...]
 * ]
 */
export const allChartDMLimit = [
  [
    [],
    [
      ElementType.CARD,
      ElementType.GAUGE,
      ElementType.PROGRESSBAR,
    ],
    [
      ElementType.CARD,
      ElementType.PROGRESSBAR,
    ],
    [
      ElementType.CARD,
      ElementType.PROGRESSBAR,
    ]
  ],
  [
    [],
    [
      ElementType.BAR,
      ElementType.STRIPE,
      ElementType.PILEBAR,
      ElementType.LINE,
      ElementType.AREA,
      ElementType.PIE,
      ElementType.RADAR,
      ElementType.TABLE,
      ElementType.CROSSTABLE,
      ElementType.CARD,
      ElementType.FUNNEL,
      ElementType.BIAX,
      ElementType.MAP,
      ElementType.PROGRESSBAR,
      ElementType.FUNNELCOMPARE
    ],
    [
      ElementType.BAR,
      ElementType.STRIPE,
      ElementType.PILEBAR,
      ElementType.LINE,
      ElementType.AREA,
      ElementType.RADAR,
      ElementType.TABLE,
      ElementType.CROSSTABLE,
      ElementType.SCATTER,
      ElementType.BIAX,
      ElementType.PROGRESSBAR,
      ElementType.FUNNELCOMPARE
    ],
    [
      ElementType.BAR,
      ElementType.STRIPE,
      ElementType.PILEBAR,
      ElementType.LINE,
      ElementType.AREA,
      ElementType.RADAR,
      ElementType.TABLE,
      ElementType.CROSSTABLE,
      ElementType.SCATTER,
      ElementType.BIAX,
      ElementType.PROGRESSBAR,
      ElementType.FUNNELCOMPARE
    ],
    [
      ElementType.BAR,
      ElementType.STRIPE,
      ElementType.PILEBAR,
      ElementType.LINE,
      ElementType.AREA,
      ElementType.RADAR,
      ElementType.TABLE,
      ElementType.CROSSTABLE,
      ElementType.BIAX,
      ElementType.PROGRESSBAR,
      ElementType.FUNNELCOMPARE
    ]
  ],
  [
    [],
    [
      ElementType.BAR,
      ElementType.STRIPE,
      ElementType.PILEBAR,
      ElementType.LINE,
      ElementType.AREA,
      ElementType.RADAR,
      ElementType.TABLE,
      ElementType.CROSSTABLE,
      ElementType.BIAX,
    ],
    [ElementType.TABLE, ElementType.CROSSTABLE, ElementType.SCATTER],
    [ElementType.TABLE, ElementType.CROSSTABLE, ElementType.SCATTER],
    [ElementType.TABLE, ElementType.CROSSTABLE]
  ],
  [
    [],
    [ElementType.TABLE, ElementType.CROSSTABLE],
    [ElementType.TABLE, ElementType.CROSSTABLE],
    [ElementType.TABLE, ElementType.CROSSTABLE]
  ]
];