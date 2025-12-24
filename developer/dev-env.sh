#!/bin/bash -eu

IP_LOCAL_NETWORK="192.168.56"

SCRIPT_DIR="$(realpath "$(dirname "$0")")"
REPO_DIR="$(realpath "${SCRIPT_DIR}/..")"
export SCRIPT_DIR REPO_DIR # required for containerfiles

log() {
    local C_RST="\033[0m"
    local C_DEBUG="\033[30;1m"
    local C_INFO="\033[37;1m"
    local C_WARN="\033[33;1m"
    local C_ERROR="\033[31;1m"
    local L_COLOR="${C_INFO}"
    local L_LEVEL=0
    local MIN_LEVEL="${LOGLEVEL:-4}"
    local MSG_PREFIX=""
    local OPTIND OPTARG option
    while getopts ":deiw" option "$@"
    do
        case "${option}" in
            "d") L_COLOR="${C_DEBUG}" ; L_LEVEL=5 ; MSG_PREFIX="DEBUG: " ;;
            "e") L_COLOR="${C_ERROR}" ; L_LEVEL=0 ; MSG_PREFIX="ERROR: " ;;
            "i") L_COLOR="${C_INFO}" ; L_LEVEL=4; MSG_PREFIX="INFO: " ;;
            "w") L_COLOR="${C_WARN}" ; L_LEVEL=1; MSG_PREFIX="WARNING: " ;;
            *) die "Internal Error: Invalid log option ${OPTARG}" ;;
        esac
    done
    [[ "${L_LEVEL}" -gt "${MIN_LEVEL}" ]] && return 0
    shift $((OPTIND - 1))
    echo -e "${L_COLOR}${MSG_PREFIX}$*${C_RST}"
}

