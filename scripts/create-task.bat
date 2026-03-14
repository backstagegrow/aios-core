@echo off
schtasks /delete /tn "AIOS-EmailScheduler" /f 2>nul
schtasks /create /tn "AIOS-EmailScheduler" /tr "cmd /c cd /d D:\001Gravity\aios-core && npm run sales:run" /sc hourly /mo 1 /f
echo Task criada com sucesso.
