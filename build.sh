$(curl https://gist.githubusercontent.com/nicooga/83433ef26047383c951c7ffca1ab487a/raw/c610980baa62219967a4bf3282f4bdebede497b9/personal_site_front_environment_vars.sh)
echo $COMMENS_API_URL
./node_modules/webpack/bin/webpack.js -m production --progress
