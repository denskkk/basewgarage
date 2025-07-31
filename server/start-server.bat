@echo off
echo Starting W Garage Server...
echo.

echo Installing dependencies...
npm install

echo.
echo Initializing database...
npm run init-db

echo.
echo Starting server...
npm start
