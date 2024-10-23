function checksum() {
  find $1 -type f '(' -name '*.ts' -or -name '*.js' ')' -exec sha1sum "{}" \; | \
    ssed 'sort/(lib.*)' 1 join | \
    sha1sum | \
    ssed 1
}

sum=$(checksum $1)

if [[ -f .sum && $(<.sum) == $sum ]]; then
  echo "No changes"
  return 0
else
  echo "Changes detected"
  if yarn build ; then
    [ -f .sum ] && rm .sum
    echo $sum > .sum
    return
  else
    return $?
  fi
fi
