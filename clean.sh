find . -name "*.zip" -type f -delete
find . -name "common" -not -path "./common" -type d -exec rm -r "{}" \;
find . -name "common_py" -not -path "./common_py" -type d -exec rm -r "{}" \;
