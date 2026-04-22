# Maeez Portfolio

Personal portfolio site built with React and Vite.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Contact Form

The contact form uses EmailJS when these environment variables are set:

- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

Optional:

- `VITE_CONTACT_EMAIL`

If the EmailJS variables are missing, the form falls back to opening the visitor's email app with the message pre-filled.

Incoming form data is delivered to the email inbox configured inside your EmailJS service/template.

## Environment File

Create a local `.env` file from `.env.example` before testing the contact form.
