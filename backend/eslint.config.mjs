import dethdkn from '@dethdkn/eslint-config'

export default [...(await dethdkn()), {
  name: 'brayan/overrides',
  rules: {
    'no-undef': ['off'],
  },
}]
