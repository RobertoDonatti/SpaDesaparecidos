#!/bin/bash

# Script de Deploy para Produção
# Nome: deploy.sh

echo "🚀 Iniciando deploy do SPA Desaparecidos..."

# Parar containers existentes
echo "📦 Parando containers existentes..."
docker-compose down

# Remover imagens antigas (opcional - descomente se quiser limpar)
# echo "🧹 Removendo imagens antigas..."
# docker image prune -f

# Build e start dos containers
echo "🔨 Construindo e iniciando containers..."
docker-compose up -d --build

# Verificar status
echo "✅ Verificando status dos containers..."
docker-compose ps

# Mostrar logs (opcional)
echo "📋 Últimos logs:"
docker-compose logs --tail=20

echo ""
echo "🎉 Deploy concluído!"
echo "📱 Aplicação disponível em: http://localhost"
echo ""
echo "Comandos úteis:"
echo "  - Ver logs: docker-compose logs -f"
echo "  - Parar: docker-compose down"
echo "  - Reiniciar: docker-compose restart"
