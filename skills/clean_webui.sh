#!/bin/bash
set -e

DEEP_CLEAN=false

# Check if the --deep flag was passed
if [ "$1" == "--deep" ]; then
    DEEP_CLEAN=true
fi

echo "=== Cleaning FreeIPA WebUI environment ==="

if command -v podman &> /dev/null; then
    echo "[INFO] Stopping Podman containers related to FreeIPA..."
    podman stop webui freeipa-server 2>/dev/null || true
    
    echo "[INFO] Removing Podman containers related to FreeIPA..."
    podman rm -f webui freeipa-server 2>/dev/null || true
    
    echo "[INFO] Pruning unused Podman networks..."
    podman network prune -f 2>/dev/null || true

    if [ "${DEEP_CLEAN}" = true ]; then
        echo "[WARNING] Performing DEEP CLEAN: Purging all Podman cache and images..."
        podman system prune --all --force
        podman rmi --all --force
    fi
fi

echo "=== Environment successfully cleaned ==="