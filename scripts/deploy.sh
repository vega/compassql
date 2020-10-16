set -e

# define color
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if on master
if [ "$(git rev-parse --abbrev-ref HEAD)" != "master" ]; then
  echo "${RED}Not on master, please checkout master branch before running this script${NC}"
  exit 1
fi

# Check if all files are committed
if [ -z "$(git status --porcelain)" ]; then
  echo "All tracked files are committed.  Publishing on npm. \n"
else
  echo "${RED}There are uncommitted files. Please commit or stash first!${NC} \n\n"
  git status
  exit 1
fi

# swap to head so we don't commit compiled file to master along with tags
git checkout head
npm run build

# NPM PUBLISH

npm publish
# exit if npm publish failed
rc=$?
if [[ $rc != 0 ]]; then
  echo "${RED} npm publish failed.  Publishing cancelled (Make sure you sure npm run deploy, not yarn run deploy). ${NC} \n\n"
  exit $rc;
fi
