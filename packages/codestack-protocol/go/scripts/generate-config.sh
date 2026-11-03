#!/bin/bash
# Copyright (c) 2022 Codestack GmbH. All rights reserved.
# Licensed under the GNU Affero General Public License (AGPL).
# See License.AGPL.txt in the project root for license information.


COMPONENT_PATH="$(dirname "$0")/.."
echo "Component Path: ${COMPONENT_PATH}"

if [ "${LEEWAY_BUILD-}" == "true" ]; then
    CONFIG_PATH="./_deps/components-codestack-protocol--codestack-schema/codestack-schema.json"
else
    CONFIG_PATH="$COMPONENT_PATH/../data/codestack-schema.json"
fi
echo "Config Path: ${CONFIG_PATH}"

CODESTACK_CONFIG_TYPE_PATH="$COMPONENT_PATH/codestack-config-types.go"
echo "Config Types Path: ${CODESTACK_CONFIG_TYPE_PATH}"
if [ "${LEEWAY_BUILD-}" == "true" ]; then
    git init -q
    git add "$CODESTACK_CONFIG_TYPE_PATH"
fi

go install github.com/a-h/generate/...@latest

schema-generate -p protocol "$CONFIG_PATH" > "$CODESTACK_CONFIG_TYPE_PATH"

# remove custom marshal logic to allow additional properties
sed -i '/func /,$d' "$CODESTACK_CONFIG_TYPE_PATH" #functions
sed -i '5,10d' "$CODESTACK_CONFIG_TYPE_PATH" #imports
# support yaml and json
sed -i -E 's/(json:)(".*")/yaml:\2 \1\2/g' "$CODESTACK_CONFIG_TYPE_PATH"
gofmt -w "$CODESTACK_CONFIG_TYPE_PATH"

if [ "${LEEWAY_BUILD-}" == "true" ]; then
    ./_deps/dev-addlicense--app/addlicense "$CODESTACK_CONFIG_TYPE_PATH"
else
    leeway run components:update-license-header
fi

git diff --exit-code "$CODESTACK_CONFIG_TYPE_PATH"
