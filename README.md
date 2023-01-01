# Get Started with Dai Tol

## Init package development

```sh
  npm init
  yarn add -D typescript
  yarn tsc --init

  npm adduser

  # make sure to build the ts first
  npm run build

  # publish the build to npm repo
  npm publish

  # bump a new version
  npm version patch
```

## Requirement

You might face this error when compiling the ts script:

```js
TypeError: Class constructor cannot be invoked without 'new'

```

The error occurs when the target property in tsconfig.json is set to lower than es6 or you instantiate a class without the new operator.
