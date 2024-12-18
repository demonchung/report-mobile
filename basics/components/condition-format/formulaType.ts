export const formulaOptions = [
  {
    label: ">",
    value: "Above",
  },
  {
    label: "≥",
    value: "NotBelow"
  },
  {
    label: "<",
    value: "Below"
  },
  {
    label: "≤",
    value: "NotAbove"
  },
  {
    label: "=",
    value: "Equal"
  },
  {
    label: "≠",
    value: "NotEqual"
  },
  {
    label: "范围",
    value: "range",
    children: [
      {
        label: "<, <",
        value: "BelowBelow"
      },
      {
        label: "<, ≤",
        value: "BelowNotAbove"
      },
      {
        label: "≤, <",
        value: "NotAboveBelow"
      },
      {
        label: "≤, ≤",
        value: "NotAboveNotAbove"
      }
    ]
  }
];

export const stringFormulas = [
  {
    label: "等于",
    value: "Equal",
  },
  {
    label: "不等于",
    value: "NotEqual"
  },
  {
    label: "包含",
    value: "In"
  },
  {
    label: "不包含",
    value: "NotIn"
  },
  {
    label: "为空",
    value: "None"
  },
  {
    label: "不为空",
    value: "NotNone"
  }
];

export const rangeType = ['BelowBelow','BelowNotAbove','NotAboveBelow','NotAboveNotAbove'];
