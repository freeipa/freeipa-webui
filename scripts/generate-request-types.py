#!/usr/bin/env python3

import argparse
import json
from dataclasses import dataclass
from pathlib import Path


@dataclass
class ProgramArguments:
    response: Path


def parse_arguments() -> ProgramArguments:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "response",
        type=Path,
        metavar="RESPONSE_FILE",
        help="The response file to parse, can be be obtained through json_metadata command.",
    )
    return ProgramArguments(**vars(parser.parse_args()))


if __name__ == "__main__":
    program_args = parse_arguments()

    data = json.load(program_args.response.open())

    classes = {}
    for obj in data["result"]["objects"]:
        for param in data["result"]["objects"][obj]["takes_params"]:
            if param["class"] not in classes:
                classes[param["class"]] = set()

            for p in param:
                if p not in classes[param["class"]]:
                    classes[param["class"]].add(p)

    intersection = set.intersection(*classes.values())
    print("Intersections:")
    print(sorted(intersection))

    classes_without_intersection = {k: v - intersection for k, v in classes.items()}
    print("Classes without intersection:")
    for k, v in classes_without_intersection.items():
        print(f"{k}: {sorted(v)}")
