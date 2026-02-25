from flask import Flask, send_from_directory, request

app = Flask(__name__)

def organizar_scoreboard():
    # Lê os dados do arquivo
    with open('scoreboard.txt', 'r', encoding='utf-8') as arquivo:
        linhas = arquivo.readlines()

    # Extrai os nomes e pontuações
    dados = [(linha.split(',')[0].split(': ')[1].strip(), int(linha.split(',')[1].split(': ')[1])) for linha in linhas]

    # Classifica os dados com base na pontuação (ordem decrescente)
    dados_ordenados = sorted(dados, key=lambda x: x[1], reverse=True)

    # Reescreve o arquivo com os dados organizados
    with open('scoreboard.txt', 'w', encoding='utf-8') as arquivo:
        for nome, pontuacao in dados_ordenados:
            arquivo.write(f'Nome: {nome}, Pontuação: {pontuacao}\n')

@app.route('/')
def index():
    # Renderiza o arquivo index.html diretamente da pasta
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    # Servir arquivos estáticos diretamente da pasta
    return send_from_directory('.', filename)


@app.route('/enviar_dados', methods=['POST'])
def receber_dados():
    dados = request.get_json()
    nome = dados.get('nome')
    pontuacao = dados.get('pontuacao')

    # Escreve os dados no arquivo txt com a codificação UTF-8
    with open('scoreboard.txt', 'a', encoding='utf-8') as arquivo:
        arquivo.write(f'Nome: {nome}, Pontuação: {pontuacao}\n')

    # Organiza o arquivo de scoreboard
    organizar_scoreboard()

    return 'Dados recebidos e scoreboard atualizado com sucesso!'

if __name__ == '__main__':
    app.run(debug=True)
