#!/bin/bash

i=1
paste pl.txt de.txt | while IFS=$'\t' read -r pl de
do
  printf -v num "%03d" $i

  echo "Tworzę: $pl / $de"

  python3 -m edge_tts --voice pl-PL-MarekNeural --text "$pl" --write-media pl_$num.mp3
  python3 -m edge_tts --voice de-DE-KatjaNeural --text "$de" --write-media de_$num.mp3

  ((i++))
done
