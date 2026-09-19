# College Circuit

Full-stack platform for college students to request freelance projects and follow delivery progress.

## Run locally

1. Create a PostgreSQL database named `college_circuit`.
2. Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL`.
3. Run `pip install -r backend/requirements.txt`, then `python backend/manage.py migrate` and `python backend/manage.py runserver`.
4. Run `npm install` and `npm run dev` inside `frontend`.

Staff users can manage requests at `/admin` in the app, or Django admin at `http://localhost:8000/admin`.
