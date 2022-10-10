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
    key: 'feature',
    types: ['boolean'],
    required: false,
  },  
  {
    key: 'multiple',
    types: ['boolean'],
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
