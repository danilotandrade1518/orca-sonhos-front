# Biblioteca de Ícones - Orca Sonhos Design System

## 📚 Visão Geral

O componente `os-icon` suporta três tipos de ícones:

1. **Material Icons** (padrão) - 147+ ícones mapeados para Material Design
2. **Font Awesome** - Suporte completo via `fontSet` e `fontIcon`
3. **Ícones SVG Customizados** - Suporte para SVG inline

## 🎯 Ícones Material Disponíveis (147+ ícones)

### Navegação e Interface

- `home` - home (Casa)
- `menu` - menu (Menu)
- `close` - close (Fechar)
- `back` - arrow_back (Voltar)
- `forward` - arrow_forward (Avançar)
- `up` - keyboard_arrow_up (Cima)
- `down` - keyboard_arrow_down (Baixo)
- `left` - keyboard_arrow_left (Esquerda)
- `right` - keyboard_arrow_right (Direita)
- `add` - add (Adicionar)
- `remove` - remove (Remover)
- `edit` - edit (Editar)
- `delete` - delete (Deletar)
- `save` - save (Salvar)
- `cancel` - cancel (Cancelar)
- `confirm` - check (Confirmar)
- `search` - search (Buscar)
- `filter` - filter_list (Filtrar)
- `sort` - sort (Ordenar)
- `refresh` - refresh (Atualizar)
- `settings` - settings (Configurações)
- `help` - help (Ajuda)
- `info` - info (Informação)

### Status e Feedback

- `warning` - warning (Aviso)
- `error` - error (Erro)
- `success` - check_circle (Sucesso)
- `loading` - autorenew (Carregando)
- `spinner` - autorenew (Spinner)
- `check` - check (Check)
- `cross` - close (Cruz)
- `plus` - add (Mais)
- `minus` - remove (Menos)

### Usuários e Perfis

- `user` - person (Usuário)
- `users` - people (Usuários)
- `profile` - account_circle (Perfil)
- `logout` - logout (Sair)
- `login` - login (Entrar)

### Financeiro

- `money` - attach_money (Dinheiro)
- `wallet` - account_balance_wallet (Carteira)
- `credit-card` - credit_card (Cartão de Crédito)
- `bank` - account_balance (Banco)
- `chart` - bar_chart (Gráfico)
- `trending-up` - trending_up (Tendência Alta)
- `trending-down` - trending_down (Tendência Baixa)
- `calculator` - calculate (Calculadora)

### Comunicação

- `mail` - mail (Email)
- `phone` - phone (Telefone)
- `message` - message (Mensagem)
- `notification` - notifications (Notificação)
- `bell` - notifications (Sino)

### Arquivos e Documentos

- `file` - description (Arquivo)
- `folder` - folder (Pasta)
- `download` - download (Download)
- `upload` - upload (Upload)
- `attachment` - attach_file (Anexo)

### Tempo e Data

- `calendar` - calendar_today (Calendário)
- `clock` - access_time (Relógio)
- `time` - schedule (Tempo)
- `date` - event (Data)

## 🆕 Ícones Adicionais (Encontrados nos Componentes)

### Categorias e Gestão

- `category` - category (Categoria)
- `check_circle` - check_circle (Círculo de Check)
- `trending_flat` - trending_flat (Tendência Plana)
- `bar_chart` - bar_chart (Gráfico de Barras)
- `event` - event (Evento)
- `update` - update (Atualizar)

### Utensílios e Ações

- `utensils` - restaurant (Utensílios)
- `trash` - delete (Lixeira)
- `money-bill` - attach_money (Nota de Dinheiro)
- `exchange-alt` - swap_horiz (Trocar)
- `folder-open` - folder_open (Pasta Aberta)

### Navegação e Interface Avançada

- `account_balance_wallet` - account_balance_wallet (Carteira de Conta)
- `analytics` - analytics (Analytics)
- `people` - people (Pessoas)
- `keyboard_arrow_down` - keyboard_arrow_down (Seta para Baixo)
- `inbox` - inbox (Caixa de Entrada)

### Transações e Receitas

- `receipt` - receipt (Recibo)
- `celebration` - celebration (Celebração)
- `schedule` - schedule (Agenda)
- `play_arrow` - play_arrow (Seta de Play)
- `flag` - flag (Bandeira)
- `savings` - savings (Poupança)
- `history` - history (Histórico)
- `flash_on` - flash_on (Flash Ligado)

## 📖 Como Usar

```html
<!-- Ícone básico -->
<os-icon name="home"></os-icon>

<!-- Ícone com tamanho personalizado -->
<os-icon name="search" size="lg"></os-icon>

<!-- Ícone com variante de cor -->
<os-icon name="success" variant="success"></os-icon>

<!-- Ícone com acessibilidade -->
<os-icon name="info" role="informative" ariaLabel="Informação importante"></os-icon>
```

## 🔧 Propriedades

- `name`: Nome do ícone (obrigatório)
- `size`: Tamanho ('xs', 'sm', 'md', 'lg', 'xl', '2xl')
- `variant`: Variante de cor ('default', 'primary', 'secondary', 'success', 'warning', 'error', 'info')
- `role`: Papel de acessibilidade ('decorative', 'informative', 'interactive')
- `ariaLabel`: Label para acessibilidade
- `title`: Título do ícone

