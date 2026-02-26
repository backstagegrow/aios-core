param(
  [Parameter(Mandatory = $true)]
  [string]$Theme,

  [Parameter(Mandatory = $true)]
  [string]$Title,

  [Parameter(Mandatory = $false)]
  [string]$Content,

  [Parameter(Mandatory = $false)]
  [string]$ForceAgent,

  [Parameter(Mandatory = $false)]
  [switch]$FromClipboard
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Convert-ToSlug {
  param([string]$Text)
  $normalized = $Text.ToLowerInvariant()
  $normalized = $normalized -replace "[^a-z0-9\s-]", ""
  $normalized = $normalized -replace "\s+", "-"
  $normalized = $normalized -replace "-{2,}", "-"
  return $normalized.Trim("-")
}

function Ensure-Directory {
  param([string]$Path)
  if (-not (Test-Path -LiteralPath $Path)) {
    New-Item -ItemType Directory -Path $Path -Force | Out-Null
  }
}

function Get-AgentScores {
  param([string]$Text)

  $patterns = @{
    "clickup-ops" = @("clickup","task","lista","status","responsavel","assignee","briefing","campo personalizado","social media","trafego")
    "clickup-reporting" = @("relatorio","kpi","indicador","gargalo","executivo","ceo","cmo","cfo","coo","sintese","analise de desempenho")
    "analyst" = @("pesquisa","mercado","concorrente","insight","hipotese","persona","segmento","diagnostico")
    "architect" = @("arquitetura","stack","sistema","api","integração","design técnico","escalabilidade")
    "pm" = @("roadmap","prioridade","produto","estrategia","okrs","planejamento")
    "dev" = @("implementar","codigo","script","bug","refatorar","teste","deploy")
  }

  $scores = @{}
  foreach ($agent in $patterns.Keys) {
    $score = 0
    foreach ($keyword in $patterns[$agent]) {
      if ($Text -match [regex]::Escape($keyword)) { $score += 1 }
    }
    $scores[$agent] = $score
  }

  return $scores
}

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$themeSlug = Convert-ToSlug -Text $Theme
$titleSlug = Convert-ToSlug -Text $Title
$datePrefix = Get-Date -Format "yyyy-MM-dd"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

if ($FromClipboard.IsPresent) {
  try {
    $Content = Get-Clipboard
  } catch {
    throw "Nao foi possivel ler o clipboard. Remova -FromClipboard ou execute em um ambiente com clipboard."
  }
}

if ([string]::IsNullOrWhiteSpace($Content)) {
  throw "Conteudo vazio. Informe -Content ou use -FromClipboard."
}

$knowledgeDir = Join-Path $repoRoot "knowledge/notebooklm/$themeSlug"
Ensure-Directory -Path $knowledgeDir
$knowledgeFile = Join-Path $knowledgeDir ($datePrefix + "_" + $titleSlug + ".md")

$knowledgeBody = @"
# $Title

Source: NotebookLM
ImportedAt: $timestamp
Theme: $Theme

---

$Content
"@

Set-Content -LiteralPath $knowledgeFile -Value $knowledgeBody -Encoding UTF8

$selectedAgent = $null
$scores = @{}

if (-not [string]::IsNullOrWhiteSpace($ForceAgent)) {
  $selectedAgent = $ForceAgent
  $scores["forced"] = 1
} else {
  $scores = Get-AgentScores -Text ($Title + "`n" + $Content).ToLowerInvariant()
  $selectedAgent = ($scores.GetEnumerator() | Sort-Object -Property Value -Descending | Select-Object -First 1).Key
}

if ([string]::IsNullOrWhiteSpace($selectedAgent)) {
  $selectedAgent = "analyst"
}

$inboxDir = Join-Path $repoRoot ".antigravity/inbox"
Ensure-Directory -Path $inboxDir

$dispatchId = (Get-Date -Format "yyyyMMdd-HHmmss")
$dispatchFile = Join-Path $inboxDir ("dispatch-" + $dispatchId + ".json")

$prompt = @"
@$selectedAgent
Use `knowledge/notebooklm` as source of truth.

Dispatch context:
- Theme: $Theme
- Title: $Title
- File: $knowledgeFile

Requested action:
- Analyze this NotebookLM input and execute your best next workflow.
- Return an actionable output (plan/tasks/report/code guidance) aligned to your role.
"@

$payload = [ordered]@{
  id = $dispatchId
  created_at = (Get-Date).ToString("o")
  selected_agent = $selectedAgent
  theme = $Theme
  title = $Title
  knowledge_file = $knowledgeFile
  scores = $scores
  prompt = $prompt
}

$payload | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $dispatchFile -Encoding UTF8

Write-Host ""
Write-Host "NotebookLM import + dispatch criado com sucesso."
Write-Host "Knowledge file: $knowledgeFile"
Write-Host "Dispatch file:  $dispatchFile"
Write-Host "Selected agent: @$selectedAgent"
Write-Host ""
Write-Host "Prompt pronto para enviar na IDE:"
Write-Host "--------------------------------"
Write-Host $prompt
Write-Host "--------------------------------"
