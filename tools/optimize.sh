#!/bin/bash
# Сжатие сгенерированных изображений до разумного веса
set -e
for f in $(find assets/img -name '*.png'); do
  before=$(stat -c%s "$f")
  case "$f" in
    *hero*) convert "$f" -resize '1920x>' -quality 82 -strip "${f%.png}.jpg" ;;
    *chars/*|*poster/*) convert "$f" -resize '900x>' -quality 82 -strip "${f%.png}.jpg" ;;
    *) convert "$f" -resize '1100x>' -quality 82 -strip "${f%.png}.jpg" ;;
  esac
  rm "$f"
  after=$(stat -c%s "${f%.png}.jpg")
  printf "%-42s %6s КБ -> %5s КБ\n" "$(basename $f)" $((before/1024)) $((after/1024))
done
