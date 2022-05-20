export const CategoriesSampleData = [
  {
    title: 'a',
    parent: null,
  },
  {
    title: 'b',
    parent: 'd',
    discount: {
      type: 'percent',
      value: 0.2,
    },
  },
  {
    title: 'c',
    parent: 'b',
  },
  {
    title: 'd',
    parent: 'a',
    discount: {
      type: 'percent',
      value: 0.05,
    },
  },
  {
    title: 'e',
    parent: 'b',
  },
  {
    title: 'g',
    parent: 'a',
  },
  {
    title: 'v',
    parent: 'g',
  },
];
