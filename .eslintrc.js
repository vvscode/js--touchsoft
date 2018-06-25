module.exports = {
  extends: ['airbnb-base', 'prettier'],
  rules: {
    'no-var': 'off',
    'no-useless-concat': 'off',
    'prefer-destructuring': 'off',
    'prefer-arrow-callback': 'off',
    'prefer-template': 'off',
    'no-param-reassign': ['error', { props: false }],
    'object-shorthand': 'off',
<<<<<<< HEAD
    'no-plusplus': 'off'
=======
    'no-plusplus': 'off',
    'prefer-rest-params': 'off',
    'import/no-unresolved': 'off',
    'func-names': ['error', 'as-needed']
>>>>>>> f93fc5893d1fbaf3101b3af7be1a81a7043aed62
  },
  env: {
    browser: true
  }
};