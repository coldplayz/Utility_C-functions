#!/usr/bin/env bash
# Rename a file, removing whitespaces.

old_name=$(ls | grep ".*[[:space:]].*")

new_name=$(ls | grep ".*[[:space:]].*" | tr ' ' '_'
)

mv *' '* "$new_name"
