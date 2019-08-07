#!/bin/bash


SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
CODE_DIR=$(dirname "$SCRIPT_DIR")

set -ex
cd $CODE_DIR

python3 manage.py loaddata province.json district.json palika.json ward.json
./scripts/fetch_from_fieldsight.sh
