#!/bin/sh
set -euf

# Exporting only if not already set, see https://stackoverflow.com/a/11686912
export BRAK_IDP_OIDC_CLIENT_SECRET="${BRAK_IDP_OIDC_CLIENT_SECRET:=$(cat /etc/brak-idp-secrets/BRAK_IDP_OIDC_CLIENT_SECRET)}"

npm run start