## 🎨 Font Awesome Support

### Conjuntos de Fontes Suportados

- `fas` - Font Awesome Solid
- `far` - Font Awesome Regular
- `fab` - Font Awesome Brands
- `fal` - Font Awesome Light
- `fad` - Font Awesome Duotone

### Exemplos de Uso

```html
<!-- Font Awesome Solid -->
<os-icon fontSet="fas" fontIcon="home"></os-icon>

<!-- Font Awesome Regular -->
<os-icon fontSet="far" fontIcon="heart"></os-icon>

<!-- Font Awesome Brands -->
<os-icon fontSet="fab" fontIcon="github"></os-icon>
```

## 🎯 Ícones SVG Customizados

### Suporte para SVG Inline

```html
<os-icon name="custom-svg" [svgContent]="'<svg>...</svg>'"></os-icon>
```

### Suporte para SVG via URL

```html
<os-icon name="custom-svg" svgUrl="/assets/icons/custom.svg"></os-icon>
```

## 📏 Tamanhos Disponíveis

| Tamanho | CSS  | Pixels | Uso Recomendado       |
| ------- | ---- | ------ | --------------------- |
| `xs`    | 12px | 12x12  | Ícones muito pequenos |
| `sm`    | 16px | 16x16  | Ícones pequenos       |
| `md`    | 20px | 20x20  | Ícones padrão         |
| `lg`    | 24px | 24x24  | Ícones grandes        |
| `xl`    | 28px | 28x28  | Ícones extra grandes  |
| `2xl`   | 32px | 32x32  | Ícones hero           |

## 🎨 Variantes de Cor

| Variante    | Cor           | Uso Recomendado     |
| ----------- | ------------- | ------------------- |
| `default`   | Neutral 600   | Ícones neutros      |
| `primary`   | Primary 600   | Ícones principais   |
| `secondary` | Secondary 600 | Ícones secundários  |
| `success`   | Success       | Ícones de sucesso   |
| `warning`   | Warning       | Ícones de aviso     |
| `error`     | Error         | Ícones de erro      |
| `info`      | Info          | Ícones informativos |

## ♿ Acessibilidade

### Ícones Decorativos

```html
<os-icon name="star" [ariaHidden]="true"></os-icon>
```

### Ícones Informativos

```html
<os-icon name="warning" [ariaHidden]="false" ariaLabel="Aviso importante"></os-icon>
```

### Ícones Interativos

```html
<os-icon
  name="settings"
  [ariaHidden]="false"
  ariaLabel="Configurações"
  title="Abrir configurações"
></os-icon>
```

## 🎭 Animações

### Spin (Rotação)

```html
<os-icon name="loading" [spin]="true"></os-icon>
```

### Pulse (Pulso)

```html
<os-icon name="bell" [pulse]="true"></os-icon>
```

## 📱 Responsividade

### Mobile (< 768px)

- Tamanhos automaticamente ajustados
- Touch targets >= 44px garantidos
- Contraste otimizado para telas pequenas

### Desktop (>= 768px)

- Tamanhos padrão mantidos
- Hover effects ativos
- Contraste otimizado para telas grandes

## 🌙 Suporte a Temas

### Dark Mode

```css
[data-theme='dark'] .os-icon {
  /* Cores automaticamente ajustadas */
}
```

### High Contrast

```css
@media (prefers-contrast: high) {
  .os-icon {
    /* Contraste aumentado automaticamente */
  }
}
```

## 🎯 Boas Práticas

### 1. Escolha do Tipo de Ícone

- **Material Icons**: Para ícones consistentes e profissionais (padrão)
- **Font Awesome**: Para ícones específicos não disponíveis no Material
- **SVG Customizado**: Para ícones únicos do produto

### 2. Acessibilidade

- Use `ariaHidden="true"` para ícones decorativos
- Use `ariaLabel` para ícones informativos
- Use `title` para tooltips em ícones interativos

### 3. Performance

- Prefira Material Icons para melhor performance e consistência
- Use Font Awesome apenas quando necessário
- Use SVG customizado apenas para ícones únicos

### 4. Responsividade

- Teste em diferentes tamanhos de tela
- Verifique contraste em diferentes backgrounds
- Use tamanhos apropriados para o contexto

## 🔧 Troubleshooting

### Ícone Não Aparece

1. Verifique se o nome está correto
2. Verifique se o Font Awesome está carregado (se usando)
3. Verifique se o SVG está válido (se usando)

### Problemas de Acessibilidade

1. Verifique se `ariaHidden` está configurado corretamente
2. Verifique se `ariaLabel` está presente para ícones informativos
3. Teste com screen reader

### Problemas de Contraste

1. Verifique se o background não interfere
2. Use variantes de cor apropriadas
3. Teste em modo escuro e claro

## 📚 Referências

- [Font Awesome Icons](https://fontawesome.com/icons)
- [Material Design Icons](https://fonts.google.com/icons)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Orca Sonhos Design System](../README.md)
