#!/bin/bash -eu

IP_LOCAL_NETWORK="192.168.56"

SCRIPT_DIR="$(realpath "$(dirname "$0")")"
REPO_DIR="$(realpath "${SCRIPT_DIR}/..")"

log() {
    echo -e "\\033[37;1m$*\\033[0m"
}

die() {
    [ $# -gt 0 ] && msg="FATAL: $*"
    echo -e "\\033[31;1m${msg:-}\\033[0m"
    exit 1
}

quiet() {
    "$@" >/dev/null 2>&1
}

usage() {
    cat <<EOF
usage: $(basename "$0") [-h] [options] [arguments]

Manage FreeIPA WebUI development container.

Options:
    -h          Show this message and exit

    -s          Start development container (default)
    -k          Kill development container
    -r          Restart (kill+start) development container
    -f          Force fetching container image from external registry

    -B [NAME]   Build local container image and exit
                (default name: webui-dev)

    -c          Run Cypress integration tests
    -C          Run Cypress integration tests with graphical debugger
    -d          Run development web server
    -p          Perform production build of webui


EOF
}

start_container() {
    local image_id="${1:-"webui-dev:latest"}"
    local container_name="${2-"webui"}"
    log "=== Configuring network: ${IP_LOCAL_NETWORK}.0/24 ==="
    podman network create \
        --disable-dns \
        --subnet "${IP_LOCAL_NETWORK}.0/24" \
        --ignore \
        webui-net > /dev/null || die "Failed to configured network."

    log "=== Starting container for ${image_id} ==="
    podman run \
        -d \
        --rm \
        --name="${container_name}" \
        -v "${REPO_DIR}:/webui:Z" \
        --security-opt label=disable \
        --cap-add SYS_ADMIN \
        --cap-add DAC_READ_SEARCH \
        --network=webui-net:ip="${IP_LOCAL_NETWORK}.10",alias=webui.ipa.test \
        --add-host "webui.ipa.test:${IP_LOCAL_NETWORK}.10" \
        --hostname webui.ipa.test \
        --publish 5173:5173 \
        --restart no "${image_id}" > /dev/null || die
}

stop_container() {
    log "=== Stopping container: ${1:-"webui"} ==="
    podman stop "${1:-webui}" > /dev/null && echo "Container stopped."
}

build_container() {
    image_name="${1:-"webui-dev"}"
    distro="${distro:-"fedora"}"
    is_container_running && stop_container "webui" >/dev/null 2>/dev/null
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

fetch_image() {
    [ -z "${1:-}" ] && return 1
    podman pull "${1}"
}

is_container_running() {
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


default_image="quay.io/ansible-freeipa/webui-dev:latest"
image_id="$(podman images -f "reference=webui-dev:latest" --format="{{ .Id }}")"
[ -z "${image_id}" ] && fetch_image="${default_image}" || fetch_image=""
action="start"

while getopts ":hB:cCdfkprs" option "$@"
do
    case "${option}" in
        "h") usage && exit ;;
        "B") build_container "${OPTARG}" && exit ;;
        "c") action="cypress:run" ;;
        "C") action="cypress:open" ;;
        "d") action="dev" ;;
        "f") fetch_image="${default_image}" ;;
        "k") action="kill" ;;
        "p") action="build" ;;
        "r") action="restart" ;;
        "s") action="start" ;;
        *)
            if [ "${option}" == ":" ]  # An optional argument?
            then
                case "${OPTARG}" in
                    "B") build_container && exit ;;
                    *) ;;  # fallback
                esac
            fi
            # assume tool long options started.
            [ "${OPTARG}" == "-" ] && break
            die "Invalid option: ${OPTARG}"  # abort any other case.
        ;;
    esac
done

declare -a extra=("${@:${OPTIND}}")

case "${action}" in
    "start")
        if is_container_running "webui"
        then
            log "Container is already running."
        else
            if [ -n "${fetch_image}" ]
            then
                fetch_image "${fetch_image}" && image_id="$(basename "${fetch_image}")"
            fi
            start_container "${image_id:-"webui-dev:latest"}"
        fi
        ;;
    "kill") is_container_running "webui" && stop_container "webui" ;;
    "restart")
        is_container_running "webui" && stop_container "webui"
        start_container "${image_id:-"webui-dev:latest"}"
        ;;
    "cypress"*)
        is_container_running "webui" || die "Container is not running."
        has_ui_available || die "Cannot find webui dev server or production build."
        read -r -a cypress_cmd <<< "${action/:/ }"
        podman unshare --rootless-netns npx "${cypress_cmd[@]}" "${extra[@]}"
        ;;
    "dev") is_webserver_running || podman exec -it webui npm run dev ;;
    "build")
        is_webserver_running && die "Development webserver is running."
        podman exec webui npm run build ;;
    *) die "Invalid action: ${action}" ;;  # there's a bug in the code
esac
