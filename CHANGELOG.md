# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 1.0.0 (2022-09-22)


### Features

* add GA4 and load it using partytown in web worker ([ae6a70c](https://github.com/RofiSyahrul/katlaisasi/commit/ae6a70c5e7b14f83dd80d9cf2a44fa4aacc8c1f4))
* add invite others button ([35a4dfa](https://github.com/RofiSyahrul/katlaisasi/commit/35a4dfa29ac8052305d81b5853ee887d4b33a7fe))
* add user name to user's state ([b22d6a5](https://github.com/RofiSyahrul/katlaisasi/commit/b22d6a52c356dc8f6d1af26591406392f1b090be))
* add user's name validation ([036e5c2](https://github.com/RofiSyahrul/katlaisasi/commit/036e5c20a30cd0520ef53a1f12217ff522d92dfa))
* create entry point from homepage to game room ([d599a12](https://github.com/RofiSyahrul/katlaisasi/commit/d599a12e51bd50c45ea1d883b5d82d2082364315))
* create guess board card and game room ([94e05c3](https://github.com/RofiSyahrul/katlaisasi/commit/94e05c31ded251c66b3f1314e3b9d0c1a2b23d7b))
* create Keyboard component and initiate game room functionality ([b953227](https://github.com/RofiSyahrul/katlaisasi/commit/b953227edeffd65232502472043418af70283246))
* create notices and snackbar components ([16f6db4](https://github.com/RofiSyahrul/katlaisasi/commit/16f6db4d5d1a3f15f44307656dc56f4dd075e9c4))
* create script to generate theme CSS to improve DX on writing CSS ([42441ce](https://github.com/RofiSyahrul/katlaisasi/commit/42441cef4ee2108f8aa1edd2e5aa73d15211e642))
* handle invalid guess and add animation to tile board ([2023bcd](https://github.com/RofiSyahrul/katlaisasi/commit/2023bcdbe9f2a6e06eb00baa53a8d73cf64db427))
* **homepage:** add welcoming section and user name form ([3e1746a](https://github.com/RofiSyahrul/katlaisasi/commit/3e1746a122e38a56a9fee9af0cbd99d14a1fb72d))
* initial commit from create svelte ([b90762d](https://github.com/RofiSyahrul/katlaisasi/commit/b90762df6249fae77123b8a441ea6ef24bfd968d))
* mvp for a game room ([2d38797](https://github.com/RofiSyahrul/katlaisasi/commit/2d38797d6c7bc6be069e95cdbcc410079ec56040))
* notify other users when a user leave room ([bc2fd33](https://github.com/RofiSyahrul/katlaisasi/commit/bc2fd33bb5b304675595b6fe6c1f099955b3506a))
* restrict exploitation on edit name feature in game room ([0568edb](https://github.com/RofiSyahrul/katlaisasi/commit/0568edbf476e16deccfa0f9ed005974c43ff24bc))
* save room ID to supabase ([22cfef5](https://github.com/RofiSyahrul/katlaisasi/commit/22cfef5f6bf0bda0ed26d3a74383a5c6103eb940))
* setup git hooks, linter and commitlint ([13bc8a5](https://github.com/RofiSyahrul/katlaisasi/commit/13bc8a55261fc11fdae33578f31fe26e9b73c451))
* setup light, dark and system theme ([3129c63](https://github.com/RofiSyahrul/katlaisasi/commit/3129c63c81b8c145d94c55d36f4f68e8e31c5409))
* setup room page and its auth with liveblocks ([2c3a973](https://github.com/RofiSyahrul/katlaisasi/commit/2c3a9734afcb03bbed22a3e9a432f181465e60bd))
* setup SEO meta ([46d256a](https://github.com/RofiSyahrul/katlaisasi/commit/46d256a4b2c7a29c51cb1214d49c0f8b7a170493))
* show answer and its definitions after a game round finished ([0d844ed](https://github.com/RofiSyahrul/katlaisasi/commit/0d844ed014f667e10c890b2be70013369b7a6a89))
* show snackbar after clicking invitation button ([bd10b7e](https://github.com/RofiSyahrul/katlaisasi/commit/bd10b7e82fb64f76ebec6dd294a5175f25af5321))
* support input guess by physical keyboard ([72c88b5](https://github.com/RofiSyahrul/katlaisasi/commit/72c88b57f15f3755d6d2b3ed3acb817f626e984e))
* update header and add device icons ([911ec80](https://github.com/RofiSyahrul/katlaisasi/commit/911ec8069fb5b15c82e60107410ce97f42c25fad))
* use inline stylesheet for theme stylesheet ([9e6c110](https://github.com/RofiSyahrul/katlaisasi/commit/9e6c110d320c21c0b5317e30fe20afb898b0f7e4))
* warn users if they are inactive for 2 minutes and then kick them after 15s ([71e1f4b](https://github.com/RofiSyahrul/katlaisasi/commit/71e1f4bb773a3ea1d6cb9129658c4f343ee16b19))


### Bug Fixes

* button and form styling issues ([9a6920b](https://github.com/RofiSyahrul/katlaisasi/commit/9a6920bef74ec50db10ecf4e798f1588be1f6640))
* finish round not triggered when there is only one user in a room ([f9dc1f3](https://github.com/RofiSyahrul/katlaisasi/commit/f9dc1f33df904bafdc35b81a9c6a91ae7e2fb34e))
* save all words to ts file as module to includes it in server build ([a890ab7](https://github.com/RofiSyahrul/katlaisasi/commit/a890ab71c54caa3ed4d260654175a18a9a971496))
* theme switcher flickering on initial load ([246627c](https://github.com/RofiSyahrul/katlaisasi/commit/246627c0f97bffc85316acbb69fb6e324726c862))
* update lang attribute on html tag to id ([e1eb721](https://github.com/RofiSyahrul/katlaisasi/commit/e1eb72104ca221a08667ae80a7e809cd9675ad30))


### Tests

* setup unit test with vitest ([26eaaca](https://github.com/RofiSyahrul/katlaisasi/commit/26eaaca1b6463c0dc160fcaecdcbba669dcbacf5))


### Improvements

* auto prefix CSS properties with autoprefixer ([57e47da](https://github.com/RofiSyahrul/katlaisasi/commit/57e47da598aa8c7dc8182b536f6cff4b9f6d0188))
* set max width of main content to 2000px for wider experience ([babfe16](https://github.com/RofiSyahrul/katlaisasi/commit/babfe16ded32e9db6b283f959426c3d7ac365574))
* use 2 spaces as tab ([e9fa7e7](https://github.com/RofiSyahrul/katlaisasi/commit/e9fa7e7bf4b531a01672f125dd8f27357003947f))
