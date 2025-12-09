# Guia de Deploy no Firebase Hosting

Este guia explica como fazer o deploy do frontend no Firebase Hosting.

## Pré-requisitos

1. Ter uma conta no Firebase (https://firebase.google.com/)
2. Ter o Firebase CLI instalado globalmente ou usar via npx

## Instalação do Firebase CLI

Se ainda não tiver o Firebase CLI instalado:

```bash
npm install -g firebase-tools
```

Ou use via npx (não precisa instalar globalmente):
```bash
npx firebase-tools --version
```

## Configuração Inicial

### 1. Login no Firebase

```bash
firebase login
```

Isso abrirá o navegador para autenticação.

### 2. Criar/Selecionar Projeto Firebase

Se você ainda não criou um projeto no Firebase Console:

1. Acesse https://console.firebase.google.com/
2. Clique em "Adicionar projeto" ou "Add project"
3. Siga as instruções para criar o projeto
4. Anote o ID do projeto criado

### 3. Configurar o ID do Projeto

Edite o arquivo `.firebaserc` e substitua `"orca-sonhos"` pelo ID do seu projeto Firebase:

```json
{
  "projects": {
    "default": "SEU-PROJETO-ID-AQUI"
  }
}
```

### 4. Inicializar Firebase Hosting (Opcional)

Se quiser reconfigurar o Firebase Hosting:

```bash
npm run firebase:init
```

Ou manualmente:
```bash
firebase init hosting
```

**Importante**: Quando perguntado sobre o diretório público, use: `dist/orca-sonhos-front/browser`

## Deploy

### Deploy Completo

Para fazer o build de produção e deploy:

```bash
npm run deploy
```

### Apenas Hosting

Para fazer deploy apenas do hosting (útil se já tiver feito o build):

```bash
npm run deploy:hosting
```

### Deploy Manual

1. Build de produção:
```bash
npm run build:prod
```

2. Deploy:
```bash
firebase deploy --only hosting
```

## Verificação

Após o deploy, você receberá uma URL como:
```
https://SEU-PROJETO-ID.web.app
```

ou

```
https://SEU-PROJETO-ID.firebaseapp.com
```

## Configurações Adicionais

### Domínio Personalizado

Para usar um domínio personalizado:

1. Acesse o Firebase Console
2. Vá em Hosting > Adicionar domínio
3. Siga as instruções para configurar o DNS

### Variáveis de Ambiente

Se precisar de variáveis de ambiente diferentes para produção, certifique-se de que o arquivo `src/environments/environment.prod.ts` está configurado corretamente.

## Troubleshooting

### Erro: "Firebase project not found"
- Verifique se o ID do projeto em `.firebaserc` está correto
- Certifique-se de que você tem permissões no projeto Firebase

### Erro: "Build failed"
- Verifique se o build local funciona: `npm run build:prod`
- Verifique os logs de erro do Angular

### Erro: "Directory not found"
- Certifique-se de que o build foi executado antes do deploy
- Verifique se o caminho em `firebase.json` está correto: `dist/orca-sonhos-front/browser`

## Scripts Disponíveis

- `npm run deploy` - Build de produção + deploy completo
- `npm run deploy:hosting` - Build de produção + deploy apenas do hosting
- `npm run build:prod` - Apenas build de produção
- `npm run firebase:init` - Inicializar configuração do Firebase

