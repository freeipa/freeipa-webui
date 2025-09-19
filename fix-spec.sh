#!/usr/bin/env bash

set -euo pipefail

usage() {
    cat <<EOF
usage: $(basename "$0") [-h] [options] [specfile]

Automatically fill in bundled dependencies
Default action is to update the spec file

Options:
    -h          Show this message and exit
    -r          Replace the #NPM_PROVIDES with proper contents
    -f          Revert the changes, removes Provides bundled(npm(...)) with #NPM_PROVIDES
    -u          Simply updates the listed dependencies
    -i          In-place, does not create a new file


EOF
}

replace() {
    # Patch given spec file to have the correct version and declare bundled NPM dependencies
    PROVIDES=$(npm ls --omit dev --package-lock-only --depth=Infinity |
        grep -Eo '[^[:space:]]+@[^[:space:]]+' |
        sort -u |
        # only replace the *last* occurrence of @, not e.g. the one in @patternfly/..
        sed 's/^/Provides: bundled(npm(/; s/\(.*\)@/\1)) = /')

    awk -v p="$PROVIDES" 'gsub(/#NPM_PROVIDES/, p) 1' "$spec" > "$spec".new

    if [ "$backup" = false ]; then
        mv -f "$spec".new "$spec"
    fi
}

revert() {
    # Delete all lines but the first one containing "Provides: bundled(npm(
    sed '/^Provides: bundled(npm(/{x;/^$/!d;g;}' < "$spec" > "$spec".new

    # Replace the first line containing "Provides: bundled(npm(" with "#NPM_PROVIDES"
    sed -i 's/^Provides: bundled(npm(.*/#NPM_PROVIDES/' "$spec".new

    if [ "$backup" = false ]; then
        mv -f "$spec".new "$spec"
    fi
}

update() {
    revert

    # We need to use the backup file for the next step if not in-place
    if [ "$backup" = true ]; then
        spec="$spec".new
    fi

    replace

    # There is no need for two backups, we can just move the replace backup to the original revert backup
    if [ "$backup" = true ]; then
        mv -f "$spec".new "$spec"
    fi
}

action="update"
backup=true
action_set=false

while { [[ "$#" -ge 1 ]] && [[ "$1" == "-"* ]]; } || [[ "$#" -gt 1 ]];
do
    case $1 in
        "-h")
            usage
            exit 0
            ;;
        "-r")
            if [ "$action_set" = true ]; then
                usage
                exit 1
            fi
            action_set=true
            ;;
        "-f")
            if [ "$action_set" = true ]; then
                usage
                exit 1
            fi
            action_set=true
            action="revert"
            ;;
        "-u")
            if [ "$action_set" = true ]; then
                usage
                exit 1
            fi
            action_set=true
            action="update"
            ;;
        "-i")
            backup=false
            ;;
        *)
            usage
            exit 1
            ;;
    esac
    shift
done

spec="${1:-../../freeipa.spec.in}"

if [[ ! -f "$spec" ]]; then
    echo "Spec file $spec does not exist"
    exit 1
fi

case $action in
    "replace")
        replace
        ;;
    "revert")
        revert
        ;;
    "update")
        update
        ;;
esac
