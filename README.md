# my-vue-app

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Nightwatch](https://nightwatchjs.org/)

```sh
# When using CI, the project must be built first.
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chrome
npm run test:e2e -- --env chrome
# Runs the tests of a specific file
npm run test:e2e -- tests/e2e/example.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```
    
### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```



# todo
## functionality
- 3rd party embedding
  - main page
  - course pages
  - ★
    - U+2605
  - ⯨
    - U+2BE8
  - ☆
    - U+2606
~~pop ups after button clicks to show it happened~~
~~rewrite all post requests~~

## stretch goals
### easy
- faq page
- Page with all courses that have reviews or ratings
- chartjs for stats of tracking
- check on add page if user already has a review for that course
- make pop ups look better

### harder
- saving non submitted reviews for later
  - localstorage with course id
- better search: https://github.com/farzher/fuzzysort
- animations
- usage tracking



no foreign key of user on course_eval_map
  needs a check on every query if user exists / add user to db
  only on add review, add rating (could be fine)

requested changes

logging still needs to be done

Done:

remove from users:
  logged out
  deactivated
  user_name

after review edit:
 if published
  set old_review to current_review
  set current_review to new review
if not published
  set current_review to new review

Uniqueness on eval_id on table ratings and reviews
unique (user_id, course_id) on table course_eval_map



doing right now:
~~submitting requested changes doesnt work~~
~~resubmiting rejected doesnt work~~\
~~resubmit then click edit, old review is shown\~~
~~on top still says rejected~~

~~clear search once used~~ works somewhat, only clears once you click away

~~check if eval_map gets deleted if both review and rating are deleted~~
~~check if edit review after review was deleted works~~

~~clear after add submit~~

~~clear text after review Delete~~

~~clear whole thing after rating or review delete if all gone (a bit harder)~~
~~pass reload function to review and rating?~~