# Deployment Notes

- Configure `DATABASE_URL` for the target MySQL instance.
- Run the service with a process manager (systemd, pm2, or docker).
- Expose port 8001 behind a reverse proxy if needed.
