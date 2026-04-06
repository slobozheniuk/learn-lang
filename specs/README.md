# Learn Lang — Feature Specs

Build order is designed so each spec builds on the previous ones. Start from the top and work down.

## Foundation Layer
| # | Spec | Description |
|---|------|-------------|
| 01 | [Project Scaffold](./01-project-scaffold.md) | Mono-repo, Next.js, FastAPI, PostgreSQL, Docker Compose |
| 02 | [Database Schema & User Model](./02-database-schema-user-model.md) | Users table, allowlist, Alembic migrations |
| 03 | [Authentication (Auth0)](./03-authentication-auth0.md) | Login/logout, JWT validation, allowlist enforcement |
| 04 | [Onboarding & Language Selection](./04-onboarding-language-selection.md) | First-login language picker flow |
| 05 | [Dashboard Shell & Navigation](./05-dashboard-shell-navigation.md) | App layout, sidebar, placeholder widgets |

## Core Reading Experience
| # | Spec | Description |
|---|------|-------------|
| 06 | [Content Ingestion: Text Paste](./06-content-ingestion-text-paste.md) | Paste text → store → display in Learning Stack |
| 07 | [AI Text Adaptation](./07-ai-text-adaptation.md) | Ilya Frank method via OpenRouter AI |
| 08 | [Reader View](./08-reader-view.md) | Reading UI with TTS pronunciation |

## Vocabulary & SRS
| # | Spec | Description |
|---|------|-------------|
| 09 | [Vocabulary Extraction](./09-vocabulary-extraction.md) | Extract words from text, build word_progress table |
| 10 | [SRS Flashcard Review](./10-srs-flashcard-review.md) | SM-2 algorithm, card UI, session summary |

## Additional Ingestion Methods
| # | Spec | Description |
|---|------|-------------|
| 11 | [Content Ingestion: PDF](./11-content-ingestion-pdf.md) | PDF upload + text extraction via pdfplumber |
| 12 | [Content Ingestion: Image (OCR)](./12-content-ingestion-image-ocr.md) | Image upload + EasyOCR with user review |
| 13 | [Content Ingestion: YouTube](./13-content-ingestion-youtube.md) | YouTube URL → transcript extraction |

## Extended Features
| # | Spec | Description |
|---|------|-------------|
| 14 | [Suggest Translation Mode](./14-suggest-translation-mode.md) | Multi-variation AI translations with SRS push |
| 15 | [Grammar Roadmap](./15-grammar-roadmap.md) | Passive grammar tracking + mastery tests |
| 16 | [Settings & Preferences](./16-settings-preferences.md) | Profile, theme, SRS limits, data export |

## Infrastructure
| # | Spec | Description |
|---|------|-------------|
| 17 | [Background Processing](./17-background-processing.md) | Async pipeline with step tracking + retry |
| 18 | [Deployment (Docker + Dokploy)](./18-deployment-docker-dokploy.md) | Production Docker config, Dokploy integration |

## Dependency Graph

```mermaid
graph TD
    S01[01 Scaffold] --> S02[02 DB Schema]
    S02 --> S03[03 Auth0]
    S03 --> S04[04 Onboarding]
    S04 --> S05[05 Dashboard]
    S05 --> S06[06 Text Paste]
    S06 --> S07[07 AI Adaptation]
    S07 --> S08[08 Reader View]
    S07 --> S09[09 Vocab Extraction]
    S09 --> S10[10 SRS Review]
    S06 --> S11[11 PDF Upload]
    S06 --> S12[12 Image OCR]
    S06 --> S13[13 YouTube]
    S05 --> S14[14 Translate Mode]
    S09 --> S15[15 Grammar Roadmap]
    S05 --> S16[16 Settings]
    S07 --> S17[17 Background Processing]
    S01 --> S18[18 Deployment]
```
