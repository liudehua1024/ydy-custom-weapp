while getopts "t:d:" opt; do
  case "$opt" in
  t)
    srcDir=$(pwd)/"$OPTARG"
    ;;
  d)
    destDir="$OPTARG"
    ;;
  ?)
    shift
    ;;
  esac
done

if [ -z "${srcDir}" ]; then
  echo "missing template source dir name."
  exit
elif [ ! -d "${srcDir}" ]; then
  echo "missing template source dir \"${srcDir}\" not exist."
  exit
elif [ -z "${destDir}" ]; then
  echo "missing template dest dir name."
  exit
elif [ ! -d "${destDir}" ]; then
  echo "missing template dest dir \"${destDir}\" not exist."
  exit
fi

cp -n "${srcDir}"/* "${destDir}"
