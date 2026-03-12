$apiKey = $env:BREVO_API_KEY
if (-not $apiKey) {
    throw "BREVO_API_KEY is required."
}

$headers = @{
    "api-key" = $apiKey
    "Accept" = "application/json"
}

$response = Invoke-RestMethod -Uri "https://api.sendinblue.com/v3/emailCampaigns?status=draft" -Headers $headers -Method Get

if ($response.campaigns) {
    foreach ($campaign in $response.campaigns) {
        Write-Output "Sending draft campaign ID: $($campaign.id)"
        try {
            Invoke-RestMethod -Uri "https://api.sendinblue.com/v3/emailCampaigns/$($campaign.id)/sendNow" -Headers $headers -Method Post
            Write-Output "Success for $($campaign.id)"
        } catch {
            Write-Output "Failed for $($campaign.id)"
        }
    }
} else {
    Write-Output "No draft campaigns found."
}
