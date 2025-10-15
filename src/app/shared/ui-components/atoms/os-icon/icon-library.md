# Biblioteca de Ícones - Orca Sonhos Design System

## 📚 Visão Geral

O componente `os-icon` suporta três tipos de ícones:

1. **Ícones Emoji** (padrão) - 147 ícones mapeados
2. **Font Awesome** - Suporte completo via `fontSet` e `fontIcon`
3. **Ícones SVG Customizados** - Suporte para SVG inline

## 🎯 Ícones Emoji Disponíveis (147 ícones)

### Navegação e Interface

- `home` - 🏠 Casa
- `menu` - ☰ Menu
- `close` - ✕ Fechar
- `back` - ← Voltar
- `forward` - → Avançar
- `up` - ↑ Cima
- `down` - ↓ Baixo
- `left` - ← Esquerda
- `right` - → Direita
- `add` - + Adicionar
- `remove` - − Remover
- `edit` - ✏ Editar
- `delete` - 🗑 Deletar
- `save` - 💾 Salvar
- `cancel` - ✕ Cancelar
- `confirm` - ✓ Confirmar
- `search` - 🔍 Buscar
- `filter` - 🔽 Filtrar
- `sort` - ⇅ Ordenar
- `refresh` - ↻ Atualizar
- `settings` - ⚙ Configurações
- `help` - ? Ajuda
- `info` - ℹ Informação

### Status e Feedback

- `warning` - ⚠ Aviso
- `error` - ❌ Erro
- `success` - ✅ Sucesso
- `loading` - ⟳ Carregando
- `spinner` - ⟳ Spinner
- `check` - ✓ Check
- `cross` - ✕ Cruz
- `plus` - + Mais
- `minus` - − Menos

### Usuários e Perfis

- `user` - 👤 Usuário
- `users` - 👥 Usuários
- `profile` - 👤 Perfil
- `logout` - ↪ Sair
- `login` - ↩ Entrar

### Financeiro

- `money` - 💰 Dinheiro
- `wallet` - 👛 Carteira
- `credit-card` - 💳 Cartão de Crédito
- `bank` - 🏦 Banco
- `chart` - 📊 Gráfico
- `trending-up` - 📈 Tendência Alta
- `trending-down` - 📉 Tendência Baixa
- `calculator` - 🧮 Calculadora

### Comunicação

- `mail` - ✉ Email
- `phone` - 📞 Telefone
- `message` - 💬 Mensagem
- `notification` - 🔔 Notificação
- `bell` - 🔔 Sino

### Arquivos e Documentos

- `file` - 📄 Arquivo
- `folder` - 📁 Pasta
- `download` - ⬇ Download
- `upload` - ⬆ Upload
- `attachment` - 📎 Anexo

### Tempo e Data

- `calendar` - 📅 Calendário
- `clock` - 🕐 Relógio
- `time` - ⏰ Tempo
- `date` - 📅 Data

### Mídia

- `play` - ▶ Play
- `pause` - ⏸ Pausar
- `stop` - ⏹ Parar
- `volume` - 🔊 Volume
- `mute` - 🔇 Mudo

### Interação Social

- `like` - 👍 Curtir
- `dislike` - 👎 Não Curtir
- `share` - 📤 Compartilhar
- `star` - ⭐ Estrela
- `heart` - ❤ Coração

### Setas e Navegação

- `arrow-up` - ↑ Seta Cima
- `arrow-down` - ↓ Seta Baixo
- `arrow-left` - ← Seta Esquerda
- `arrow-right` - → Seta Direita
- `chevron-up` - ⌃ Chevron Cima
- `chevron-down` - ⌄ Chevron Baixo
- `chevron-left` - ⌃ Chevron Esquerda
- `chevron-right` - ⌄ Chevron Direita

### Interface

- `dots` - ⋯ Pontos
- `more` - ⋯ Mais
- `menu-dots` - ⋯ Menu Pontos

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

- **Emoji**: Para ícones simples e universais
- **Font Awesome**: Para ícones profissionais e consistentes
- **SVG Customizado**: Para ícones únicos do produto

### 2. Acessibilidade

- Use `ariaHidden="true"` para ícones decorativos
- Use `ariaLabel` para ícones informativos
- Use `title` para tooltips em ícones interativos

### 3. Performance

- Prefira ícones emoji para melhor performance
- Use Font Awesome para consistência visual
- Use SVG customizado apenas quando necessário

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
