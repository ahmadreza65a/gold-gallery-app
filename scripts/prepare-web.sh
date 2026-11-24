#!/usr/bin/env bash
# دانلود کتابخانه‌های وب (بوت‌استرپ، آیکون‌ها، چارت، فونت وزیرمتن) و کپی داخل اپ
# تا اپ بدون اینترنت هم کامل و با همه افکت‌ها کار کند.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WWW="$ROOT/app/src/main/assets/www"
LIBS="$WWW/libs"
TMP="$ROOT/.npm-tmp"

rm -rf "$TMP" "$LIBS"
mkdir -p "$TMP" "$LIBS/bootstrap-icons/fonts" "$LIBS/vazirmatn"

cd "$TMP"
npm init -y >/dev/null
npm install --no-audit --no-fund \
  bootstrap@5.3.3 bootstrap-icons@1.11.3 chart.js@4.4.3 @fontsource/vazirmatn@5
NM="$TMP/node_modules"

# --- Bootstrap ---
cp "$NM/bootstrap/dist/css/bootstrap.rtl.min.css" "$LIBS/"
cp "$NM/bootstrap/dist/js/bootstrap.bundle.min.js" "$LIBS/"

# --- Bootstrap Icons ---
cp "$NM/bootstrap-icons/font/bootstrap-icons.min.css" "$LIBS/bootstrap-icons/"
cp "$NM/bootstrap-icons/font/fonts/bootstrap-icons.woff2" "$LIBS/bootstrap-icons/fonts/"
cp "$NM/bootstrap-icons/font/fonts/bootstrap-icons.woff" "$LIBS/bootstrap-icons/fonts/"

# --- Chart.js ---
CHART="$(find "$NM/chart.js/dist" -maxdepth 1 -name 'chart.umd*.js' ! -name '*.map' | sort | head -n 1)"
cp "$CHART" "$LIBS/chart.umd.js"

# --- Vazirmatn (فونت فارسی) ---
FONTCSS="$LIBS/vazirmatn/fonts.css"
: > "$FONTCSS"
for subset in arabic latin; do
  if [ "$subset" = "arabic" ]; then
    RANGE="U+0600-06FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE80-FEFC"
  else
    RANGE="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
  fi
  for w in 400 500 600 700; do
    F="vazirmatn-$subset-$w-normal.woff2"
    SRC="$NM/@fontsource/vazirmatn/files/$F"
    if [ -f "$SRC" ]; then
      cp "$SRC" "$LIBS/vazirmatn/$F"
      cat >> "$FONTCSS" <<CSS
@font-face {
  font-family: 'Vazirmatn';
  font-style: normal;
  font-display: swap;
  font-weight: $w;
  src: url('$F') format('woff2');
  unicode-range: $RANGE;
}
CSS
    fi
  done
done

cd "$ROOT"
rm -rf "$TMP"

# --- بررسی نهایی ---
for f in bootstrap.rtl.min.css bootstrap.bundle.min.js chart.umd.js \
         bootstrap-icons/bootstrap-icons.min.css bootstrap-icons/fonts/bootstrap-icons.woff2 \
         vazirmatn/fonts.css vazirmatn/vazirmatn-arabic-400-normal.woff2 vazirmatn/vazirmatn-arabic-700-normal.woff2; do
  if [ ! -s "$LIBS/$f" ]; then
    echo "خطا: فایل $f ساخته نشد" >&2
    exit 1
  fi
done
echo "کتابخانه‌های وب آماده شد:"
find "$LIBS" -type f | sort
