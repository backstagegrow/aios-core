$TaskName = "AIOS-EmailScheduler"
$ProjectRoot = "D:\001Gravity\aios-core"
$NpmPath = (Get-Command npm -ErrorAction SilentlyContinue).Source

$Action = New-ScheduledTaskAction `
    -Execute "cmd.exe" `
    -Argument "/c npm run sales:run" `
    -WorkingDirectory $ProjectRoot

$Trigger = New-ScheduledTaskTrigger -RepetitionInterval (New-TimeSpan -Hours 1) -Once -At (Get-Date)

$Settings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 15) `
    -RestartCount 2 `
    -RestartInterval (New-TimeSpan -Minutes 5) `
    -StartWhenAvailable

$Principal = New-ScheduledTaskPrincipal `
    -UserId ([System.Security.Principal.WindowsIdentity]::GetCurrent().Name) `
    -LogonType Interactive `
    -RunLevel Limited

Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue

Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $Action `
    -Trigger $Trigger `
    -Settings $Settings `
    -Principal $Principal `
    -Description "AIOS BKSGrow — npm run sales:run a cada 1 hora" | Out-Null

Write-Host "Task atualizada: $TaskName — npm run sales:run (a cada 1h)"
