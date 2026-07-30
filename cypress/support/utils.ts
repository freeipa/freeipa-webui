import { exec as cpExec } from "child_process";
import { promisify } from "util";

export const exec = promisify(cpExec);

export const IPA_PREFIX = "podman exec webui ipa";
export const IPA_PREFIX_INTERACTIVE = "podman exec -i webui ipa";
