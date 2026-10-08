param(
  [string]$Mode = "antes"
)

$outDir = "C:\Users\Windows\.gemini\antigravity-ide\brain\a5ac8da7-1981-4628-8679-4054ac29cec9\capturas\$Mode"
if (!(Test-Path $outDir)) {
  New-Item -ItemType Directory -Force -Path $outDir | Out-Null
}

$targets = @(
  @{ name = "inicio"; url = "http://localhost:3000" },
  @{ name = "catalogo"; url = "http://localhost:3000/catalogo" },
  @{ name = "ficha_galeria"; url = "http://localhost:3000/catalogo/cmuzw4zkk000t13fxq1brxcnk" },
  @{ name = "princesas_variantes"; url = "http://localhost:3000/catalogo/cmuzw4zkk000t13fxq1brxcnk" },
  @{ name = "babyshower_dinamicas"; url = "http://localhost:3000/catalogo/cmuzw4zjd000c13fxp53xhv7c" },
  @{ name = "consulta_fecha"; url = "http://localhost:3000/disponibilidad" }
)

$viewports = @(
  @{ suffix = "desktop"; w = 1280; h = 800 },
  @{ suffix = "mobile"; w = 390; h = 844 }
)

foreach ($t in $targets) {
  foreach ($v in $viewports) {
    $file = Join-Path $outDir "$($t.name)_$($v.suffix).png"
    Write-Host "Capturing $($t.name)_$($v.suffix)..."
    cmd.exe /c "`"C:\Program Files\Google\Chrome\Application\chrome.exe`" --headless=new --screenshot=`"$file`" --window-size=$($v.w),$($v.h) --no-sandbox --disable-gpu $($t.url)"
  }
}
Write-Host "Capturas completadas para $Mode"
