executar_comando() {
    $2 > /dev/null 2> erro.log  # Redireciona stdout para /dev/null (descarta) e stderr para erro.log
    if [ $? -eq 0 ]; then # Verifica se o comando foi executado com sucesso
        echo "$1 ✅" 
    else
        echo "$1 falhou ❌"
        echo "Log de erro:"
        cat erro.log  # Exibe o conteúdo do log de erro
    fi
}

echo ""
echo "Iniciando build da API... 🚀"

executar_comando "Navegando para o diretório do Projeto" "cd /home/starmasterapi/htdocs/star-condomine"
executar_comando "Atualizando repositório" "git pull"
executar_comando "Navegando para o diretório da API" "cd api/"
executar_comando "Instalando dependências" "npm install"
executar_comando "Configurando o banco de dados e o prisma" "npx prisma migrate dev"
executar_comando "Realizando o build" "npm run build"
executar_comando "Reiniciando o serviço da API no PM2" "pm2 restart app"


echo ""
echo "Build finalizado com sucesso! ✅"

echo ""
pm2 status