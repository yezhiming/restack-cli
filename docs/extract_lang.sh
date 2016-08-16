#!/bin/bash

pushd `dirname $0` > /dev/null;
ROOT_DIR=`pwd`'/..';
popd > /dev/null;

# Transpile to ES5
node "${ROOT_DIR}/node_modules/babel-cli/bin/babel" "${ROOT_DIR}/src" -d "${ROOT_DIR}/src_es5";
find "${ROOT_DIR}/src_es5" -type f \( -name '*.js' \) -print > "${ROOT_DIR}/list";

# Extract phrases from source code and update exising PO files
xgettext --keyword="l:1" \
         --keyword="l:1,2c" \
         --keyword="nl:1,2" \
         --keyword="nl:1,2,4c" \
         --files-from="${ROOT_DIR}/list" \
         --language=JavaScript \
         --no-location \
         --from-code=UTF-8 \
         --output="${ROOT_DIR}/lang/messages.pot";

# prints langs into string: 'en,zh-cn,jp,kr'
lang_str=`node -e "console.log(require('./project').languages.join(','))"`

# turn langs string into array
OLD_IFS="$IFS"
IFS=","
langs=($lang_str)
IFS="$OLD_IFS"

for lang in ${langs[*]}; do
  # make sure po file exists
  touch "${ROOT_DIR}/lang/${lang}.po"
  # merge
  msgmerge --backup=off -U "${ROOT_DIR}/lang/${lang}.po" "${ROOT_DIR}/lang/messages.pot";
done

# Cleanup
rm -rf "${ROOT_DIR}/src_es5";
rm -rf "${ROOT_DIR}/list";
