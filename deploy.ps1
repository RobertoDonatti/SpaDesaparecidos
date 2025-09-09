# Script de Deploy para Windows PowerShell
# Nome: deploy.ps1

Write-Host "🚀 Iniciando deploy do SPA Desaparecidos..." -ForegroundColor Green

# Parar containers existentes
Write-Host "📦 Parando containers existentes..." -ForegroundColor Yellow
docker-compose down

# Build e start dos containers
Write-Host "🔨 Construindo e iniciando containers..." -ForegroundColor Yellow
docker-compose up -d --build

# Verificar status
Write-Host "✅ Verificando status dos containers..." -ForegroundColor Yellow
docker-compose ps

# Mostrar logs
Write-Host "📋 Últimos logs:" -ForegroundColor Yellow
docker-compose logs --tail=20

Write-Host ""
Write-Host "🎉 Deploy concluído!" -ForegroundColor Green
Write-Host "📱 Aplicação disponível em: http://localhost" -ForegroundColor Cyan
Write-Host ""
Write-Host "Comandos úteis:" -ForegroundColor White
Write-Host "  - Ver logs: docker-compose logs -f" -ForegroundColor Gray
Write-Host "  - Parar: docker-compose down" -ForegroundColor Gray
Write-Host "  - Reiniciar: docker-compose restart" -ForegroundColor Gray
