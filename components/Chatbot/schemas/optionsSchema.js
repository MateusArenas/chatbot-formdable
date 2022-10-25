export default [
  {
    key: 'id',
    types: ['string', 'number'],
    required: true,
  },
  {
    key: 'title',
    types: ['string'],
    required: false,
  },
  {
    key: 'type',
    types: ['string'], // default or multiple or unique
    required: false,
  },  
  {
    key: 'scape',
    types: ['object'],
    required: false,
  },
  {
    key: 'trigger',
    types: ['string', 'number', 'function'],
    required: false,
  },
  {
    key: 'options',
    types: ['object'],
    required: true,
  },
  {
    key: 'end',
    types: ['boolean'],
    required: false,
  },
  {
    key: 'inputAttributes',
    types: ['object'],
    required: false,
  },
  {
    key: 'metadata',
    types: ['object'],
    required: false,
  },
];
