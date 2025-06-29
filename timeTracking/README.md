
# Time‑Tracking Script (`timeTracking_Sub_Test.js`)

## Overview

This Node.js script reads raw **TSV** time‑clock data, applies quality rules, generates participation metrics, **and now exports a weekly ranking to CSV**. It is used by the Network Theory Applied Research Institute (NTARI) to track volunteer hours in a transparent and reproducible way.

### Input format

Provide a tab‑separated table containing at least these headers (case‑sensitive):

```
UserID   Name   Clock In   Clock Out   Notes
```

Each row represents a clock‑in/clock‑out pair.

You can now pass a `.tsv` file via the command line:

```bash
node timeTracking_Sub_Test.js my_data.tsv
```

---

## Core Logic

| Step                        | Purpose                                                                                                                                                           |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Normalisation**        | `NAME_MAP` resolves nicknames/typos to a canonical name.                                                                                                          |
| **2. Duration calculation** | `calculateHours()` converts ISO strings → `Date` → hours, returning 0 on error.                                                                                   |
| **3. Quality filter**       | `QUALITY_STANDARDS` defines five presets (8 h, 4 h, 2 h, 1 h, 0 h). Sessions that exceed the active limit **without notes** are discarded via `isValidSession()`. |
| **4. Merge orphan punches** | Consecutive entries that look like *only‑in*/*only‑out* events are merged, rescuing incomplete sessions.                                                          |
| **5. Statistics & ranking** | Hours are aggregated (total + last 7 days), then sorted to build `analysis.ranking`.                                                                              |
| **6. CSV export**           | `exportRankingCSV()` writes `volunteer_ranking.csv` with `Rank, Name, Hours`.                                                                                     |

---

## What Changed 

| Change                     | Where                                                   | Why                                                                                                                                                         |
| -------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CSV export helper**      | `exportRankingCSV()`                                    | Coordinators requested an easy way to import the weekly leaderboard into Google Sheets / Excel. No external libraries—only Node’s built‑in `fs` and `path`. |
| **Safer file path**        | `path.join(__dirname, filename)`                        | Prevents accidental writes to unexpected directories when the script is executed from elsewhere.                                                            |
| **Bigger NAME_MAP**        | Added mixed‑case aliases (e.g. `j graves`, `D BURNETT`) | Avoids duplicate identities in the ranking caused by inconsistent user input.                                                                               |
| **Localized console note** | "Ranking exportado"                                     | Quick visual confirmation for Portuguese‑speaking maintainers.                                                                                              |
| **File input via CLI**     | `process.argv[2]` + `fs.readFileSync()`                 | Enables users to pass TSV data as a file input instead of modifying the script.                                                                             |

---

## Testing Tips

1. Create a `.tsv` file with time data.
2. Run `node timeTracking_Sub_Test.js your_file.tsv`.
3. Open `volunteer_ranking.csv` in any spreadsheet viewer.

> **Troubleshooting:** If the script prints *Invalid or missing time*, check that the `Clock In`/`Clock Out` values are valid ISO‑8601 or locale strings that Node.js can parse.

---

# Português 🇧🇷

## Visão Geral

Este script em Node.js lê dados de ponto em formato TSV, aplica regras de qualidade, gera métricas de participação **e agora exporta o ranking semanal para CSV**. Ele é usado pelo NTARI para controlar horas de voluntariado de maneira transparente e reproduzível.

### Formato de Entrada

A tabela TSV precisa ter os seguintes cabeçalhos (sensíveis a maiúsculas):

```
UserID   Name   Clock In   Clock Out   Notes
```

Agora é possível passar um arquivo `.tsv` direto pelo terminal:

```bash
node timeTracking_Sub_Test.js meus_dados.tsv
```

---

## Lógica Principal

| Etapa                          | Objetivo                                                                                                                    |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| **1. Normalização**            | `NAME_MAP` padroniza apelidos/typos para um nome único.                                                                     |
| **2. Cálculo de duração**      | `calculateHours()` converte strings ISO → horas, retornando 0 em caso de erro.                                              |
| **3. Filtro de qualidade**     | `QUALITY_STANDARDS` define cinco limites (8, 4, 2, 1, 0 h). Sessões que ultrapassam o limite **sem notas** são descartadas. |
| **4. Junção de batidas órfãs** | Une entradas apenas‑in/apenas‑out consecutivas, salvando sessões incompletas.                                               |
| **5. Estatísticas & ranking**  | Soma horas totais + últimos 7 dias e ordena o ranking.                                                                      |
| **6. Exportação CSV**          | `exportRankingCSV()` cria `volunteer_ranking.csv` com `Rank,Name,Hours`.                                                    |

---

## O que Mudou

| Mudança                        | Onde                                                       | Motivação                                                                                           |
| ------------------------------ | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Função de exportação CSV**   | `exportRankingCSV()`                                       | Facilitar a importação do ranking no Google Sheets/Excel. Usa apenas módulos nativos `fs` e `path`. |
| **Caminho de arquivo seguro**  | `path.join(__dirname, filename)`                           | Evita sobrescrever arquivos em diretórios errados quando o script é executado em outra pasta.       |
| **NAME_MAP ampliado**          | Inclusão de aliases com variações de maiúsculas/minúsculas | Previne duplicação de nomes no ranking causada por variações de digitação.                          |
| **Mensagem de console PT‑BR**  | "Ranking exportado"                                        | Confirmação rápida para mantenedores brasileiros.                                                   |
| **Leitura de arquivo via CLI** | `process.argv[2]` + `fs.readFileSync()`                    | Permite rodar o script com qualquer arquivo `.tsv` de entrada, sem editar o código.                 |

---

## Testando

1. Crie um arquivo `.tsv` com seus dados.
2. Execute `node timeTracking_Sub_Test.js seu_arquivo.tsv`.
3. Abra o `volunteer_ranking.csv` em qualquer planilha.
