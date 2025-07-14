
# TimeTracking Automation

## 🇺🇸 English

Automate the generation and delivery of volunteer certificates based on data submitted via Wix Forms, using Wix Velo and the Canva API. This solution is designed for organizations seeking to recognize volunteer contributions in a professional and efficient way.

### Objective

The goal of this project is to automate the entire certificate generation workflow:

- Capture volunteer data via Wix Forms;
- Automatically fill a certificate template in Canva;
- Generate the certificate in PDF format;
- Send the certificate by email to the volunteer.

### Solution Architecture

#### Current System

- Wix Form → Google Sheet (manual analysis)

#### Proposed System

- Wix Form → Wix Velo Backend → Canva API → PDF Certificate → Email Delivery

### Features

- Direct integration with Canva Enterprise Connect API;
- Automatic filling of template fields (name, hours, date, project, etc.);
- Generation of professional and personalized certificates;
- Automatic email delivery with PDF download link;
- Secure key handling via Wix Secrets Manager.

### Technologies Used

- Wix Velo
- Canva Connect API or Templated.io for testing
- JavaScript (Wix Backend)
- HTML/CSS (Email Template)

### Requirements

- Canva Enterprise account (or Templated.io as an alternative)
- Wix account with Velo enabled
- API keys (stored securely):
  - CANVA_API_KEY
  - CANVA_TEMPLATE_ID
  - EMAIL_SERVICE_KEY

### How It Works

1. **Create a Template in Canva**  
   Create a Brand Template with the following fields:
   - `volunteer_name`
   - `hours_worked`
   - `date_issued`
   - `project_description`
   - `organization_logo`

2. **Configure Backend in Wix Velo**  
   - Capture form data;
   - Call Canva Autofill API;
   - Generate and export the certificate as PDF;
   - Send the email with the certificate.

3. **Workflow Example**
   - Volunteer submits Wix Form ➜
   - Wix Velo processes the data ➜
   - Canva fills the template ➜
   - PDF is generated ➜
   - Email is sent to the volunteer

---

## 🇧🇷 Português

Automatize a geração e o envio de certificados de voluntariado com base nos dados enviados por meio de formulários Wix, utilizando Wix Velo e a API do Canva. Esta solução foi desenvolvida para organizações que desejam reconhecer a contribuição dos voluntários de forma automática, profissional e eficiente.

### Objetivo

O objetivo deste projeto é automatizar todo o fluxo de geração de certificados:

- Capturar dados dos voluntários por meio de formulários Wix;
- Preencher automaticamente um template de certificado no Canva;
- Gerar o certificado em formato PDF;
- Enviar o certificado por e-mail ao voluntário.

### Arquitetura da Solução

#### Sistema Atual

- Formulário Wix → Planilha Google (análise manual)

#### Sistema Proposto

- Formulário Wix → Backend com Wix Velo → API do Canva → Certificado em PDF → Envio por e-mail

### Funcionalidades

- Integração direta com a API Connect do Canva Enterprise;
- Preenchimento automático dos campos do template (nome, horas, data, projeto, etc.);
- Geração de certificados profissionais e personalizados;
- Envio automático por e-mail com link para download do PDF;
- Armazenamento seguro de chaves via Wix Secrets Manager.

### Tecnologias Utilizadas

- Wix Velo
- Canva Connect API ou Templated.io para testes
- JavaScript (Backend no Wix)
- HTML/CSS (Template de E-mail)

### Requisitos

- Conta Canva Enterprise (ou Templated.io como alternativa)
- Conta Wix com Velo ativado
- Chaves de API (armazenadas com segurança):
  - CANVA_API_KEY
  - CANVA_TEMPLATE_ID
  - EMAIL_SERVICE_KEY

### Como Funciona

1. **Criar Template no Canva**  
   Criar um Brand Template com os seguintes campos:
   - `volunteer_name`
   - `hours_worked`
   - `date_issued`
   - `project_description`
   - `organization_logo`

2. **Configurar o Backend no Wix Velo**  
   - Capturar os dados do formulário;
   - Chamar a API de preenchimento do Canva;
   - Gerar e exportar o certificado em PDF;
   - Enviar o e-mail com o certificado.

3. **Exemplo de Fluxo**
   - Voluntário preenche o Formulário Wix ➜
   - Wix Velo processa os dados ➜
   - Canva preenche o template ➜
   - PDF é gerado ➜
   - E-mail é enviado ao voluntário
