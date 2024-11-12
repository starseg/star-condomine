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
echo "Iniciando build da Aplicação Web... 🚀"

## Build do WEB
executar_comando "Navegando para o diretório do Projeto" "cd /home/starmaster/htdocs/star-condomine"
executar_comando "Atualizando repositório" "git pull"
executar_comando "Navegando para o diretório da aplicação web" "cd web/"
executar_comando "Instalando dependências" "pnpm install"
executar_comando "Realizando o build" "pnpm run build"
executar_comando "Reiniciando o serviço web no PM2" "pm2 restart web"

echo ""
echo "Build finalizado com sucesso! ✅"

echo ""
pm2 status