die() {
    [ $# -gt 0 ] && msg="FATAL: $*"
    echo -e "\033[31;1m${msg:-}\033[0m"
    exit 1
}

quiet() {
    "$@" >/dev/null 2>&1
}

usage() {
    cat <<EOF
usage: $(basename "$0") [-h] [options] [arguments] [SCENARIO] [-- EXTRA]

Manage FreeIPA WebUI development scenarios.

Options:
    -h          Show this message and exit

    -s          Start development scenario (default)
    -k          Kill currently running scenario
    -r          Restart (kill+start) development container

    -B          Build scenario (allow EXTRA options)
    -f          Force fetching images from external registries

    -l          List available scenarios
    -i          Show information for a given or running scenario

    -d          Run development web server
    -p          Perform production build of webui

    -c          Run Cypress integration tests
    -C          Run Cypress integration tests with graphical debugger
EOF
}

check_command() {
    [[ -n "$1" ]] ||  die "Internal error: (check_command) command not provided"
    quiet command -v "${1}"
}

start_container() {
    local image_id="${1:-"webui-dev:latest"}"
    local container_name="${2-"webui"}"
    log "=== Configuring network: ${IP_LOCAL_NETWORK}.0/24 ==="
    podman network create \
        --disable-dns \
        --subnet "${IP_LOCAL_NETWORK}.0/24" \
        --ignore \
        webui-ipa-single-server > /dev/null || die "Failed to configured network."

    log "=== Starting container for ${image_id} ==="
    podman run \
        -d \
        --rm \
        --name="${container_name}" \
        -v "${REPO_DIR}:/webui:Z" \
        --security-opt label=disable \
        --cap-add SYS_ADMIN \
        --cap-add DAC_READ_SEARCH \
        --network=webui-ipa-single-server:ip="${IP_LOCAL_NETWORK}.10",alias=webui.ipa.test \
        --add-host "webui.ipa.test:${IP_LOCAL_NETWORK}.10" \
        --hostname webui.ipa.test \
        --publish 5173:5173 \
        --restart no "${image_id}" > /dev/null || die
}

stop_container() {
    is_container_created "webui" || return 0
    log "=== Stopping container: ${1:-"webui"} ==="
    podman stop "${1:-webui}" > /dev/null && log "Container stopped."
    quiet podman rm "${1:-webui}" ||:
    if is_container_created "webui"
    then
        die "Failed to remove container."
    else
        quiet podman network rm --force "webui-ipa-single-server" ||:
        log "Container removed."
    fi
}

build_container() {
    image_name="${1:-"webui-dev"}"
    distro="${distro:-"fedora"}"
    is_container_created && stop_container "webui" >/dev/null 2>/dev/null
    log "=== Building '${image_name}:base' image ==="
    # Build base image. This image can be used to deploy FreeIPA
    podman build -t "${image_name}:base" \
        --build-arg distro_image="${distro_image:-${distro}}" \
        --build-arg distro_tag="${distro_tag:-"latest"}" \
        -f "containerfiles/${distro}" "${SCRIPT_DIR}" \
        || die "Failed to build base image"
    # Start build container
    start_container "${image_name}:base"
    # Deploy FreeIPA
    log "=== Deploying FreeIPA ==="
    ansible-playbook -i "${SCRIPT_DIR}/inventory.yml" \
        "${SCRIPT_DIR}/deploy-ipaserver.yml" || die "Failed to deploy IPA"
    # Save image locally
    log "=== Commit container image as '${image_name}:latest' ==="
    podman commit "webui" "${image_name}:latest"
    # Stop container
    stop_container "webui"
}

start_scenario() {
    local scenario="${1:-}"

    if ! check_command podman-compose
    then
        if [[ -z "${scenario}" ]] || [[ "${scenario}" == "single-server" ]]
        then
            if [[ -n "${fetch_image}" ]]
            then
                fetch_image "${fetch_image}" && image_id="$(basename "${fetch_image}")"
            fi
            start_container "${image_id:-"webui-dev:latest"}"
            return 0
        else
            die "Could not find executable for 'podman-compose'."
        fi
    fi
    log "=== Starting scenario: ${scenario:-"single-server"} ==="
    compose_output="$(podman-compose -f "${SCRIPT_DIR}/scenarios/${scenario}/compose.yml" up -d "${extra[@]}" 2>&1)"
    if grep -iq "^Error" <<< "${compose_output}"
    then
        grep -i "^Error" <<< "${compose_output}" >&2
        die "Error(s) found while starting scenario ${scenario}."
    else
        log "Running containers:"
        # shellcheck disable=SC2312
        podman-compose -f "${SCRIPT_DIR}/scenarios/${scenario}/compose.yml" \
            ps --format '{{.Names}}' | awk '{print "    ",$0}'
    fi

}

stop_scenario() {
    local scenario="${1:-"single-server"}"

    if ! check_command podman-compose
    then
        if [[ "${scenario}" == "single-server" ]]
        then
            stop_container "webui"
            return 0
        else
            die "Could not find executable for 'podman-compose'."
        fi
    fi
    pod_exists="$(podman pod ps --filter name="${scenario}" --format="{{.Name}}")"
    if [[ -n "${pod_exists}" ]]
    then
        log "=== Stopping scenario: ${scenario:-"single-server"} ==="
        compose_output="$(podman-compose -f "${SCRIPT_DIR}/scenarios/${scenario}/compose.yml" down 2>&1)"
        if grep -iq "^Error" <<< "${compose_output}"
        then
            grep -i "^Error" <<< "${compose_output}" >&2
            die "Error(s) found while shutting down ${scenario}."
        fi
        log "Scenario is down"
    else
        stop_container "webui"
    fi
}

info_scenario() {
    local name="${1}"
    local scenario_dir="${SCRIPT_DIR}/scenarios/${name}"
    declare -a readme=("README.md" "README" "README.txt")
    for doc in "${readme[@]}"
    do
        doc="${scenario_dir}/${doc}"
        if [[ -f "${doc}" ]]
        then
            log "=== Scenario '${name}' information ==="
            awk '{print "    ",$0}' < "${doc}"
            return 0
        fi
    done
    log -w "Scenario '${name}' does not provide a README"
}

build_scenario() {
    [[ -z "${1:-}" ]] && die "Scenario to be built was not provided."
    local scenario="${1}"
    check_command ansible-playbook \
        || die "Command 'ansible-playbook' is required for building scenarios"
    if ! check_command podman-compose
    then
        [[ "${scenario}" == "single-server" ]] \
            || die "Command 'podman-compose' is required for building scenarios"
        build_container
        return $?
    fi
    scenario_dir="${SCRIPT_DIR}/scenarios/${scenario}"
    podman-compose -f "${scenario_dir}/compose.yml" build "${extra[@]}"
    podman-compose -f "${scenario_dir}/compose.yml" up -d
    ansible-playbook -i "${scenario_dir}/inventory.yml" \
        "${SCRIPT_DIR}/deploy-ipaserver.yml" || die "Failed to deploy IPA"
    # shellcheck disable=SC2312
    while IFS= read -r -d '' playbook
    do
        ansible-playbook -i "${scenario_dir}/inventory.yml" "${playbook}" \
            || die "Failed to to execute playbook:\n\t${playbook}"
    done < <(find "${scenario_dir}/playbooks" -name "*.yml" -print0)
    # tag images
    # shellcheck disable=SC2312
    podman-compose -f "${scenario_dir}/compose.yml" images \
        | tr "\t" " " \
        | sed "s/  */ /g" \
        | cut -d " " -f1,2 \
        | sed "1d" \
    | while read -r info
    do
        container="$(cut -d " " -f 1 <<< "${info}")"
        registry="$(cut -d " " -f 2 <<< "${info}")"
        log -d podman commit "${container}" "${registry}:latest"
        podman commit "${container}" "${registry}:latest"
    done
    # cleanup
    stop_scenario "${scenario}"
}

fetch_image() {
    [ -z "${1:-}" ] && return 1
    podman pull "${1}"
}

is_container_created() {
    local name
    name="${1:-"webui"}"
    # shellcheck disable=SC2312
    test "${name}" == "$(podman ps -f "name=${name}" --format "{{.Names}}")"
}


is_production_build_available() {
    local dist_dir="${REPO_DIR}/dist"
    [ -f "${dist_dir}/index.html" ] && [ -d "${dist_dir}/assets" ]
}

is_webserver_running() {
    local dist_dir="${REPO_DIR}/dist"

    [ -f "${dist_dir}/index.html" ] && \
        quiet podman exec webui nc -zn 127.0.0.1 5173
}

has_ui_available() {
    is_production_build_available || is_webserver_running
}

check_command podman || die "Could not find a binary for 'podman'."

running="$(podman inspect webui 2>/dev/null || echo "")"
running_webui="$(podman ps --filter name=webui --format "{{.Names}}")"
if [[ -n "${running}" ]]
then
    # shellcheck disable=SC2312
    running="$(grep -- "--pod" <<<"${running}" | cut -d_ -f2 | sed 's/".*$//g' | sed "s/webui-//")"
    running_scenario="YES"
else
    running_scenario="NO"
    [[ -z "${running_webui}" ]] || running="single-server"
fi

default_image="quay.io/ansible-freeipa/webui-dev:latest"
image_id="$(podman images -f "reference=webui-dev:latest" --format="{{ .Id }}")"
[ -z "${image_id}" ] && fetch_image="${default_image}" || fetch_image=""
action="start"

while getopts ":-hBcCdfiklprs" option "$@"
do
    case "${option}" in
        "h") usage && exit ;;
        "B") action="build_scenario" ;;
        "c") action="cypress:run" ;;
        "C") action="cypress:open" ;;
        "d") action="dev" ;;
        "f") fetch_image="${default_image}" ;;
        "i") action="info" ;;
        "k") action="kill" ;;
        "l")
            action="list"
            log "Available scenarios:"
            # shellcheck disable=SC2312
            find "${SCRIPT_DIR}"/scenarios/* -maxdepth 0 -type d \
                | awk -F "/" '{ print "    ", $NF; }'
            exit 0
            ;;
        "p") action="build" ;;
        "r") action="restart" ;;
        "s") action="start" ;;
        "-") OPTIND=$((OPTIND - 1)) ; break ;;
        *) die "Invalid option: ${OPTARG}" ;;
    esac
done

shift $((OPTIND - 1))

if [[ ! "${1:-}" =~ ^-- ]]
then
    scenario="${1:-"single-server"}"
    shift ||:
fi

# Skip "--" and get extra arguments
if [[ -n "${1:-}" ]]
then
    if [[ ! "${1}" =~ ^--.* ]]
    then
        die "Unexpected option: ${1}"
    fi
fi
declare -a extra=("$@")

case "${action}" in
    "info")
        [[ -z "${scenario:-}" ]] && log -w "No scenario given. Querying running scenario."
        [[ "${running_scenario:-}" == "YES" ]] || log -w "No scenario running."
        [[ -z "${scenario:-${running:-}}" ]] && die "No environment running. Provide scenario name."
        info_scenario "${scenario:-${running:-"single-server"}}"
        ;;
    "start")
        if is_container_created "webui"
        then
            if [[ -z "${running:-}" ]]
            then
                log "Container 'webui' is already running."
            else
                log "Scenario '${running}' is running."
            fi
        else
            start_scenario "${scenario:-}"
            info_scenario "${scenario:-"single-server"}"
        fi
        ;;
    "kill") stop_scenario "${running:-${scenario:-"single-server"}}" ;;
    "restart")
        is_container_created "webui" && stop_scenario "${running:-}"
        start_scenario "${scenario}"
        ;;
    "cypress"*)
        is_container_created "webui" || die "Webui container is not running."
        has_ui_available || die "Cannot find webui dev server or production build."
        read -r -a cypress_cmd <<< "${action/:/ }"
        podman unshare --rootless-netns npx "${cypress_cmd[@]}" "${extra[@]}"
        ;;
    "dev")
        if ! is_webserver_running; then
            IPA_CONF="/etc/httpd/conf.d/ipa.conf"
            
            # Python script to inject in-place at the beginning
            podman exec -i webui python3 <<EOF
import re
import sys

config_path = '${IPA_CONF}'

proxy_config = """
# ==============================================================================
# VITE DEV CONFIGURATION
# ==============================================================================
SSLProxyEngine on

# Global Alias for legacy assets (loader.js)
# Needed to avoid 404 errors for old images and scripts
Alias "/ui" "/usr/share/ipa/ui"
<Directory "/usr/share/ipa/ui">
    SetHandler None
    AllowOverride None
    Require all granted
    Header set Expires 0
</Directory>

# We use ProxyPassMatch: Gains from WSGI and handles deep paths (E.g. '/active-users', '/active-users/123', etc.)
ProxyPassMatch ^/ipa/modern-ui/(.*)$ http://127.0.0.1:5173/ipa/modern-ui/\$1 upgrade=websocket

ProxyPassReverse /ipa/modern-ui http://127.0.0.1:5173/ipa/modern-ui

<Location "/ipa/modern-ui">
    SetHandler None
    
    AuthType None
    Require all granted
    Satisfy Any
    
    RequestHeader set X-Forwarded-Proto "https"
    RequestHeader set X-Forwarded-Port "443"
    RequestHeader set X-Forwarded-Host "webui.ipa.test"
    
    Header unset ETag
    Header set Cache-Control "no-cache, no-store"
    Header set Pragma "no-cache"
</Location>
# ==============================================================================
"""

try:
    with open(config_path, 'r') as f:
        content = f.read()

    if "VITE DEV CONFIGURATION" in content:
        print("Config already patched.")
        sys.exit(0)

    # Remove the original Alias for cleanup
    content = re.sub(r'(^\s*Alias\s+/ipa/modern-ui.*$)', r'# \1', content, flags=re.MULTILINE)

    # Inject at the beginning
    with open(config_path, 'w') as f:
        f.write(proxy_config + "\n" + content)
    
    print("Patched ipa.conf successfully.")

except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
EOF

            log "Restarting Apache..."
            podman exec webui systemctl restart httpd
            
            log "Starting Vite..."
            podman exec -it webui npm run dev
        fi
        ;;
    "build")
        is_container_created "webui" || die "Webui container is not running."
        is_webserver_running && die "Development webserver is running."
        podman exec webui npm run build
        ;;
    "build_scenario")
        is_container_created "webui" && die "Can't build while webui is running."
        build_scenario "${scenario}"
        ;;
    *) die "Invalid action: ${action}" ;;  # there's a bug in the code
esac
