param(
  [Parameter(Mandatory = $true)]
  [string]$Theme,

  [Parameter(Mandatory = $true)]
  [string]$Title,

  [Parameter(Mandatory = $false)]
  [string]$Content,

  [Parameter(Mandatory = $false)]
  [string]$Source = "NotebookLM",

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

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$themeSlug = Convert-ToSlug -Text $Theme
$titleSlug = Convert-ToSlug -Text $Title
$datePrefix = Get-Date -Format "yyyy-MM-dd"

$targetDir = Join-Path $repoRoot "knowledge/notebooklm/$themeSlug"
Ensure-Directory -Path $targetDir

$fileName = "$datePrefix" + "_" + "$titleSlug.md"
$targetFile = Join-Path $targetDir $fileName

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

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$body = @"
# $Title

Source: $Source
ImportedAt: $timestamp
Theme: $Theme

---

$Content
"@

Set-Content -LiteralPath $targetFile -Value $body -Encoding UTF8

Write-Host "Arquivo criado com sucesso:"
Write-Host $targetFile
