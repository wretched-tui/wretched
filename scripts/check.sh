function checksum() {
  find $1 -type f -name '*.ts' -exec sha1sum "{}" \; | \
    ssed 'sort/(lib.*)' 1 join | \
    sha1sum | \
    ssed 1
}

sum=$(checksum $1)

if [[ -f .sum && $(<.sum) == $sum ]]; then
  echo "No changes"
else
  echo "Changes detected"
  yarn build
  [ -f .sum ] && rm .sum
  echo $sum > .sum
fi
