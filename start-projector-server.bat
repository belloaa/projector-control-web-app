@echo off
echo Detecting projector-control portable drive...

:: Find the drive with the winprojvenv folder
FOR %%D IN (A B C D E F G H I J K L M N O P Q R S T U V W X Y Z) DO (
    IF EXIST "%%D:\winprojvenv\Scripts\activate.bat" (
        SET DRIVE=%%D
        GOTO :FOUND
    )
)

ECHO Could not locate the drive with winprojvenv. Please ensure the drive is connected.
GOTO :EOF

:FOUND
ECHO Found projector-control on drive %DRIVE%:

:: Navigate to virtual environment scripts folder
cd /d %DRIVE%:\winprojvenv\Scripts

:: Activate the virtual environment
call activate

:: Navigate to the project directory
cd /d %DRIVE%:\projector-control

:: Start the Next.js development server in the background
echo Starting Next.js server...
start /B cmd /c "npm run dev"

:: Wait a moment for the server to start
echo Waiting for server to start...
timeout /t 5 /nobreak > nul

:: Open the browser to the web app
echo Opening web browser...
start http://localhost:3000

pause