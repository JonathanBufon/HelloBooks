# Postman Collection — Gestão de Catálogo

A collection do Postman é **derivada do OpenAPI** (`../openapi.yaml`), não mantida à mão.
Ver decisão **D-005** em [`research.md`](../../research.md).

## Geração

Pré-requisitos:
- Node.js 20+ instalado.

Comando (a partir da raiz do repositório):

```bash
npx -y openapi-to-postmanv2@5 \
  -s specs/001-gestao-catalogo/contracts/openapi.yaml \
  -o specs/001-gestao-catalogo/contracts/postman/HelloBooks.postman_collection.json \
  -p \
  --options-config <(cat <<'EOF'
{
  "folderStrategy": "Tags",
  "requestParametersResolution": "Example",
  "exampleParametersResolution": "Example",
  "includeAuthInfoInExample": true
}
EOF
)
```

> Após a feature de autenticação estar disponível, a collection passa a incluir um
> request `POST /auth/login` no folder "Auth"; ele é adicionado lá, não aqui.

## Variáveis de ambiente do Postman

A collection gerada já cria as variáveis abaixo no nível da collection. Sobrescreva-as
em um Environment do Postman antes de executar:

| Variável     | Valor sugerido (dev local)                | Descrição                                              |
| ------------ | ----------------------------------------- | ------------------------------------------------------ |
| `baseUrl`    | `http://localhost:8000/api/v1`            | URL base da API                                        |
| `jwt_token`  | (preencher com token recebido no login)   | Bearer JWT — injetado no header `Authorization`        |

## Atualização

A collection MUST ser regenerada sempre que `openapi.yaml` mudar. O comando acima é
adicionado a um script `package.json` na raiz do monorepo durante a implementação:

```json
{
  "scripts": {
    "gen:postman": "openapi-to-postmanv2 -s specs/001-gestao-catalogo/contracts/openapi.yaml -o specs/001-gestao-catalogo/contracts/postman/HelloBooks.postman_collection.json -p"
  }
}
```

A geração da collection é uma das tarefas geradas pelo `/speckit-tasks` desta feature.
