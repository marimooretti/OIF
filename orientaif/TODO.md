# Orienta IF — entregáveis aprovados

## 1. Estrutura e identidade da aplicação
- Criar uma aplicação React, TypeScript e Vite com rotas para Página inicial, Avaliação, Sobre o projeto, Painel institucional demonstrativo e Recomendações demonstrativas.
- Organizar uma biblioteca de componentes reutilizáveis para cabeçalho, navegação, rodapé, controles, campos, escala de avaliação, progresso, cartões, indicadores, gráficos, listas, recomendações e mensagens.
- Implementar marca Orienta IF com símbolo geométrico minimalista relacionado a orientação, educação e análise, sem robôs genéricos.
- Utilizar HTML semântico, foco de teclado, estados de hover/foco/clique e responsividade para computador, tablet e celular.

## 2. Sistema visual e alternância de tema
- Usar o modo escuro como padrão: preto profundo predominante, superfícies escuras, verdes para ações/progresso e vermelho escuro de uso moderado.
- Criar modo claro com verde e branco predominantes, vermelho apenas como destaque e contraste acessível em textos, campos, gráficos e menus.
- Aplicar variáveis CSS a toda a interface, transição suave respeitando `prefers-reduced-motion` e persistência da preferência em `localStorage`.
- Evitar aparência infantil, formulários genéricos, gradientes exagerados, excesso de sombras, animações chamativas e grandes áreas vermelhas.

## 3. Experiência pública e informações do projeto
- Entregar página inicial com título “Uma educação melhor começa com a escuta.”, explicação, CTAs “Avaliar professor” e “Conhecer o projeto”, fluxo 01 Escuta / 02 Análise / 03 Orientação, sobre o projeto, convite final e rodapé.
- Explicar claramente que a IA é uma funcionalidade prevista para fase posterior e que o produto é um protótipo demonstrativo.
- Não inventar estatísticas, parcerias, certificações, autorizações ou resultados oficiais do IFTO.

## 4. Fluxo de avaliação demonstrativo
- Criar formulário em três etapas com indicador de progresso, navegação anterior/próxima e preservação de dados preenchidos.
- Etapa 1 deve ter labels visíveis, validações e erros claros para nome do estudante, curso, turma, professor avaliado e disciplina.
- Etapa 2 deve avaliar sete critérios em escala acessível de 1 a 5 (Muito ruim a Excelente), exibir o valor selecionado sem depender apenas de cor e conter comentário opcional com orientação e contador de caracteres.
- Etapa 3 deve apresentar resumo editável, aviso preciso sobre os limites do anonimato no protótipo, separação visual de identificação/contexto e respostas, checkbox de leitura e envio exclusivamente demonstrativo.
- Após o envio, exibir “Avaliação registrada na demonstração.” e “Obrigado por contribuir com uma educação melhor.”, sem alegar envio institucional, análise por IA ou recomendações reais.

## 5. Painel e recomendações demonstrativos
- Separar a visão institucional da experiência estudantil e usar somente dados fictícios claramente identificados como demonstrativos.
- Exibir indicadores agregados, gráfico de médias, distribuição de notas e lista de necessidades com categoria, descrição, quantidade fictícia e prioridade, sem respostas individuais ou comentários vinculados a estudantes.
- Entregar recomendações simuladas com necessidade, evidências agregadas, recomendação, justificativa, indicador de acompanhamento, fontes somente quando disponíveis e estado de revisão humana.
- Incluir o exemplo de rubricas para clareza dos critérios de avaliação, com status “Demonstração — recomendação simulada, não produzida por IA.”.

## 6. Verificação e entrega
- Verificar navegação entre as telas, dois temas, validações, tela de sucesso, contraste, dados demonstrativos identificados e interfaces em tela pequena.
- Garantir que todos os controles aparentes tenham uma ação e que nenhuma funcionalidade futura seja apresentada como já integrada.
