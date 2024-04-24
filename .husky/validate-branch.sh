#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

branch_name=$(git symbolic-ref --short HEAD)
validate_branch_name=$(npx validate-branch-name --branch-pattern "^(feature|hotfix|release)\/[a-z0-9]+(-[a-z0-9]+)*$" "$branch_name")

if [ "$validate_branch_name" != "true" ]; then
    echo "Invalid branch name: $branch_name. Branch names must follow the pattern: feature/*, hotfix/*, or release/*."
    exit 1
fi