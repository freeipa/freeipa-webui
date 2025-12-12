import { exec as cpExec } from "child_process";
import util from "util";

export const exec = util.promisify(cpExec);

export const IPA_PREFIX = "podman exec webui ipa";
